import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  offset = 16,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden rounded-[1.75rem] bg-gray-800",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]">
          <div
            className="w-[200%] h-[200%] opacity-100"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 220deg, #f97316 222deg 270deg, #f59e0b 270deg 318deg, transparent 320deg)",
            }}
          />
        </div>
      </div>

      <div
        className={cn(
          "relative bg-gray-900 backdrop-blur-xl border-gray-800 border",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
