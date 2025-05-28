import { useEffect, useState, useRef } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const trailRef = useRef([]);
  const trailSize = 20; // Number of trail elements
  
  // Initialize trail positions
  useEffect(() => {
    trailRef.current = Array(trailSize).fill({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
      
      // Update trail positions
      trailRef.current = [
        { x: e.clientX, y: e.clientY },
        ...trailRef.current.slice(0, trailSize - 1)
      ];
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleLinkHover = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
          e.target.classList.contains('animated-title') ||
          e.target.classList.contains('animated-letter')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleLinkHover);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleLinkHover);
    };
  }, []);

  return (
    <>
      {/* Trail effect */}
      {trailRef.current.map((pos, index) => (
        <div 
          key={`trail-${index}`}
          className="cursor-trail"
          style={{ 
            left: `${pos.x}px`, 
            top: `${pos.y}px`,
            opacity: 1 - (index / trailSize),
            transform: `translate(-50%, -50%) scale(${1 - (index / trailSize) * 0.8})`,
            backgroundColor: hovering ? 'rgba(0, 150, 136, 0.2)' : 'rgba(0, 188, 212, 0.2)'
          }}
        />
      ))}

      {/* Main cursor elements */}
      <div 
        className={`cursor-dot ${hidden ? 'hidden' : ''} ${clicked ? 'clicked' : ''} ${hovering ? 'hovering' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
      <div 
        className={`cursor-ring ${hidden ? 'hidden' : ''} ${clicked ? 'clicked' : ''} ${hovering ? 'hovering' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
    </>
  );
};

export default CustomCursor; 