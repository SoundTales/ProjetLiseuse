import { useState, useEffect } from 'react';
import '../styles/IntroScreen.css';

const IntroScreen = ({ onStart, showIntro, exitIntro }) => {
  const [animationFinished, setAnimationFinished] = useState(false);
  
  useEffect(() => {
    // Déclencher l'animation de fondu après un court délai
    if (showIntro) {
      const timer = setTimeout(() => {
        setAnimationFinished(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [showIntro]);
  
  return (
    <div className={`intro-container ${exitIntro ? 'exit' : ''}`}>
      <div className="intro-content">
        {/* Logo */}
        <div className="logo-container">
          <img 
            src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
            alt="Sound Tales Logo" 
            className="sound-tales-logo"
          />
        </div>
        
        {/* Titre */}
        <div className="title-container">
          <h1 className="tale-title">OSRASE</h1>
          <h2 className="tale-subtitle">Une production Sound Tales</h2>
        </div>
        
        {/* Bouton de démarrage */}
        <div className="start-container">
          <div className="start-button" onClick={onStart}>
            Commencer la lecture
          </div>
          <p className="start-hint">
            Astuce : Cliquez sur les dialogues pour les entendre
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;