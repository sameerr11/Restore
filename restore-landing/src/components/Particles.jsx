import { useEffect, useRef, useState } from 'react';
import '../styles/Particles.css';

const Particles = () => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Create color palette for particles matching the dark color scheme
    const colors = [
      'rgba(0, 105, 92, 0.9)',     // #00695c - Dark teal
      'rgba(0, 150, 136, 0.9)',    // #009688 - Teal
      'rgba(77, 182, 172, 0.8)',   // #4db6ac - Light teal
      'rgba(178, 223, 219, 0.7)',  // #b2dfdb - Pale teal
      'rgba(0, 188, 212, 0.9)',    // #00bcd4 - Cyan
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      // Reduce particle count on mobile for better performance
      const particleCount = isMobile 
        ? Math.floor(window.innerWidth / 30)  // Fewer particles on mobile
        : Math.floor(window.innerWidth / 12); // More particles on desktop
      
      for (let i = 0; i < particleCount; i++) {
        const size = isMobile 
          ? Math.random() * 3 + 1  // Smaller particles on mobile
          : Math.random() * 5 + 2; // Larger particles on desktop
        
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: size,
          originalRadius: size,
          color: colors[colorIndex],
          speedX: Math.random() * 0.6 - 0.3, // Slightly slower on mobile
          speedY: Math.random() * 0.6 - 0.3,
          directionChangeTimer: 0,
          directionChangeInterval: Math.random() * 300 + 100,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          colorChangeSpeed: Math.random() * 0.005 + 0.001,
          targetColorIndex: (colorIndex + 1) % colors.length,
          currentColorIndex: colorIndex,
          colorTransition: 0,
          opacity: Math.random() * 0.5 + 0.5,
          opacityChange: Math.random() * 0.01,
          opacityDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines between nearby particles
      // Reduce line calculation on mobile for better performance
      const connectionDistance = isMobile ? 100 : 150;
      
      ctx.lineWidth = isMobile ? 0.5 : 1;
      for (let i = 0; i < particles.length; i++) {
        // On mobile, only connect every other particle for better performance
        const skipFactor = isMobile ? 2 : 1;
        
        for (let j = i + skipFactor; j < particles.length; j += skipFactor) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = 1 - (distance / connectionDistance);
            // Use the color scheme for lines
            const lineGradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            
            lineGradient.addColorStop(0, colors[particles[i].currentColorIndex].replace(/[\d\.]+\)$/, `${opacity * 0.5})`));
            lineGradient.addColorStop(1, colors[particles[j].currentColorIndex].replace(/[\d\.]+\)$/, `${opacity * 0.5})`));
            
            ctx.strokeStyle = lineGradient;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      particles.forEach(particle => {
        // Pulse size
        particle.radius += particle.pulseDirection * particle.pulseSpeed;
        if (particle.radius > particle.originalRadius * 1.5 || 
            particle.radius < particle.originalRadius * 0.5) {
          particle.pulseDirection *= -1;
        }
        
        // Color transition
        particle.colorTransition += particle.colorChangeSpeed;
        if (particle.colorTransition >= 1) {
          particle.currentColorIndex = particle.targetColorIndex;
          particle.targetColorIndex = (particle.targetColorIndex + 1) % colors.length;
          particle.colorTransition = 0;
        }
        
        // Opacity oscillation for twinkling effect
        particle.opacity += particle.opacityDirection * particle.opacityChange;
        if (particle.opacity > 0.9 || particle.opacity < 0.4) {
          particle.opacityDirection *= -1;
        }
        
        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        
        const currentColor = colors[particle.currentColorIndex].replace(/[\d\.]+\)$/, `${particle.opacity})`);
        const targetColor = colors[particle.targetColorIndex].replace(/[\d\.]+\)$/, `${particle.opacity * 0.8})`);
        
        gradient.addColorStop(0, currentColor);
        gradient.addColorStop(1, targetColor);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glow effect - reduce on mobile
        if (!isMobile) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = currentColor;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        
        // Random direction changes with smooth transitions
        particle.directionChangeTimer++;
        if (particle.directionChangeTimer >= particle.directionChangeInterval) {
          // Smooth transition to new direction
          const targetSpeedX = Math.random() * 0.8 - 0.4;
          const targetSpeedY = Math.random() * 0.8 - 0.4;
          
          // Gradually change speed
          particle.speedX = particle.speedX * 0.8 + targetSpeedX * 0.2;
          particle.speedY = particle.speedY * 0.8 + targetSpeedY * 0.2;
          
          particle.directionChangeTimer = 0;
          particle.directionChangeInterval = Math.random() * 300 + 100;
        }
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen edges
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="particles-canvas" />;
};

export default Particles; 