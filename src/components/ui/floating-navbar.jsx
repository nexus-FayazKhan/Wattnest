import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";

// Define default navigation items to ensure consistency across all pages
const defaultNavItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Reports', path: '/reports' },
  { name: 'Tips', path: '/tips' },
  { name: 'Settings', path: '/settings' },
];

export const FloatingNav = ({
  navItems = defaultNavItems,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  // Function to determine if we're on GitHub Pages
  const isGitHubPages = () => {
    return window.location.hostname.includes('github.io');
  };

  // Function to get the base path
  const getBasePath = () => {
    return isGitHubPages() ? '/Wattnest' : '';
  };

  // Function to determine the active index based on current path
  const getActiveIndexFromPath = () => {
    let currentPath = window.location.pathname;
    const basePath = getBasePath();
    
    // Remove the base path if we're on GitHub Pages
    if (basePath && currentPath.startsWith(basePath)) {
      currentPath = currentPath.substring(basePath.length) || '/';
    }
    
    const index = navItems.findIndex(item => {
      // Handle exact match
      if (item.path === currentPath) return true;
      
      // Handle home page special case
      if (currentPath === "/" && item.path === "/") return true;
      
      // Handle subpaths (e.g., /reports/something should still highlight Reports)
      if (item.path !== "/" && currentPath.startsWith(item.path)) return true;
      
      return false;
    });
    
    return index !== -1 ? index : 0; // Default to first item if no match
  };

  // Function to navigate to a path
  const navigateTo = (path) => {
    const basePath = getBasePath();
    const fullPath = `${basePath}${path}`;
    
    // Use window.location.href for navigation to ensure full page reload
    // This is more reliable for GitHub Pages deployment
    window.location.href = fullPath;
  };

  useEffect(() => {
    // Set active index based on current path on component mount and URL changes
    setActiveIndex(getActiveIndexFromPath());
    
    // Set up scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Listen for popstate events (browser back/forward navigation)
    const handlePopState = () => {
      setActiveIndex(getActiveIndexFromPath());
    };

    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("resize", handleResize);
    };
  }, [navItems, isMobileMenuOpen]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "fixed top-4 inset-x-0 max-w-4xl mx-auto z-50",
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "relative flex items-center justify-center px-4",
            isScrolled ? "h-16" : "h-20",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <motion.div
            className={cn(
              "flex items-center justify-between w-full px-4 sm:px-6 py-3",
              "bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-full",
              "border border-amber-200 dark:border-dark-700",
              "shadow-lg shadow-orange-200/20 dark:shadow-dark-900/20",
              isScrolled ? "h-12" : "h-14",
              "transition-all duration-300 ease-in-out"
            )}
          >
            {/* Logo/Website Name */}
            <div className="flex items-center">
              <motion.a
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="text-lg font-bold text-orange-600 dark:text-orange-400 mr-4 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                WattNest
              </motion.a>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(index);
                    navigateTo(item.path);
                  }}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium cursor-pointer",
                    "transition-colors duration-300 ease-in-out",
                    "hover:text-orange-600 dark:hover:text-amber-400",
                    activeIndex === index
                      ? "text-orange-600 dark:text-amber-400"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="pill-indicator-desktop"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-amber-100 dark:bg-dark-800 rounded-full"
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-2 rounded-full mr-2",
                  "bg-amber-100 dark:bg-dark-700",
                  "text-orange-600 dark:text-amber-300",
                  "hover:text-orange-700 dark:hover:text-amber-400",
                  "transition-colors duration-300"
                )}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </motion.button>
            </div>

            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "p-2 rounded-full",
                "bg-amber-100 dark:bg-dark-700",
                "text-orange-600 dark:text-amber-300",
                "hover:text-orange-700 dark:hover:text-amber-400",
                "transition-colors duration-300"
              )}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </motion.button>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-4 right-4 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-amber-200 dark:border-gray-700 md:hidden"
              >
                <div className="flex flex-col space-y-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveIndex(index);
                        setIsMobileMenuOpen(false);
                        navigateTo(item.path);
                      }}
                      className={cn(
                        "relative px-4 py-3 rounded-lg text-sm font-medium cursor-pointer",
                        "transition-colors duration-300 ease-in-out",
                        activeIndex === index
                          ? "bg-amber-100 dark:bg-gray-700 text-orange-600 dark:text-amber-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700"
                      )}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
