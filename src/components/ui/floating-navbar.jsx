import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { useTheme } from "../../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

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
  const { darkMode, toggleDarkMode } = useTheme();

  // Function to determine the active index based on current path
  const getActiveIndexFromPath = () => {
    const currentPath = window.location.pathname;
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

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navItems]);

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
              "flex items-center justify-between w-full px-6 py-3",
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
                href="/"
                className="text-lg font-bold text-orange-600 dark:text-orange-400 mr-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                WattNest
              </motion.a>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(index);
                    window.location.href = item.path;
                  }}
                  className={cn(
                    "relative px-2 md:px-4 py-2 rounded-full text-sm font-medium",
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
                      layoutId="pill-indicator"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
