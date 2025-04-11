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

  // Function to determine the active index based on current path
  const getActiveIndexFromPath = () => {
    const currentPath = window.location.pathname;
    
    const index = navItems.findIndex(item => {
      // Handle exact match
      if (item.path === currentPath) return true;
      
      // Handle root path
      if (item.path === '/' && currentPath === '/') return true;
      
      // Handle sub-paths (e.g., /dashboard/something should highlight Dashboard)
      if (item.path !== '/' && currentPath.startsWith(item.path)) return true;
      
      return false;
    });
    
    return index >= 0 ? index : 0;
  };

  // Update active index when path changes
  useEffect(() => {
    const handlePathChange = () => {
      setActiveIndex(getActiveIndexFromPath());
    };

    // Initial check
    handlePathChange();

    // Listen for path changes
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <div className={cn("fixed top-4 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-2 rounded-full",
          isScrolled ? 
            "bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800" : 
            "bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
        )}
      >
        {/* Brand logo/name */}
        <div className="flex items-center gap-2">
          <span className="text-orange-600 font-bold text-lg">WattNest</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
                window.location.href = item.path;
              }}
              className={cn(
                "relative px-3 py-1.5 text-sm font-medium transition-colors",
                activeIndex === index
                  ? "text-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100"
              )}
            >
              {activeIndex === index && (
                <motion.div
                  layoutId="pill-tab"
                  transition={{ type: "spring", duration: 0.5 }}
                  className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"
                  style={{ zIndex: -1 }}
                />
              )}
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Theme toggle button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-neutral-600" />
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            ) : (
              <Bars3Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 mx-4 p-4 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(index);
                    setIsMobileMenuOpen(false);
                    window.location.href = item.path;
                  }}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeIndex === index
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
