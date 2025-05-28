import { useEffect, useRef } from 'react';
import '../styles/Particles.css';

const Particles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Create color palette for particles
    const colors = [
      'rgba(238, 119, 82, 0.8)',   // #ee7752
      'rgba(231, 60, 126, 0.8)',   // #e73c7e
      'rgba(35, 166, 213, 0.8)',   // #23a6d5
      'rgba(35, 213, 171, 0.8)',   // #23d5ab
      'rgba(255, 255, 255, 0.8)',  // white
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 15); // More particles
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1;
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: size,
          originalRadius: size,
          color: colors[colorIndex],
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          directionChangeTimer: 0,
          directionChangeInterval: Math.random() * 200 + 50,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          colorChangeSpeed: Math.random() * 0.005 + 0.001,
          targetColorIndex: (colorIndex + 1) % colors.length,
          currentColorIndex: colorIndex,
          colorTransition: 0,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines between nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = 1 - (distance / 100);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
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
        
        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        
        const currentColor = colors[particle.currentColorIndex];
        const targetColor = colors[particle.targetColorIndex];
        
        gradient.addColorStop(0, currentColor);
        gradient.addColorStop(1, targetColor);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Random direction changes
        particle.directionChangeTimer++;
        if (particle.directionChangeTimer >= particle.directionChangeInterval) {
          particle.speedX = Math.random() * 1 - 0.5;
          particle.speedY = Math.random() * 1 - 0.5;
          particle.directionChangeTimer = 0;
          particle.directionChangeInterval = Math.random() * 200 + 50;
        }
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
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
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
};

export default Particles; 