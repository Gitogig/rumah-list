import React, { useState, useEffect } from 'react';
import { 
  Palette, Upload, Save, Eye, Globe, Phone, Mail, MapPin, 
  Clock, Facebook, Twitter, Instagram, Plus, Trash2, Edit,
  Image as ImageIcon, Type, Settings, FileText, HelpCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { useAppearance } from '../../contexts/AppearanceContext';

const AdminAppearances: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { refreshData } = useAppearance();

  // Hero Content State
  const [heroContent, setHeroContent] = useState({
    main_heading: '',
    subheading: '',
    cta_button_text: '',
    banner_image_url: '',
    is_published: false
  });

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    business_name: '',
    address_line1: '',
    address_line2: '',
    address_line3: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Malaysia',
    primary_phone: '',
    secondary_phone: '',
    primary_email: '',
    secondary_email: '',
    business_hours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    google_maps_embed: '',
    is_published: false
  });

  // Social Links State
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Facebook', url: '', icon_name: 'facebook', display_order: 1, is_active: true },
    { platform: 'Twitter', url: '', icon_name: 'twitter', display_order: 2, is_active: true },
    { platform: 'Instagram', url: '', icon_name: 'instagram', display_order: 3, is_active: true }
  ]);

  // FAQ State
  const [faqCategories, setFaqCategories] = useState([]);
  const [faqItems, setFaqItems] = useState([]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      setIsLoading(true);

      // Load hero content
      const { data: heroData } = await supabase
        .from('hero_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (heroData) {
        setHeroContent(heroData);
      }

      // Load contact info
      const { data: contactData } = await supabase
        .from('contact_info')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (contactData) {
        setContactInfo(contactData);
      }

      // Load social links
      const { data: socialData } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order');

      if (socialData && socialData.length > 0) {
        setSocialLinks(socialData);
      }

      // Load FAQ categories
      const { data: categoriesData } = await supabase
        .from('faq_categories')
        .select('*')
        .order('display_order');

      if (categoriesData) {
        setFaqCategories(categoriesData);
      }

      // Load FAQ items
      const { data: faqData } = await supabase
        .from('faq_items')
        .select('*')
        .order('display_order');

      if (faqData) {
        setFaqItems(faqData);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load existing data' });
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const saveHeroContent = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('hero_content')
        .upsert({
          ...heroContent,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      showMessage('success', 'Hero content saved successfully!');
      await refreshData(); // Refresh the appearance context
    } catch (error) {
      console.error('Error saving hero content:', error);
      showMessage('error', 'Failed to save hero content');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContactInfo = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('contact_info')
        .upsert({
          ...contactInfo,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      showMessage('success', 'Contact information saved successfully!');
      await refreshData(); // Refresh the appearance context
    } catch (error) {
      console.error('Error saving contact info:', error);
      showMessage('error', 'Failed to save contact information');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSocialLinks = async () => {
    try {
      setIsLoading(true);

      // Delete existing social links
      await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert new social links
      const linksToInsert = socialLinks
        .filter(link => link.url.trim() !== '')
        .map(link => ({
          platform: link.platform,
          url: link.url,
          icon_name: link.icon_name,
          display_order: link.display_order,
          is_active: link.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

      if (linksToInsert.length > 0) {
        const { error } = await supabase
          .from('social_links')
          .insert(linksToInsert);

        if (error) throw error;
      }

      showMessage('success', 'Social links saved successfully!');
      await refreshData(); // Refresh the appearance context
    } catch (error) {
      console.error('Error saving social links:', error);
      showMessage('error', 'Failed to save social links');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'legal', label: 'Legal Pages', icon: FileText },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hero Section Content</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Main Heading (max 60 characters)
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={heroContent.main_heading}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, main_heading: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Find Your Dream Home in Malaysia"
                  />
                  <p className="text-xs text-gray-500 mt-1">{heroContent.main_heading.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subheading (max 120 characters)
                  </label>
                  <textarea
                    maxLength={120}
                    rows={3}
                    value={heroContent.subheading}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, subheading: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Discover the perfect property for rent or purchase"
                  />
                  <p className="text-xs text-gray-500 mt-1">{heroContent.subheading.length}/120 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Call-to-Action Button Text
                  </label>
                  <input
                    type="text"
                    value={heroContent.cta_button_text}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, cta_button_text: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Start Searching"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Banner Image URL (1920x600px recommended)
                  </label>
                  <input
                    type="url"
                    value={heroContent.banner_image_url}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, banner_image_url: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://images.pexels.com/photos/..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hero-published"
                    checked={heroContent.is_published}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hero-published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish changes live
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <button
                  onClick={saveHeroContent}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={contactInfo.business_name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, business_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="RumahList.my"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Phone
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.primary_phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, primary_phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+60 3-1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.primary_email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, primary_email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="info@rumahlist.my"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.secondary_phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, secondary_phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+60 3-1234 5679"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={contactInfo.address_line1}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, address_line1: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Level 10, Menara ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={contactInfo.city}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Kuala Lumpur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={contactInfo.state}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Kuala Lumpur"
                  />
                </div>

                <div className="flex items-center space-x-3 md:col-span-2">
                  <input
                    type="checkbox"
                    id="contact-published"
                    checked={contactInfo.is_published}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="contact-published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish changes live
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <button
                  onClick={saveContactInfo}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h3>
              
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {link.platform === 'Facebook' && <Facebook className="h-5 w-5 text-blue-600" />}
                      {link.platform === 'Twitter' && <Twitter className="h-5 w-5 text-blue-400" />}
                      {link.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                      <span className="font-medium text-gray-700 dark:text-gray-300">{link.platform}</span>
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].url = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={`https://${link.platform.toLowerCase()}.com/yourpage`}
                    />
                    <input
                      type="checkbox"
                      checked={link.is_active}
                      onChange={(e) => {
                        const newLinks = [...socialLinks];
                        newLinks[index].is_active = e.target.checked;
                        setSocialLinks(newLinks);
                      }}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <button
                  onClick={saveSocialLinks}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal Pages Editor</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Edit the content of your legal pages. Changes will be reflected immediately on the website.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <FileText className="h-8 w-8 text-amber-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Terms of Service</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Edit terms and conditions</p>
                </button>
                
                <button className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <FileText className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Privacy Policy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Edit privacy policy content</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">FAQ Manager</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Manage frequently asked questions and categories. Changes will be reflected immediately on the FAQ page.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <HelpCircle className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">FAQ Categories</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage FAQ categories</p>
                </button>
                
                <button className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <Plus className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">FAQ Items</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add and edit FAQ items</p>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Website Appearances
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Customize your website's appearance and content with real-time updates
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
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
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
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
        <div>
          {renderTabContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAppearances;