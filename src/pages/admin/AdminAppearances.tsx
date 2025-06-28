import React, { useState, useEffect } from 'react';
import { 
  Upload, Save, Eye, Edit, Trash2, Plus, Move, Settings, 
  Image, Type, Phone, Mail, MapPin, Clock, Globe, FileText,
  HelpCircle, ChevronDown, ChevronUp, GripVertical, Monitor,
  Palette, Layout, MessageSquare, Shield, Users
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  is_published: boolean;
  updated_at: string;
  updated_by: string;
}

interface HeroContent {
  id: string;
  main_heading: string;
  subheading: string;
  cta_button_text: string;
  banner_image_url?: string;
  banner_storage_path?: string;
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
  business_hours: any;
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

interface LegalPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  version: number;
  is_published: boolean;
  updated_at: string;
}

interface FAQCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_visible: boolean;
  faq_items?: FAQItem[];
}

interface FAQItem {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_visible: boolean;
}

const AdminAppearances: React.FC = () => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('logo');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for different sections
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);

  // Form states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadSiteSettings(),
        loadHeroContent(),
        loadContactInfo(),
        loadSocialLinks(),
        loadLegalPages(),
        loadFAQData()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load appearance data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('setting_key');
    
    if (error) throw error;
    setSiteSettings(data || []);
  };

  const loadHeroContent = async () => {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    setHeroContent(data);
  };

  const loadContactInfo = async () => {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    setContactInfo(data);
  };

  const loadSocialLinks = async () => {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    setSocialLinks(data || []);
  };

  const loadLegalPages = async () => {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .order('page_type');
    
    if (error) throw error;
    setLegalPages(data || []);
  };

  const loadFAQData = async () => {
    const { data, error } = await supabase
      .from('faq_categories')
      .select(`
        *,
        faq_items(*)
      `)
      .order('display_order');
    
    if (error) throw error;
    setFaqCategories(data || []);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const uploadFile = async (file: File, folder: string): Promise<{ url: string; path: string }> => {
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
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setIsLoading(true);
    try {
      const { url, path } = await uploadFile(logoFile, 'logos');

      // Update site settings
      await supabase
        .from('site_settings')
        .upsert([
          { setting_key: 'logo_url', setting_value: JSON.stringify(url), is_published: true, updated_by: user?.id },
          { setting_key: 'logo_storage_path', setting_value: JSON.stringify(path), is_published: true, updated_by: user?.id }
        ]);

      await loadSiteSettings();
      setLogoFile(null);
      showMessage('success', 'Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      showMessage('error', 'Failed to upload logo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroUpdate = async (formData: Partial<HeroContent>) => {
    setIsLoading(true);
    try {
      let bannerData = {};
      
      if (bannerFile) {
        const { url, path } = await uploadFile(bannerFile, 'banners');
        bannerData = { banner_image_url: url, banner_storage_path: path };
      }

      const updateData = {
        ...formData,
        ...bannerData,
        updated_by: user?.id
      };

      if (heroContent?.id) {
        await supabase
          .from('hero_content')
          .update(updateData)
          .eq('id', heroContent.id);
      } else {
        await supabase
          .from('hero_content')
          .insert([updateData]);
      }

      await loadHeroContent();
      setBannerFile(null);
      showMessage('success', 'Hero content updated successfully');
    } catch (error) {
      console.error('Error updating hero content:', error);
      showMessage('error', 'Failed to update hero content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactUpdate = async (formData: Partial<ContactInfo>) => {
    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
        updated_by: user?.id
      };

      if (contactInfo?.id) {
        await supabase
          .from('contact_info')
          .update(updateData)
          .eq('id', contactInfo.id);
      } else {
        await supabase
          .from('contact_info')
          .insert([updateData]);
      }

      await loadContactInfo();
      showMessage('success', 'Contact information updated successfully');
    } catch (error) {
      console.error('Error updating contact info:', error);
      showMessage('error', 'Failed to update contact information');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async (table: string, id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from(table)
        .update({ is_published: !currentStatus, updated_by: user?.id })
        .eq('id', id);

      await loadAllData();
      showMessage('success', `Content ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      showMessage('error', 'Failed to update publish status');
    }
  };

  const tabs = [
    { id: 'logo', label: 'Logo Management', icon: Image },
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'legal', label: 'Legal Pages', icon: FileText },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle }
  ];

  const renderLogoManagement = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Logo</h3>
        
        {siteSettings.find(s => s.setting_key === 'logo_url')?.setting_value ? (
          <div className="mb-6">
            <img
              src={JSON.parse(siteSettings.find(s => s.setting_key === 'logo_url')?.setting_value || '""')}
              alt="Current Logo"
              className="h-16 object-contain bg-gray-50 p-2 rounded-lg"
            />
          </div>
        ) : (
          <div className="mb-6 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No logo uploaded</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload New Logo
            </label>
            <input
              type="file"
              accept=".png,.svg"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 200x60px, PNG/SVG with transparent background, max 2MB
            </p>
          </div>

          {logoFile && (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Selected: {logoFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  Size: {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleLogoUpload}
                disabled={isLoading}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {isLoading ? 'Uploading...' : 'Upload Logo'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHeroSection = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Content</h3>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleHeroUpdate({
            main_heading: formData.get('main_heading') as string,
            subheading: formData.get('subheading') as string,
            cta_button_text: formData.get('cta_button_text') as string,
            is_published: true
          });
        }} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Heading (max 60 characters)
            </label>
            <input
              type="text"
              name="main_heading"
              maxLength={60}
              defaultValue={heroContent?.main_heading || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Find Your Dream Home in Malaysia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subheading (max 120 characters)
            </label>
            <input
              type="text"
              name="subheading"
              maxLength={120}
              defaultValue={heroContent?.subheading || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Discover the perfect property for rent or purchase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Call-to-Action Button Text
            </label>
            <input
              type="text"
              name="cta_button_text"
              defaultValue={heroContent?.cta_button_text || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Start Searching"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Banner Image
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required: 1920x600px, JPG/PNG, max 5MB
            </p>
          </div>

          {heroContent?.banner_image_url && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Banner:</p>
              <img
                src={heroContent.banner_image_url}
                alt="Current Banner"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            
            {heroContent && (
              <button
                type="button"
                onClick={() => handlePublishToggle('hero_content', heroContent.id, heroContent.is_published)}
                className={`px-4 py-2 rounded-lg ${
                  heroContent.is_published 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {heroContent.is_published ? 'Published' : 'Draft'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Information</h3>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          
          const businessHours = {
            monday: formData.get('monday') as string,
            tuesday: formData.get('tuesday') as string,
            wednesday: formData.get('wednesday') as string,
            thursday: formData.get('thursday') as string,
            friday: formData.get('friday') as string,
            saturday: formData.get('saturday') as string,
            sunday: formData.get('sunday') as string,
          };

          handleContactUpdate({
            business_name: formData.get('business_name') as string,
            address_line1: formData.get('address_line1') as string,
            address_line2: formData.get('address_line2') as string,
            address_line3: formData.get('address_line3') as string,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            postal_code: formData.get('postal_code') as string,
            country: formData.get('country') as string,
            primary_phone: formData.get('primary_phone') as string,
            secondary_phone: formData.get('secondary_phone') as string,
            primary_email: formData.get('primary_email') as string,
            secondary_email: formData.get('secondary_email') as string,
            google_maps_embed: formData.get('google_maps_embed') as string,
            business_hours: businessHours,
            is_published: true
          });
        }} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                defaultValue={contactInfo?.business_name || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                defaultValue={contactInfo?.country || 'Malaysia'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Address</h4>
            <input
              type="text"
              name="address_line1"
              placeholder="Address Line 1"
              defaultValue={contactInfo?.address_line1 || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              name="address_line2"
              placeholder="Address Line 2 (Optional)"
              defaultValue={contactInfo?.address_line2 || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <input
              type="text"
              name="address_line3"
              placeholder="Address Line 3 (Optional)"
              defaultValue={contactInfo?.address_line3 || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={contactInfo?.city || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                defaultValue={contactInfo?.state || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                name="postal_code"
                placeholder="Postal Code"
                defaultValue={contactInfo?.postal_code || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Phone
              </label>
              <input
                type="tel"
                name="primary_phone"
                defaultValue={contactInfo?.primary_phone || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Phone (Optional)
              </label>
              <input
                type="tel"
                name="secondary_phone"
                defaultValue={contactInfo?.secondary_phone || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Email
              </label>
              <input
                type="email"
                name="primary_email"
                defaultValue={contactInfo?.primary_email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Email (Optional)
              </label>
              <input
                type="email"
                name="secondary_email"
                defaultValue={contactInfo?.secondary_email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Business Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                    {day}
                  </label>
                  <input
                    type="text"
                    name={day}
                    defaultValue={contactInfo?.business_hours?.[day] || ''}
                    placeholder="9:00 AM - 6:00 PM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Maps Embed Code (Optional)
            </label>
            <textarea
              name="google_maps_embed"
              rows={3}
              defaultValue={contactInfo?.google_maps_embed || ''}
              placeholder="<iframe src='...' ></iframe>"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Contact Info'}
            </button>
            
            {contactInfo && (
              <button
                type="button"
                onClick={() => handlePublishToggle('contact_info', contactInfo.id, contactInfo.is_published)}
                className={`px-4 py-2 rounded-lg ${
                  contactInfo.is_published 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {contactInfo.is_published ? 'Published' : 'Draft'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'logo':
        return renderLogoManagement();
      case 'hero':
        return renderHeroSection();
      case 'contact':
        return renderContactInfo();
      case 'social':
        return <div className="text-center py-12 text-gray-500">Social Links management coming soon...</div>;
      case 'legal':
        return <div className="text-center py-12 text-gray-500">Legal Pages editor coming soon...</div>;
      case 'faq':
        return <div className="text-center py-12 text-gray-500">FAQ Manager coming soon...</div>;
      default:
        return renderLogoManagement();
    }
  };

  return (
    <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Appearances
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Customize your website's appearance and content
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAppearances;