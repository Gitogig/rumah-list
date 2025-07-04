import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
}

interface SocialIconsProps {
  socialLinks: SocialLink[];
}

const SocialIcons: React.FC<SocialIconsProps> = ({ socialLinks }) => {
  return (
    <div className="flex space-x-4">
      {socialLinks.length > 0 ? (
        socialLinks.map((link) => (
          <a 
            key={link.id}
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110"
            aria-label={`Visit our ${link.platform} page`}
          >
            {link.platform.toLowerCase() === 'facebook' && <Facebook className="h-5 w-5" />}
            {link.platform.toLowerCase() === 'twitter' && <Twitter className="h-5 w-5" />}
            {link.platform.toLowerCase() === 'instagram' && <Instagram className="h-5 w-5" />}
          </a>
        ))
      ) : (
        <>
          <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110" aria-label="Facebook">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110" aria-label="Twitter">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
        </>
      )}
    </div>
  );
};

export default SocialIcons;