import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { useTheme } from '../../contexts/ThemeContext';

const ContactPage: React.FC = () => {
  const { contactInfo } = useAppearance();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Use dynamic contact info or fallback to defaults
  const businessName = contactInfo?.business_name || 'RumahList.my';
  const primaryPhone = contactInfo?.primary_phone || '+60 3-1234 5678';
  const primaryEmail = contactInfo?.primary_email || 'info@rumahlist.my';
  const address = contactInfo ? 
    `${contactInfo.address_line1}${contactInfo.address_line2 ? '\n' + contactInfo.address_line2 : ''}, ${contactInfo.city}, ${contactInfo.state}` :
    'Level 10, Menara ABC, Jalan Ampang, 50450, Kuala Lumpur, Malaysia';

  const businessHours = contactInfo?.business_hours || {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed'
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Contact Us</h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Have a question or need assistance? We're here to help you with all your real estate needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{primaryPhone}</p>
                    {contactInfo?.secondary_phone && (
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{contactInfo.secondary_phone}</p>
                    )}
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{primaryEmail}</p>
                    {contactInfo?.secondary_email && (
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{contactInfo.secondary_email}</p>
                    )}
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Office</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-line`}>
                      Level 10, Menara ABC<br />
                      Jalan Ampang, 50450<br />
                      Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Business Hours</h4>
                    <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
                      <p>Monday - Friday: {businessHours.monday || '9:00 AM - 6:00 PM'}</p>
                      <p>Saturday: {businessHours.saturday || '9:00 AM - 2:00 PM'}</p>
                      <p>Sunday: {businessHours.sunday || 'Closed'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Links</h3>
              <div className="space-y-3">
                <a href="/faq" className={`block ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'} transition-colors`}>
                  Frequently Asked Questions
                </a>
                <a href="/terms" className={`block ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'} transition-colors`}>
                  Terms of Service
                </a>
                <a href="/privacy" className={`block ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'} transition-colors`}>
                  Privacy Policy
                </a>
                <a href="/properties" className={`block ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'} transition-colors`}>
                  Browse Properties
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        isDark 
                          ? 'border-gray-600 bg-gray-800 text-white focus:ring-amber-500 focus:border-transparent' 
                          : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                      } rounded-lg`}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        isDark 
                          ? 'border-gray-600 bg-gray-800 text-white focus:ring-amber-500 focus:border-transparent' 
                          : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                      } rounded-lg`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white focus:ring-amber-500 focus:border-transparent' 
                        : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                    } rounded-lg`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="property">Property Listing Question</option>
                    <option value="account">Account Support</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      isDark 
                        ? 'border-gray-600 bg-gray-800 text-white focus:ring-amber-500 focus:border-transparent' 
                        : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                    } rounded-lg`}
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className={`p-6 border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Location</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Visit our office in the heart of Kuala Lumpur</p>
          </div>
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            {contactInfo?.google_maps_embed ? (
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: contactInfo.google_maps_embed }}
              />
            ) : (
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-500">Level 10, Menara ABC, Jalan Ampang, KL</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;