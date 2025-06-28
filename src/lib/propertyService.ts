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
    console.log('PropertyService.getProperties called with filters:', filters);
    
    let query = supabase
      .from('properties')
      .select(`
        id, seller_id, title, description, price, property_type, listing_type, address, city, state, zip_code, latitude, longitude, bedrooms, bathrooms, square_footage, lot_size, year_built, contact_name, contact_phone, contact_email, status, featured, views_count, inquiries_count, created_at, updated_at, published_at, expires_at,
        property_images(*),
        property_amenities(
          amenity_id,
          amenities(*)
        ),
        users!properties_seller_id_fkey(id, name, email, phone, verified)
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

    // CRITICAL FIX: Handle status filtering properly for admin
    if (filters.status !== undefined) {
      if (filters.status === null || filters.status === 'all') {
        // Admin wants to see ALL properties - don't filter by status
        console.log('Admin requesting ALL properties - no status filter applied');
      } else {
        // Filter by specific status
        query = query.eq('status', filters.status);
        console.log('Filtering by status:', filters.status);
      }
    } else {
      // Default behavior for public - only show active properties
      query = query.eq('status', 'active');
      console.log('Default public view - filtering for active properties only');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
    
    console.log('PropertyService.getProperties result:', {
      totalCount: data?.length || 0,
      statusBreakdown: data?.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {}
    });

    // Transform the data to match expected structure
    const transformedData = data?.map(property => ({
      ...property,
      images: property.property_images || [],
      amenities: property.property_amenities?.map((pa: any) => ({
        amenity_id: pa.amenity_id,
        amenity: pa.amenities
      })) || [],
      seller: property.users
    })) || [];

    return transformedData;
  }

  // Get comprehensive admin statistics
  static async getAdminStats(): Promise<{
    totalProperties: number;
    totalUsers: number;
    totalSellers: number;
    pendingApprovals: number;
    activeListings: number;
    suspendedProperties: number;
    rejected: number;
    monthlyRevenue: number;
    newUsersThisMonth: number;
    newPropertiesThisMonth: number;
    propertyGrowthPercentage: number;
    userGrowthPercentage: number;
    approvalChangePercentage: number;
  }> {
    try {
      console.log('Fetching admin stats...');
      
      // Get current date ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Get all properties with detailed status breakdown
      const { data: allProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('status, created_at, price, listing_type');

      if (propertiesError) {
        console.error('Error fetching properties for stats:', propertiesError);
        throw propertiesError;
      }

      console.log('Properties for stats:', allProperties?.length || 0);
      console.log('Status breakdown:', allProperties?.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {});

      // Get all users
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('role, created_at');

      if (usersError) {
        console.error('Error fetching users for stats:', usersError);
        throw usersError;
      }

      // Calculate property statistics
      const totalProperties = allProperties?.length || 0;
      const pendingApprovals = allProperties?.filter(p => p.status === 'pending').length || 0;
      const activeListings = allProperties?.filter(p => p.status === 'active').length || 0;
      const suspendedProperties = allProperties?.filter(p => p.status === 'suspended').length || 0;
      const rejected = allProperties?.filter(p => p.status === 'rejected').length || 0;

      // Calculate user statistics
      const totalUsers = allUsers?.length || 0;
      const totalSellers = allUsers?.filter(u => u.role === 'seller').length || 0;

      // Calculate monthly statistics
      const newPropertiesThisMonth = allProperties?.filter(p => 
        new Date(p.created_at) >= startOfMonth
      ).length || 0;

      const newUsersThisMonth = allUsers?.filter(u => 
        new Date(u.created_at) >= startOfMonth
      ).length || 0;

      // Calculate last month statistics for comparison
      const propertiesLastMonth = allProperties?.filter(p => {
        const createdAt = new Date(p.created_at);
        return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
      }).length || 0;

      const usersLastMonth = allUsers?.filter(u => {
        const createdAt = new Date(u.created_at);
        return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
      }).length || 0;

      const pendingLastMonth = allProperties?.filter(p => {
        const createdAt = new Date(p.created_at);
        return p.status === 'pending' && createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
      }).length || 0;

      // Calculate growth percentages
      const propertyGrowthPercentage = propertiesLastMonth > 0 
        ? Math.round(((newPropertiesThisMonth - propertiesLastMonth) / propertiesLastMonth) * 100)
        : newPropertiesThisMonth > 0 ? 100 : 0;

      const userGrowthPercentage = usersLastMonth > 0 
        ? Math.round(((newUsersThisMonth - usersLastMonth) / usersLastMonth) * 100)
        : newUsersThisMonth > 0 ? 100 : 0;

      const approvalChangePercentage = pendingLastMonth > 0 
        ? Math.round(((pendingApprovals - pendingLastMonth) / pendingLastMonth) * 100)
        : pendingApprovals > 0 ? 100 : pendingApprovals === 0 && pendingLastMonth === 0 ? 0 : -100;

      // Calculate estimated monthly revenue (simplified calculation)
      const monthlyRevenue = allProperties?.reduce((total, property) => {
        if (property.status === 'active' && property.listing_type === 'rent') {
          return total + (property.price * 0.05); // 5% commission on rent
        } else if (property.status === 'sold') {
          return total + (property.price * 0.03); // 3% commission on sale
        }
        return total;
      }, 0) || 0;

      const stats = {
        totalProperties,
        totalUsers,
        totalSellers,
        pendingApprovals,
        activeListings,
        suspendedProperties,
        rejected,
        monthlyRevenue: Math.round(monthlyRevenue),
        newUsersThisMonth,
        newPropertiesThisMonth,
        propertyGrowthPercentage,
        userGrowthPercentage,
        approvalChangePercentage
      };

      console.log('Calculated admin stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Return default values if there's an error
      return {
        totalProperties: 0,
        totalUsers: 0,
        totalSellers: 0,
        pendingApprovals: 0,
        activeListings: 0,
        suspendedProperties: 0,
        rejected: 0,
        monthlyRevenue: 0,
        newUsersThisMonth: 0,
        newPropertiesThisMonth: 0,
        propertyGrowthPercentage: 0,
        userGrowthPercentage: 0,
        approvalChangePercentage: 0
      };
    }
  }

  // Get property statistics for admin dashboard
  static async getPropertyStats(): Promise<{
    total: number;
    pending: number;
    active: number;
    suspended: number;
    featured: number;
  }> {
    console.log('Fetching property stats...');
    
    const { data, error } = await supabase
      .from('properties')
      .select('status, featured');

    if (error) {
      console.error('Error fetching property stats:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(p => p.status === 'pending').length || 0,
      active: data?.filter(p => p.status === 'active').length || 0,
      suspended: data?.filter(p => p.status === 'suspended').length || 0,
      featured: data?.filter(p => p.featured).length || 0,
    };

    console.log('Property stats result:', stats);
    return stats;
  }

  // Get property by ID with optimized loading
  static async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id, seller_id, title, description, price, property_type, listing_type, address, city, state, zip_code, latitude, longitude, bedrooms, bathrooms, square_footage, lot_size, year_built, contact_name, contact_phone, contact_email, status, featured, views_count, inquiries_count, created_at, updated_at, published_at, expires_at,
        property_images(*),
        property_amenities(
          amenity_id,
          amenities(*)
        ),
        users!properties_seller_id_fkey(id, name, email, phone, verified)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Transform the data to match expected structure
    const transformedData = {
      ...data,
      images: data.property_images || [],
      amenities: data.property_amenities?.map((pa: any) => ({
        amenity_id: pa.amenity_id,
        amenity: pa.amenities
      })) || [],
      seller: data.users
    };

    return transformedData;
  }

  // Get properties by seller
  static async getPropertiesBySeller(sellerId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id, seller_id, title, description, price, property_type, listing_type, address, city, state, zip_code, latitude, longitude, bedrooms, bathrooms, square_footage, lot_size, year_built, contact_name, contact_phone, contact_email, status, featured, views_count, inquiries_count, created_at, updated_at, published_at, expires_at,
        property_images(*),
        property_amenities(
          amenity_id,
          amenities(*)
        )
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform the data to match expected structure
    const transformedData = data?.map(property => ({
      ...property,
      images: property.property_images || [],
      amenities: property.property_amenities?.map((pa: any) => ({
        amenity_id: pa.amenity_id,
        amenity: pa.amenities
      })) || []
    })) || [];

    return transformedData;
  }

  // Create property with enhanced error handling
  static async createProperty(propertyData: PropertyFormData & { status?: string }, sellerId: string): Promise<Property> {
    const { amenity_ids, featured_image, additional_images, status, amenities, ...propertyFields } = propertyData;

    console.log('Creating property with data:', { ...propertyFields, seller_id: sellerId, status: status || 'draft' });

    try {
      // Create property record with specified status or default to draft
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          ...propertyFields,
          seller_id: sellerId,
          status: status || 'draft',
          published_at: status === 'active' ? new Date().toISOString() : null
        })
        .select(`
          id, seller_id, title, description, price, property_type, listing_type, address, city, state, zip_code, latitude, longitude, bedrooms, bathrooms, square_footage, lot_size, year_built, contact_name, contact_phone, contact_email, status, featured, views_count, inquiries_count, created_at, updated_at, published_at, expires_at,
          property_images(*),
          property_amenities(
            amenity_id,
            amenities(*)
          ),
          users!properties_seller_id_fkey(id, name, email, phone, verified)
        `)
        .single();

      if (propertyError) {
        console.error('Error creating property:', propertyError);
        throw new Error(`Failed to create property: ${propertyError.message}`);
      }

      console.log('Property created successfully:', property);

      try {
        // Upload images if provided (non-blocking)
        if (featured_image || additional_images.length > 0) {
          await this.uploadPropertyImages(property.id, featured_image, additional_images);
        }

        // Add amenities (non-blocking)
        if (amenity_ids.length > 0) {
          await this.addPropertyAmenities(property.id, amenity_ids);
        }
      } catch (error) {
        // If image upload or amenity addition fails, we should still return the property
        // but log the error for debugging
        console.error('Error uploading images or adding amenities:', error);
        // Don't throw here as the property was created successfully
      }

      // Transform the data to match expected structure
      const transformedProperty = {
        ...property,
        images: property.property_images || [],
        amenities: property.property_amenities?.map((pa: any) => ({
          amenity_id: pa.amenity_id,
          amenity: pa.amenities
        })) || [],
        seller: property.users
      };

      return transformedProperty;
    } catch (error: any) {
      console.error('Error in createProperty:', error);
      throw new Error(error.message || 'Failed to create property');
    }
  }

  // Update property with comprehensive support
  static async updateProperty(id: string, propertyData: Partial<PropertyFormData> & { status?: string }): Promise<Property> {
    const { amenity_ids, featured_image, additional_images, status, amenities, ...propertyFields } = propertyData;

    console.log('Updating property with data:', { ...propertyFields, status });

    try {
      // Update the property record
      const updateData: any = { ...propertyFields };
      
      // Handle status updates
      if (status !== undefined) {
        updateData.status = status;
        if (status === 'active') {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { data: property, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select(`
          id, seller_id, title, description, price, property_type, listing_type, address, city, state, zip_code, latitude, longitude, bedrooms, bathrooms, square_footage, lot_size, year_built, contact_name, contact_phone, contact_email, status, featured, views_count, inquiries_count, created_at, updated_at, published_at, expires_at,
          property_images(*),
          property_amenities(
            amenity_id,
            amenities(*)
          ),
          users!properties_seller_id_fkey(id, name, email, phone, verified)
        `)
        .single();

      if (error) {
        console.error('Error updating property:', error);
        throw new Error(`Failed to update property: ${error.message}`);
      }

      console.log('Property updated successfully:', property);

      try {
        // Update amenities if provided (non-blocking)
        if (amenity_ids) {
          await this.updatePropertyAmenities(id, amenity_ids);
        }

        // Upload new images if provided (non-blocking)
        if (featured_image || (additional_images && additional_images.length > 0)) {
          await this.uploadPropertyImages(id, featured_image, additional_images || []);
        }
      } catch (error) {
        console.error('Error updating images or amenities:', error);
        // Don't throw here as the property was updated successfully
      }

      // Transform the data to match expected structure
      const transformedProperty = {
        ...property,
        images: property.property_images || [],
        amenities: property.property_amenities?.map((pa: any) => ({
          amenity_id: pa.amenity_id,
          amenity: pa.amenities
        })) || [],
        seller: property.users
      };

      return transformedProperty;
    } catch (error: any) {
      console.error('Error in updateProperty:', error);
      throw new Error(error.message || 'Failed to update property');
    }
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

  // Upload property images with optimization
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

  // Update property status with approval/rejection workflow
  static async updatePropertyStatus(id: string, status: string): Promise<void> {
    console.log(`Updating property ${id} status to: ${status}`);
    
    const updateData: any = { status };
    
    // Set published_at when approving
    if (status === 'active') {
      updateData.published_at = new Date().toISOString();
    }
    
    // Clear published_at when rejecting or suspending
    if (status === 'rejected' || status === 'suspended') {
      updateData.published_at = null;
    }

    const { error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating property status:', error);
      throw error;
    }
    
    console.log(`Property ${id} status updated to ${status} successfully`);
  }

  // Approve property (admin only)
  static async approveProperty(id: string): Promise<void> {
    console.log(`Approving property: ${id}`);
    await this.updatePropertyStatus(id, 'active');
  }

  // Reject property (admin only)
  static async rejectProperty(id: string): Promise<void> {
    console.log(`Rejecting property: ${id}`);
    await this.updatePropertyStatus(id, 'rejected');
  }

  // Increment view count with debouncing
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