import { useState, useEffect, useRef } from 'react'
import Particles from './components/Particles'
import CustomCursor from './components/CustomCursor'
import './App.css'

function App() {
  const [text, setText] = useState('');
  const titleRef = useRef(null);
  const fullText = 'Restoring Soon!';
  
  useEffect(() => {
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 150);
    
    return () => clearInterval(typeInterval);
  }, []);
  
  useEffect(() => {
    if (!titleRef.current) return;
    
    const handleMouseMove = (e) => {
      const title = titleRef.current;
      const rect = title.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate rotation based on mouse position
      const maxRotate = 10; // Reduced rotation for better readability
      const rotateX = -y / (rect.height / 2) * maxRotate;
      const rotateY = x / (rect.width / 2) * maxRotate;
      
      title.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      titleRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    titleRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (titleRef.current) {
        titleRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [text]);
  
  return (
    <>
      <CustomCursor />
      <Particles />
      <div className="container">
        <div className="logo-container">
          <img src="/logo.png" className="logo" alt="Company Logo" />
        </div>
        <div className="text-content">
          <div className="text-highlight"></div>
          <h1 className="animated-title" ref={titleRef}>
            {text.split('').map((char, index) => (
              <span 
                key={index} 
                className="animated-letter"
                style={{ 
                  display: 'inline-block',
                  transition: 'transform 0.2s'
                }}
              >
                {char}
              </span>
            ))}
            {text.length === fullText.length && <span className="cursor">|</span>}
          </h1>
        </div>
      </div>
    </>
  )
}

export default App
