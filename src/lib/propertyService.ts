import { supabase } from './supabase';
import { Property, PropertyFormData, PropertyFilters, PropertyInquiry, Amenity } from '../types/property';

export class PropertyService {
  // Get all amenities
  static async getAmenities(): Promise<Amenity[]> {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get properties with filters and real-time capabilities
  static async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*),
        amenities:property_amenities(
          amenity:amenities(*)
        ),
        seller:users!seller_id(id, name, email, phone, verified)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }

    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }

    if (filters.listing_type) {
      query = query.eq('listing_type', filters.listing_type);
    }

    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }

    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }

    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    if (filters.status !== undefined) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      // If status is undefined, don't filter by status (admin view)
    } else {
      // Default to active properties for public viewing
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get property statistics for admin dashboard
  static async getPropertyStats(): Promise<{
    total: number;
    pending: number;
    active: number;
    suspended: number;
    featured: number;
  }> {
    const { data, error } = await supabase
      .from('properties')
      .select('status, featured');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(p => p.status === 'pending').length || 0,
      active: data?.filter(p => p.status === 'active').length || 0,
      suspended: data?.filter(p => p.status === 'suspended').length || 0,
      featured: data?.filter(p => p.featured).length || 0,
    };

    return stats;
  }

  // Get property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*),
        amenities:property_amenities(
          amenity:amenities(*)
        ),
        seller:users!seller_id(id, name, email, phone, verified)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  // Get properties by seller
  static async getPropertiesBySeller(sellerId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        images:property_images(*),
        amenities:property_amenities(
          amenity:amenities(*)
        )
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Create property with enhanced error handling
  static async createProperty(propertyData: PropertyFormData & { status?: string }, sellerId: string): Promise<Property> {
    const { amenity_ids, featured_image, additional_images, status, ...propertyFields } = propertyData;

    console.log('Creating property with data:', { ...propertyFields, seller_id: sellerId, status: status || 'draft' });

    // Create property record with specified status or default to draft
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        ...propertyFields,
        seller_id: sellerId,
        status: status || 'draft',
        published_at: status === 'active' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (propertyError) {
      console.error('Error creating property:', propertyError);
      throw new Error(`Failed to create property: ${propertyError.message}`);
    }

    console.log('Property created successfully:', property);

    try {
      // Upload images if provided
      if (featured_image || additional_images.length > 0) {
        await this.uploadPropertyImages(property.id, featured_image, additional_images);
      }

      // Add amenities
      if (amenity_ids.length > 0) {
        await this.addPropertyAmenities(property.id, amenity_ids);
      }
    } catch (error) {
      // If image upload or amenity addition fails, we should still return the property
      // but log the error for debugging
      console.error('Error uploading images or adding amenities:', error);
      // Don't throw here as the property was created successfully
    }

    return property;
  }

  // Update property
  static async updateProperty(id: string, propertyData: Partial<PropertyFormData>): Promise<Property> {
    const { amenity_ids, featured_image, additional_images, ...propertyFields } = propertyData;

    const { data: property, error } = await supabase
      .from('properties')
      .update(propertyFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update amenities if provided
    if (amenity_ids) {
      await this.updatePropertyAmenities(id, amenity_ids);
    }

    // Upload new images if provided
    if (featured_image || (additional_images && additional_images.length > 0)) {
      await this.uploadPropertyImages(id, featured_image, additional_images || []);
    }

    return property;
  }

  // Delete property
  static async deleteProperty(id: string): Promise<void> {
    // Delete associated images from storage
    await this.deletePropertyImages(id);

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Upload property images
  static async uploadPropertyImages(
    propertyId: string, 
    featuredImage?: File, 
    additionalImages: File[] = []
  ): Promise<void> {
    const images = [];
    
    if (featuredImage) {
      images.push({ file: featuredImage, isFeatured: true });
    }
    
    additionalImages.forEach(file => {
      images.push({ file, isFeatured: false });
    });

    for (let i = 0; i < images.length; i++) {
      const { file, isFeatured } = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      try {
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue; // Skip this image and continue with others
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        // Save image record
        const { error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            image_url: publicUrl,
            storage_path: fileName,
            is_featured: isFeatured,
            display_order: i,
            alt_text: file.name
          });

        if (imageError) {
          console.error('Error saving image record:', imageError);
          // Try to clean up the uploaded file
          await supabase.storage
            .from('property-images')
            .remove([fileName]);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue with other images
      }
    }
  }

  // Delete property images
  static async deletePropertyImages(propertyId: string): Promise<void> {
    // Get image records
    const { data: images, error: fetchError } = await supabase
      .from('property_images')
      .select('storage_path')
      .eq('property_id', propertyId);

    if (fetchError) throw fetchError;

    // Delete from storage
    if (images && images.length > 0) {
      const filePaths = images.map(img => img.storage_path);
      const { error: storageError } = await supabase.storage
        .from('property-images')
        .remove(filePaths);

      if (storageError) throw storageError;
    }

    // Delete image records
    const { error: deleteError } = await supabase
      .from('property_images')
      .delete()
      .eq('property_id', propertyId);

    if (deleteError) throw deleteError;
  }

  // Add property amenities
  static async addPropertyAmenities(propertyId: string, amenityIds: string[]): Promise<void> {
    if (amenityIds.length === 0) return;

    const amenityRecords = amenityIds.map(amenityId => ({
      property_id: propertyId,
      amenity_id: amenityId
    }));

    const { error } = await supabase
      .from('property_amenities')
      .insert(amenityRecords);

    if (error) {
      console.error('Error adding amenities:', error);
      throw error;
    }
  }

  // Update property amenities
  static async updatePropertyAmenities(propertyId: string, amenityIds: string[]): Promise<void> {
    // Delete existing amenities
    await supabase
      .from('property_amenities')
      .delete()
      .eq('property_id', propertyId);

    // Add new amenities
    if (amenityIds.length > 0) {
      await this.addPropertyAmenities(propertyId, amenityIds);
    }
  }

  // Update property status
  static async updatePropertyStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .update({ 
        status,
        published_at: status === 'active' ? new Date().toISOString() : undefined
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating property status:', error);
      throw error;
    }
  }

  // Increment view count
  static async incrementViewCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_property_views', {
      property_uuid: id
    });

    if (error) throw error;
  }

  // Create property inquiry
  static async createInquiry(
    propertyId: string,
    buyerId: string,
    message: string,
    contactPhone?: string,
    contactEmail?: string
  ): Promise<PropertyInquiry> {
    // Get property to find seller
    const property = await this.getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');

    const { data, error } = await supabase
      .from('property_inquiries')
      .insert({
        property_id: propertyId,
        buyer_id: buyerId,
        seller_id: property.seller_id,
        message,
        contact_phone: contactPhone,
        contact_email: contactEmail
      })
      .select()
      .single();

    if (error) throw error;

    // Increment inquiry count
    await supabase.rpc('increment_property_inquiries', {
      property_uuid: propertyId
    });

    return data;
  }

  // Get inquiries for seller
  static async getInquiriesForSeller(sellerId: string): Promise<PropertyInquiry[]> {
    const { data, error } = await supabase
      .from('property_inquiries')
      .select(`
        *,
        property:properties(id, title, price, listing_type),
        buyer:users!buyer_id(id, name, email)
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get inquiries for buyer
  static async getInquiriesForBuyer(buyerId: string): Promise<PropertyInquiry[]> {
    const { data, error } = await supabase
      .from('property_inquiries')
      .select(`
        *,
        property:properties(id, title, price, listing_type)
      `)
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Subscribe to real-time property changes
  static subscribeToProperties(callback: (payload: any) => void) {
    return supabase
      .channel('properties_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'properties' },
        callback
      )
      .subscribe();
  }

  // Subscribe to real-time inquiry changes
  static subscribeToInquiries(callback: (payload: any) => void) {
    return supabase
      .channel('inquiries_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'property_inquiries' },
        callback
      )
      .subscribe();
  }
}