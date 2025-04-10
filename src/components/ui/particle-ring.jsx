import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const ParticleRing = ({ className, children }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    const resizeCanvas = () => {
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    // Initial resize
    resizeCanvas();
    
    // Resize on window change
    window.addEventListener('resize', resizeCanvas);

    // Particle properties
    const particleCount = 100;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 150;
      const speed = 0.01 + Math.random() * 0.02;
      
      particles.push({
        x: 0,
        y: 0,
        radius: radius,
        angle: angle,
        speed: speed,
        size: 1 + Math.random() * 3,
        color: i % 2 === 0 ? 
          `rgba(249, 115, 22, ${0.3 + Math.random() * 0.7})` : 
          `rgba(245, 158, 11, ${0.3 + Math.random() * 0.7})`
      });
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.angle += particle.speed;
        particle.x = centerX + Math.cos(particle.angle) * particle.radius;
        particle.y = centerY + Math.sin(particle.angle) * particle.radius;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#111827] dark:to-gray-900 z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParticleRing;
