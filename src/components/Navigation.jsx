import { useState } from 'react';
import '../styles/Navigation.css';

const Navigation = ({
  currentChapter,
  onPreviousChapter,
  onNextChapter,
  onReturnToStore,
  onToggleChapterList,
  onToggleBookmarks,
  onToggleNightMode,
  onToggleVolumeControls,
  onChangeTextSize,
  textSize,
  nightMode
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  return (
    <>
      <div className="navigation-bar">
        <button 
          className="nav-button prev-chapter"
          onClick={onPreviousChapter}
          disabled={currentChapter <= 1}
        >
          ← Précédent
        </button>
        
        <button 
          className="nav-button home-button"
          onClick={() => window.location.href = 'https://audiotalecontact.wixsite.com/audiotale/sound-tales'}
        >
          Catalogue
        </button>
        
        <button 
          className="nav-button chapters-button"
          onClick={onToggleChapterList}
        >
          Chapitres
        </button>
        
        <button 
          className="nav-button settings-button"
          onClick={toggleSettings}
        >
          Réglages
        </button>
        
        <button 
          className="nav-button next-chapter"
          onClick={onNextChapter}
        >
          Suivant →
        </button>
      </div>
      
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>Réglages</h3>
            <button 
              className="close-button"
              onClick={toggleSettings}
            >
              ×
            </button>
          </div>
          
          <div className="settings-group">
            <h4>Taille du texte</h4>
            <div className="text-size-controls">
              <button 
                className={`size-button ${textSize === 'small' ? 'active' : ''}`}
                onClick={() => onChangeTextSize('small')}
              >
                A
              </button>
              <button 
                className={`size-button ${textSize === 'medium' ? 'active' : ''}`}
                onClick={() => onChangeTextSize('medium')}
              >
                A+
              </button>
              <button 
                className={`size-button ${textSize === 'large' ? 'active' : ''}`}
                onClick={() => onChangeTextSize('large')}
              >
                A++
              </button>
            </div>
          </div>
          
          <div className="settings-group">
            <h4>Apparence</h4>
            <button 
              className={`mode-button ${nightMode ? 'night-active' : 'day-active'}`}
              onClick={onToggleNightMode}
            >
              {nightMode ? '☀️ Mode jour' : '🌙 Mode nuit'}
            </button>
          </div>
          
          <div className="settings-group">
            <h4>Son</h4>
            <button 
              className="volume-button"
              onClick={onToggleVolumeControls}
            >
              🔊 Réglage du son
            </button>
          </div>
          
          <div className="settings-group">
            <h4>Marque-pages</h4>
            <button 
              className="bookmarks-button"
              onClick={onToggleBookmarks}
            >
              📖 Vos marque-pages
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;