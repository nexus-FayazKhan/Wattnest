import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  UserIcon, 
  KeyIcon, 
  DeviceTabletIcon, 
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { FloatingNav } from '../components/ui/floating-navbar';

// Generate a random device code for demonstration
const generateDeviceCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [deviceCode] = useState(generateDeviceCode());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkModeSchedule, setDarkModeSchedule] = useState('system');
  const [isCopied, setIsCopied] = useState(false);

  // Copy device code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(deviceCode);
    setIsCopied(true);
    toast.success('Device code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect is handled by Clerk
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900">
      <FloatingNav />

      <div className="pt-24 pb-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
     

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with sections */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700 sticky top-24">
              <nav className="space-y-1">
                <a href="#account" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-amber-300">
                  <UserIcon className="h-5 w-5 mr-3" />
                  <span>Account</span>
                </a>
                <a href="#device" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-orange-700 hover:bg-orange-50 dark:text-amber-400 dark:hover:bg-gray-700">
                  <DeviceTabletIcon className="h-5 w-5 mr-3" />
                  <span>Device</span>
                </a>
                <a href="#preferences" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-orange-700 hover:bg-orange-50 dark:text-amber-400 dark:hover:bg-gray-700">
                  <Cog6ToothIcon className="h-5 w-5 mr-3" />
                  <span>Preferences</span>
                </a>
                <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-orange-700 hover:bg-orange-50 dark:text-amber-400 dark:hover:bg-gray-700">
                  <BellAlertIcon className="h-5 w-5 mr-3" />
                  <span>Notifications</span>
                </a>
                <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-orange-700 hover:bg-orange-50 dark:text-amber-400 dark:hover:bg-gray-700">
                  <ShieldCheckIcon className="h-5 w-5 mr-3" />
                  <span>Security</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 mt-6"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Section */}
            <section id="account" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-6">Account Information</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || 'User'} 
                      className="h-16 w-16 rounded-full border-2 border-amber-200 dark:border-amber-700"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-orange-600 dark:text-amber-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-orange-900 dark:text-white">
                    {user.fullName || 'User'}
                  </h3>
                  <p className="text-orange-700 dark:text-amber-400">
                    {user.primaryEmailAddress?.emailAddress || 'No email provided'}
                  </p>
                  <p className="text-sm text-orange-600/70 dark:text-amber-400/70 mt-1">
                    User ID: {user.id}
                  </p>
                </div>
              </div>

              <div className="border-t border-amber-100 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 dark:text-amber-300 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      value={user.primaryEmailAddress?.emailAddress || ''} 
                      disabled
                      className="w-full px-3 py-2 bg-orange-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-lg text-orange-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-800 dark:text-amber-300 mb-1">
                      Username
                    </label>
                    <input 
                      type="text" 
                      value={user.username || user.fullName || 'User'} 
                      disabled
                      className="w-full px-3 py-2 bg-orange-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-lg text-orange-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Device Section */}
            <section id="device" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-6">Device Information</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-orange-800 dark:text-amber-300">
                    Device Code
                  </label>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-orange-50 dark:bg-gray-700 px-4 py-3 border border-amber-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-center">
                      <KeyIcon className="h-5 w-5 text-orange-600 dark:text-amber-400 mr-2" />
                      <span className="font-mono text-lg tracking-wider text-orange-900 dark:text-white">{deviceCode}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-orange-600/70 dark:text-amber-400/70">
                  This code is used to connect your smart devices to your WattNest account.
                </p>
              </div>

              <div className="border-t border-amber-100 dark:border-gray-700 pt-4">
                <h3 className="text-md font-medium text-orange-800 dark:text-amber-300 mb-3">Connected Devices</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <DeviceTabletIcon className="h-5 w-5 text-orange-600 dark:text-amber-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-orange-900 dark:text-white">Smart Hub Controller</p>
                        <p className="text-xs text-orange-600/70 dark:text-amber-400/70">Last active: Today, 10:45 AM</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section id="preferences" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-orange-900 dark:text-white mb-6">Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 dark:text-amber-300 mb-1">
                    Dark Mode
                  </label>
                  <select 
                    value={darkModeSchedule}
                    onChange={(e) => setDarkModeSchedule(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-lg text-orange-900 dark:text-white"
                  >
                    <option value="system">System Default</option>
                    <option value="always">Always Dark</option>
                    <option value="never">Always Light</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-100 dark:border-gray-700">
                  <div>
                    <h3 className="text-sm font-medium text-orange-800 dark:text-amber-300">Push Notifications</h3>
                    <p className="text-xs text-orange-600/70 dark:text-amber-400/70 mt-1">
                      Receive alerts for energy usage spikes and system updates
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="toggle-notifications"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                      className="sr-only"
                    />
                    <label 
                      htmlFor="toggle-notifications"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                        notificationsEnabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                          notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-100 dark:border-gray-700">
                  <div>
                    <h3 className="text-sm font-medium text-orange-800 dark:text-amber-300">Email Updates</h3>
                    <p className="text-xs text-orange-600/70 dark:text-amber-400/70 mt-1">
                      Receive weekly energy usage reports and tips
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="toggle-email"
                      checked={emailUpdates}
                      onChange={() => setEmailUpdates(!emailUpdates)}
                      className="sr-only"
                    />
                    <label 
                      htmlFor="toggle-email"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                        emailUpdates ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                          emailUpdates ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
