import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const PrivacyPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Last updated: January 15, 2024
            </p>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>1. Information We Collect</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                We collect information you provide directly to us, such as when you create an account, list a property, 
                or contact us for support. This may include:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>Name, email address, and phone number</li>
                <li>Property listing information and photos</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Communication preferences</li>
                <li>Messages and inquiries sent through our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>2. How We Use Your Information</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                We use the information we collect to:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>3. Information Sharing</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                We may share your information in the following situations:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>With your consent or at your direction</li>
                <li>With service providers who perform services on our behalf</li>
                <li>For legal reasons or to protect rights and safety</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>In aggregated or de-identified form that cannot reasonably be used to identify you</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>4. Data Security</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>5. Cookies and Tracking</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We use cookies and similar tracking technologies to collect information about your browsing activities. 
                You can control cookies through your browser settings, but disabling cookies may affect the functionality 
                of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>6. Your Rights</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>7. Third-Party Services</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                Our service may contain links to third-party websites or services. We are not responsible for the 
                privacy practices of these third parties. We encourage you to read their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>8. Children's Privacy</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>9. Changes to This Policy</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>10. Contact Us</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className={`mt-4 p-4 ${isDark ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg`}>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <strong>Email:</strong> privacy@rumahlist.my<br />
                  <strong>Phone:</strong> +60 3-1234 5678<br />
                  <strong>Address:</strong> Level 10, Menara ABC, Jalan Ampang, 50450 Kuala Lumpur, Malaysia
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;