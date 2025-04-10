import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const containerRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const [phase, setPhase] = useState(0);
  const computedSpeed = speed === "fast" ? 0.15 : speed === "slow" ? 0.05 : 0.1;

  const uniqueId = useRef(`wavy-background-${Math.random().toString(36).substring(2, 10)}`);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setSvgHeight(container.offsetHeight);
    }

    const interval = setInterval(() => {
      setPhase(prev => (prev + computedSpeed) % (Math.PI * 2));
    }, 16);

    return () => clearInterval(interval);
  }, [computedSpeed]);

  const defaultColors = [
    "rgba(14, 165, 233, 0.3)", // primary-500 with opacity
    "rgba(59, 130, 246, 0.3)", // blue-500 with opacity
    "rgba(139, 92, 246, 0.3)", // purple-500 with opacity
  ];

  const actualColors = colors || defaultColors;

  const calculateWavePoints = (width, height, segmentCount, phase, amplitude) => {
    const points = [];
    for (let i = 0; i <= segmentCount; i++) {
      const x = (i / segmentCount) * width;
      const y = amplitude * Math.sin(i * 0.5 + phase) + height / 2;
      points.push({ x, y });
    }
    return points;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full", containerClassName)}
      {...props}
    >
      <svg
        className="absolute inset-0 w-full"
        style={{ height: svgHeight, filter: `blur(${blur}px)` }}
        viewBox={`0 0 ${waveWidth || 1000} ${svgHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={uniqueId.current} x1="0%" y1="0%" x2="100%" y2="0%">
            {actualColors.map((color, i) => (
              <stop
                key={i}
                offset={`${(i / (actualColors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={waveWidth || 1000}
          height={svgHeight}
          fill={backgroundFill || "transparent"}
        />
        {Array.from({ length: 3 }).map((_, i) => {
          const amplitude = (svgHeight * 0.1) * (i + 1);
          const points = calculateWavePoints(
            waveWidth || 1000,
            svgHeight,
            20,
            phase + i * 0.7,
            amplitude
          );
          
          return (
            <motion.path
              key={i}
              d={`M ${points.map(p => `${p.x} ${p.y}`).join(" L ")} L ${waveWidth || 1000} ${svgHeight} L 0 ${svgHeight} Z`}
              fill={`url(#${uniqueId.current})`}
              opacity={waveOpacity / (i + 1)}
            />
          );
        })}
      </svg>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
