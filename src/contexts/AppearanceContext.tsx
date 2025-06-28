import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HeroContent {
  id: string;
  main_heading: string;
  subheading: string;
  cta_button_text: string;
  banner_image_url?: string;
  is_published: boolean;
  updated_at: string;
}

interface ContactInfo {
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
  business_hours?: any;
  google_maps_embed?: string;
  is_published: boolean;
  updated_at: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
}

interface SiteSettings {
  id: string;
  setting_key: string;
  setting_value: any;
  is_published: boolean;
  updated_at: string;
}

interface AppearanceContextType {
  heroContent: HeroContent | null;
  contactInfo: ContactInfo | null;
  socialLinks: SocialLink[];
  siteSettings: Record<string, any>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('is_published', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading hero content:', error);
        return;
      }

      setHeroContent(data);
    } catch (error) {
      console.error('Error loading hero content:', error);
    }
  };

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_published', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading contact info:', error);
        return;
      }

      setContactInfo(data);
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const loadSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading social links:', error);
        return;
      }

      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  };

  const loadSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('is_published', true);

      if (error) {
        console.error('Error loading site settings:', error);
        return;
      }

      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>);

      setSiteSettings(settingsMap);
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadHeroContent(),
        loadContactInfo(),
        loadSocialLinks(),
        loadSiteSettings()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Set up real-time subscriptions
    const heroSubscription = supabase
      .channel('hero_content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hero_content' },
        (payload) => {
          console.log('Hero content updated:', payload);
          loadHeroContent();
        }
      )
      .subscribe();

    const contactSubscription = supabase
      .channel('contact_info_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contact_info' },
        (payload) => {
          console.log('Contact info updated:', payload);
          loadContactInfo();
        }
      )
      .subscribe();

    const socialSubscription = supabase
      .channel('social_links_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'social_links' },
        (payload) => {
          console.log('Social links updated:', payload);
          loadSocialLinks();
        }
      )
      .subscribe();

    const settingsSubscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          console.log('Site settings updated:', payload);
          loadSiteSettings();
        }
      )
      .subscribe();

    return () => {
      heroSubscription.unsubscribe();
      contactSubscription.unsubscribe();
      socialSubscription.unsubscribe();
      settingsSubscription.unsubscribe();
    };
  }, []);

  return (
    <AppearanceContext.Provider value={{
      heroContent,
      contactInfo,
      socialLinks,
      siteSettings,
      isLoading,
      refreshData
    }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};