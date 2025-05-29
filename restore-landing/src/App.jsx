import { useState, useEffect, useRef } from 'react'
import Particles from './components/Particles'
import CustomCursor from './components/CustomCursor'
import './App.css'

function HeartRateMonitor({ text, fullText }) {
  const [bpm, setBpm] = useState(72);
  const [bp, setBp] = useState("120/80");
  const [o2, setO2] = useState(98);
  const [heartBeat, setHeartBeat] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate the vital signs for a realistic effect
      setBpm(70 + Math.floor(Math.random() * 10));
      
      const systolic = 118 + Math.floor(Math.random() * 5);
      const diastolic = 78 + Math.floor(Math.random() * 5);
      setBp(`${systolic}/${diastolic}`);
      
      setO2(97 + Math.floor(Math.random() * 3));
    }, 2000);
    
    // Add heartbeat animation trigger
    const heartbeatInterval = setInterval(() => {
      setHeartBeat(true);
      setTimeout(() => setHeartBeat(false), 200);
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(heartbeatInterval);
    };
  }, []);
  
  return (
    <div className="heart-monitor">
      <div className="heart-monitor-grid"></div>
      <div className="heart-monitor-baseline"></div>
      <div className="heart-line"></div>
      <div className="heart-beep"></div>
      <div className="monitor-text">
        {text.split('').map((char, index) => (
          <span 
            key={index} 
            className="monitor-letter"
            style={{ 
              display: 'inline-block',
              color: '#00ffff',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
              transform: heartBeat && index % 2 === 0 ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.2s ease'
            }}
          >
            {char}
          </span>
        ))}
        {text.length === fullText.length && <span className="cursor" style={{ backgroundColor: '#00ffff' }}>|</span>}
      </div>
      <div className="bpm-display">
        <span style={{ 
          color: '#ff5252', 
          marginRight: '5px',
          transform: heartBeat ? 'scale(1.3)' : 'scale(1)',
          display: 'inline-block',
          transition: 'transform 0.2s ease'
        }}>❤</span>
        {bpm}
      </div>
      <div className="medical-data">BP: {bp} | O₂: {o2}%</div>
    </div>
  );
}

function App() {
  const [text, setText] = useState('');
  const fullText = 'Restoring Soon!';
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  
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
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(typeInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define inline styles for mobile
  const mobileLogoStyle = isMobile ? {
    display: 'block',
    width: '80%',
    margin: '80px auto 30px',
    textAlign: 'center'
  } : {};

  return (
    <>
      <CustomCursor />
      <Particles />
      <div className="container">
        <div className="secondary-logo">
          <img src="/logo2.png" alt="Secondary Logo" />
        </div>
        <div 
          className={`logo-container ${isMobile ? 'mobile-logo' : ''}`}
          style={mobileLogoStyle}
        >
          <img 
            src="/logo1.png" 
            className="logo" 
            alt="Company Logo" 
            style={isMobile ? { margin: '0 auto', display: 'block' } : {}}
          />
        </div>
        <HeartRateMonitor text={text} fullText={fullText} />
      </div>
    </>
  )
}

export default App
