import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account on RumahList.my?',
          answer: 'To create an account, click the "Register" button in the top right corner of the homepage. Fill in your details including name, email, phone number, and choose whether you want to buy/rent or sell properties. Verify your email address to complete the registration.'
        },
        {
          question: 'Is RumahList.my free to use?',
          answer: 'Yes, browsing and searching for properties is completely free. Creating an account and contacting sellers is also free. We only charge fees for premium listing features and successful transactions.'
        },
        {
          question: 'How do I search for properties?',
          answer: 'Use our search bar on the homepage or properties page. You can filter by location, property type, price range, number of bedrooms, and whether you want to rent or buy. Advanced filters are available for more specific searches.'
        }
      ]
    },
    {
      category: 'For Buyers & Renters',
      questions: [
        {
          question: 'How do I contact a property seller?',
          answer: 'On each property listing page, you\'ll find contact options including phone, WhatsApp, and email. Click on your preferred method to get in touch with the seller directly.'
        },
        {
          question: 'Can I schedule property viewings through the platform?',
          answer: 'Yes, you can request viewings by contacting the seller through the listing page. Many sellers are flexible with viewing times and can accommodate your schedule.'
        },
        {
          question: 'How do payments work?',
          answer: 'All payments are processed securely through Stripe. You can pay using credit/debit cards or online banking. Payment is only required when you decide to rent or purchase a property.'
        }
      ]
    },
    {
      category: 'For Sellers',
      questions: [
        {
          question: 'How do I list my property?',
          answer: 'After creating a seller account and getting verified, click "Add New Listing" in your dashboard. Fill in all property details, upload high-quality photos, set your price, and submit for review. Our team will approve your listing within 24 hours.'
        },
        {
          question: 'What documents do I need to list a property?',
          answer: 'You\'ll need proof of ownership (title deed or sale agreement), your IC/passport, and recent photos of the property. For rental properties, you may also need a rental license if required by local authorities.'
        },
        {
          question: 'How much does it cost to list a property?',
          answer: 'Basic listings are free for the first 30 days. Premium features like featured listings, priority placement, and extended visibility are available for a small fee. We also charge a small commission on successful transactions.'
        },
        {
          question: 'How long does verification take?',
          answer: 'Seller verification typically takes 1-2 business days. We verify your identity, property ownership documents, and contact information to ensure all sellers on our platform are legitimate.'
        }
      ]
    },
    {
      category: 'Payments & Security',
      questions: [
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, all payment processing is handled by Stripe, a leading payment processor with bank-level security. We never store your payment information on our servers.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), online banking, and digital wallets through our Stripe integration.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'Refund policies depend on the specific transaction and circumstances. For property rentals, refunds are subject to the seller\'s cancellation policy. For purchases, refunds may be available if the transaction hasn\'t been completed.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I\'m having trouble uploading photos',
          answer: 'Make sure your photos are in JPG or PNG format and under 5MB each. Clear your browser cache and try again. If the problem persists, contact our support team.'
        },
        {
          question: 'The website is not loading properly',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. Make sure you have a stable internet connection. If issues persist, contact our technical support.'
        },
        {
          question: 'How do I change my account settings?',
          answer: 'Log into your account and go to your dashboard. Click on "Account Settings" or "Profile" to update your personal information, contact details, and preferences.'
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Frequently Asked Questions</h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Find answers to common questions about RumahList.my</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div key={categoryIndex} className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              <div className={`${isDark ? 'bg-amber-900/30 border-amber-800/30' : 'bg-amber-50 border-amber-100'} px-6 py-4 border-b`}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.category}</h2>
              </div>
              
              <div className={`divide-y ${isDark ? 'divide-gray-600' : 'divide-gray-200'}`}>
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={itemIndex}>
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className={`w-full px-6 py-4 text-left ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-50'} transition-colors focus:outline-none`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} pr-4`}>
                            {item.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                          ) : (
                            <ChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`} />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@rumahlist.my"
              className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+60312345678"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;