import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const AnimatedTooltip = ({
  items,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center md:justify-start w-full",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-orange-500 to-amber-500 blur-sm transition duration-300"></div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: "spring",
                  duration: 0.5,
                  delay: idx * 0.1
                }
              }}
              className={cn(
                "flex items-center justify-center relative z-10 cursor-pointer",
                "h-10 w-10 rounded-full border-2 border-white dark:border-gray-800",
                "bg-gray-200 dark:bg-gray-700 overflow-hidden transition duration-300",
                "hover:scale-110 hover:border-orange-500 dark:hover:border-amber-500"
              )}
              style={{
                marginLeft: idx !== 0 ? "-0.5rem" : 0,
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
              {!item.image && item.name && (
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {item.name.charAt(0)}
                </span>
              )}
            </motion.div>

            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    duration: 0.5,
                  },
                }}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 z-20 min-w-max",
                  "flex items-center justify-center",
                  "rounded-md bg-white dark:bg-gray-800 shadow-xl",
                  "px-3 py-2 mt-1"
                )}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800"></div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name}
                  </p>
                  {item.designation && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.designation}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
