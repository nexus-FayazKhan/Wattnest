import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const AnimatedCards = ({
  items,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <AnimatedCard
              isHovered={hoveredIndex === idx}
              className="h-full w-full"
            >
              <div className="relative z-20 h-full">
                <div className="p-6 sm:p-8 flex flex-col h-full">
                  <div className={`p-3 rounded-lg ${item.color} w-fit mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {item.description}
                  </p>
                  {item.footer && (
                    <div className="mt-auto">
                      {item.footer}
                    </div>
                  )}
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export const AnimatedCard = ({
  children,
  className,
  isHovered,
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full rounded-xl bg-white dark:bg-gray-800 overflow-hidden group transition-all duration-300 shadow-md hover:shadow-xl",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        )}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
