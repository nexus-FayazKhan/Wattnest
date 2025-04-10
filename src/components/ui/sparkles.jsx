import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

export const Sparkles = ({
  children,
  className,
  isActive = true,
  ...props
}) => {
  const [sparkles, setSparkles] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setSparkles([]);
      return;
    }

    const generateSparkle = () => {
      const sparkle = {
        id: Math.random(),
        createdAt: Date.now(),
        color: randomColor(),
        size: Math.floor(Math.random() * 20) + 10,
        style: {
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          zIndex: 2,
        },
      };
      setSparkles([...sparkles, sparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
      }, 1000);
    };

    const interval = setInterval(generateSparkle, 300);
    return () => clearInterval(interval);
  }, [sparkles, isActive]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)} {...props}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Sparkle = ({ color, size, style }) => {
  const path =
    "M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z";

  return (
    <div
      className="absolute animate-sparkle-spin pointer-events-none"
      style={style}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 68 68"
        fill="none"
        className="animate-sparkle"
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  );
};

const randomColor = () => {
  const colors = [
    "#FFD700", // Gold
    "#FFA500", // Orange
    "#F97316", // Orange-500
    "#FB923C", // Orange-400
    "#FDBA74", // Orange-300
    "#F59E0B", // Amber-500
    "#FBBF24", // Amber-400
    "#FCD34D", // Amber-300
    "#D97706", // Amber-600
    "#EA580C", // Orange-600
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
