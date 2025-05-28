import { useState, useEffect } from 'react'
import Particles from './components/Particles'
import './App.css'

function App() {
  const [text, setText] = useState('');
  const fullText = 'Coming Soon';
  
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
  
  return (
    <>
      <Particles />
      <div className="container">
        <div className="logo-container">
          <img src="/logo.png" className="logo" alt="Company Logo" />
        </div>
        <h1>{text}<span className="cursor">|</span></h1>
        <p className="message">
          We are working hard to bring you something amazing. Stay tuned!
        </p>
      </div>
    </>
  )
}

export default App
