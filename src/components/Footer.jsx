import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import { BoltIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: FaFacebook },
    { name: 'Twitter', href: '#', icon: FaTwitter },
    { name: 'Instagram', href: '#', icon: FaInstagram },
    { name: 'LinkedIn', href: '#', icon: FaLinkedin },
    { name: 'GitHub', href: '#', icon: FaGithub },
  ],
};

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 opacity-80" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-orange-400/20 dark:bg-orange-600/10 blur-3xl"></div>
      <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-amber-300/30 dark:bg-amber-500/10 blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-orange-200 dark:border-gray-700">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg mr-3">
                <BoltIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-600 dark:text-amber-400">
                WattNest
              </span>
            </Link>
            <p className="text-orange-700/80 dark:text-amber-300/80 text-sm max-w-xs">
              Smart energy management for modern hotels. Save energy, reduce costs, and improve sustainability.
            </p>
            <div className="flex space-x-5 pt-2">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-orange-500 hover:text-orange-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors duration-200"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-amber-300 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-orange-700 hover:text-orange-500 dark:text-amber-400/80 dark:hover:text-amber-300 transition-colors duration-200 text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-amber-300 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-orange-700 hover:text-orange-500 dark:text-amber-400/80 dark:hover:text-amber-300 transition-colors duration-200 text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-amber-300 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-orange-700 hover:text-orange-500 dark:text-amber-400/80 dark:hover:text-amber-300 transition-colors duration-200 text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-orange-200/50 dark:border-gray-700/50">
              <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-md hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200">
                <LightBulbIcon className="h-4 w-4 mr-2" />
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-orange-700/70 dark:text-amber-400/70 text-sm">
              &copy; {new Date().getFullYear()} WattNest. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2 text-sm text-orange-700/70 dark:text-amber-400/70">
              <a href="#" className="hover:text-orange-600 dark:hover:text-amber-300 transition-colors">Accessibility</a>
              <a href="#" className="hover:text-orange-600 dark:hover:text-amber-300 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-orange-600 dark:hover:text-amber-300 transition-colors">Support</a>
              <a href="#" className="hover:text-orange-600 dark:hover:text-amber-300 transition-colors">Feedback</a>
            </div>
          </div>
          
          <p className="mt-6 text-center text-xs text-orange-600/50 dark:text-amber-400/50">
            Designed with ❤️ for energy efficiency and sustainability
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
