import React, { useRef, useEffect } from 'react';

export default function LightBulb3D({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    // Set initial size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationFrame;
    let bulbGlowIntensity = 0;
    let glowDirection = 0.005;

    // Draw the light bulb
    const drawLightBulb = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate sizes based on canvas
      const bulbRadius = Math.min(canvas.width, canvas.height) * 0.2;
      const baseWidth = bulbRadius * 0.7;
      const baseHeight = bulbRadius * 0.8;
      
      // Update glow effect
      bulbGlowIntensity += glowDirection;
      if (bulbGlowIntensity > 0.3 || bulbGlowIntensity < 0) {
        glowDirection *= -1;
      }

      // Draw outer glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY - bulbRadius * 0.2, 0,
        centerX, centerY - bulbRadius * 0.2, bulbRadius * 3
      );
      gradient.addColorStop(0, `rgba(249, 115, 22, ${0.2 + bulbGlowIntensity})`);
      gradient.addColorStop(0.5, `rgba(245, 158, 11, ${0.1 + bulbGlowIntensity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY - bulbRadius * 0.2, bulbRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw base (socket)
      ctx.fillStyle = '#777777';
      ctx.beginPath();
      ctx.rect(centerX - baseWidth/2, centerY + bulbRadius * 0.7, baseWidth, baseHeight);
      ctx.fill();
      
      // Draw threaded part
      ctx.fillStyle = '#999999';
      ctx.beginPath();
      ctx.rect(centerX - baseWidth/3, centerY + bulbRadius * 0.4, baseWidth * 2/3, baseHeight * 0.6);
      ctx.fill();
      
      // Draw glass bulb
      const bulbGradient = ctx.createRadialGradient(
        centerX - bulbRadius * 0.3, centerY - bulbRadius * 0.3, 0,
        centerX, centerY - bulbRadius * 0.2, bulbRadius
      );
      bulbGradient.addColorStop(0, `rgba(254, 240, 200, ${0.9 + bulbGlowIntensity * 0.1})`);
      bulbGradient.addColorStop(0.7, `rgba(253, 186, 116, ${0.7 + bulbGlowIntensity * 0.2})`);
      bulbGradient.addColorStop(1, `rgba(249, 115, 22, ${0.3 + bulbGlowIntensity})`);
      
      ctx.fillStyle = bulbGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY - bulbRadius * 0.2, bulbRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX - bulbRadius * 0.3, centerY - bulbRadius * 0.4, bulbRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw filament
      ctx.strokeStyle = `rgba(254, 215, 100, ${0.8 + bulbGlowIntensity * 0.2})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - bulbRadius * 0.3, centerY);
      ctx.bezierCurveTo(
        centerX - bulbRadius * 0.1, centerY - bulbRadius * 0.5,
        centerX + bulbRadius * 0.1, centerY - bulbRadius * 0.5,
        centerX + bulbRadius * 0.3, centerY
      );
      ctx.stroke();
      
     
      // Animate
      animationFrame = requestAnimationFrame(drawLightBulb);
    };
    
    drawLightBulb();
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className={`w-full h-full ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ backgroundColor: 'transparent' }} 
      />
    </div>
  );
}
