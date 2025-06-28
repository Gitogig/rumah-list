import { supabase } from './supabase';

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  is_published: boolean;
  updated_at: string;
}

export interface HeroContent {
  id: string;
  main_heading: string;
  subheading: string;
  cta_button_text: string;
  banner_image_url?: string;
  is_published: boolean;
}

export interface ContactInfo {
  id: string;
  business_name: string;
  address_line1: string;
  address_line2?: string;
  address_line3?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  primary_phone: string;
  secondary_phone?: string;
  primary_email: string;
  secondary_email?: string;
  business_hours: any;
  google_maps_embed?: string;
  is_published: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
}

export interface LegalPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  version: number;
  is_published: boolean;
  updated_at: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_visible: boolean;
  faq_items?: FAQItem[];
}

export interface FAQItem {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
}

export class AppearanceService {
  // Site Settings
  static async getSiteSettings(): Promise<SiteSetting[]> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('is_published', true)
      .order('setting_key');
    
    if (error) throw error;
    return data || [];
  }

  static async getSiteSetting(key: string): Promise<any> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .eq('is_published', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? JSON.parse(data.setting_value) : null;
  }

  static async updateSiteSetting(key: string, value: any, userId: string): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: key,
        setting_value: JSON.stringify(value),
        is_published: true,
        updated_by: userId
      });
    
    if (error) throw error;
  }

  // Hero Content
  static async getHeroContent(): Promise<HeroContent | null> {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateHeroContent(content: Partial<HeroContent>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('hero_content')
      .upsert({
        ...content,
        updated_by: userId,
        is_published: true
      });
    
    if (error) throw error;
  }

  // Contact Information
  static async getContactInfo(): Promise<ContactInfo | null> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateContactInfo(info: Partial<ContactInfo>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('contact_info')
      .upsert({
        ...info,
        updated_by: userId,
        is_published: true
      });
    
    if (error) throw error;
  }

  // Social Links
  static async getSocialLinks(): Promise<SocialLink[]> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  }

  static async updateSocialLink(link: Partial<SocialLink>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('social_links')
      .upsert({
        ...link,
        updated_by: userId
      });
    
    if (error) throw error;
  }

  static async deleteSocialLink(id: string): Promise<void> {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Legal Pages
  static async getLegalPages(): Promise<LegalPage[]> {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('is_published', true)
      .order('page_type');
    
    if (error) throw error;
    return data || [];
  }

  static async getLegalPage(pageType: string): Promise<LegalPage | null> {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_type', pageType)
      .eq('is_published', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateLegalPage(page: Partial<LegalPage>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('legal_pages')
      .upsert({
        ...page,
        updated_by: userId,
        version: (page.version || 0) + 1
      });
    
    if (error) throw error;
  }

  // FAQ Management
  static async getFAQCategories(): Promise<FAQCategory[]> {
    const { data, error } = await supabase
      .from('faq_categories')
      .select(`
        *,
        faq_items(*)
      `)
      .eq('is_visible', true)
      .order('display_order');
    
    if (error) throw error;
    return data || [];
  }

  static async getFAQItems(categoryId?: string): Promise<FAQItem[]> {
    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_visible', true)
      .order('display_order');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async updateFAQCategory(category: Partial<FAQCategory>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('faq_categories')
      .upsert({
        ...category,
        updated_by: userId
      });
    
    if (error) throw error;
  }

  static async updateFAQItem(item: Partial<FAQItem>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('faq_items')
      .upsert({
        ...item,
        updated_by: userId
      });
    
    if (error) throw error;
  }

  static async deleteFAQCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('faq_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async deleteFAQItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Real-time subscriptions
  static subscribeToAppearanceChanges(callback: (payload: any) => void) {
    return supabase
      .channel('appearance_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_settings' },
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hero_content' },
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_info' },
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'social_links' },
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'legal_pages' },
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'faq_categories' },
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'faq_items' },
        callback
      )
      .subscribe();
  }

  // File upload helper
  static async uploadAsset(file: File, folder: string): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return { url: publicUrl, path: fileName };
  }

  static async deleteAsset(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('site-assets')
      .remove([path]);

    if (error) throw error;
  }
}