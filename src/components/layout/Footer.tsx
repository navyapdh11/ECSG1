'use client';

import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, Globe, Users, MessageCircle, Briefcase } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Regular Cleaning', href: '#pricing' },
    { label: 'Deep Cleaning', href: '#pricing' },
    { label: 'Move In/Out', href: '#pricing' },
    { label: 'Office Cleaning', href: '#pricing' },
  ],
  company: [
    { label: 'About Us', href: '#hero' },
    { label: 'Careers', href: '#hero' },
    { label: 'Blog', href: '#hero' },
    { label: 'Contact', href: '#hero' },
  ],
  support: [
    { label: 'Help Center', href: '#hero' },
    { label: 'FAQs', href: '#hero' },
    { label: 'Terms of Service', href: '#hero' },
    { label: 'Privacy Policy', href: '#hero' },
  ],
};

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Users, href: '#', label: 'Community' },
  { icon: MessageCircle, href: '#', label: 'Chat' },
  { icon: Briefcase, href: '#', label: 'Business' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">ECSG1</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-xs">
              Enterprise-grade cleaning services platform with AI-powered booking, gamification, and transparent pricing.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@ecsg1.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ECSG1. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg hover:bg-gray-800 hover:text-primary-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
