import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Last updated: January 15, 2024
            </p>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>1. Acceptance of Terms</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                By accessing and using RumahList.my, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>2. Use License</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                Permission is granted to temporarily download one copy of the materials on RumahList.my for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>3. Property Listings</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                Users who list properties on RumahList.my agree to:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>Provide accurate and truthful information about their properties</li>
                <li>Have legal authority to list the property</li>
                <li>Comply with all applicable local, state, and federal laws</li>
                <li>Not discriminate against potential buyers or renters</li>
                <li>Respond to inquiries in a timely manner</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>4. Payment Terms</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                All payments processed through RumahList.my are handled securely through Stripe. 
                By making a payment, you agree to Stripe's terms of service and privacy policy. 
                RumahList.my is not responsible for any payment processing issues or disputes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>5. User Accounts</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                Users are responsible for maintaining the confidentiality of their account credentials. 
                You agree to notify us immediately of any unauthorized use of your account. 
                RumahList.my reserves the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>6. Prohibited Uses</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
                You may not use RumahList.my:
              </p>
              <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>7. Disclaimer</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                The materials on RumahList.my are provided on an 'as is' basis. RumahList.my makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>8. Limitations</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                In no event shall RumahList.my or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on RumahList.my, even if RumahList.my or an authorized representative has been 
                notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>9. Governing Law</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                These terms and conditions are governed by and construed in accordance with the laws of Malaysia 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>10. Contact Information</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className={`mt-4 p-4 ${isDark ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg`}>
                <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <strong>Email:</strong> legal@rumahlist.my<br />
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

export default TermsPage;