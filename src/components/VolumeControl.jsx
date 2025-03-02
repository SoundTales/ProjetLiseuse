import '../styles/VolumeControl.css';

const VolumeControl = ({
  musicVolume,
  dialogueVolume,
  setMusicVolume,
  setDialogueVolume,
  onClose
}) => {
  const handleMusicVolumeChange = (e) => {
    setMusicVolume(parseFloat(e.target.value));
  };
  
  const handleDialogueVolumeChange = (e) => {
    setDialogueVolume(parseFloat(e.target.value));
  };
  
  const handleMuteAll = () => {
    setMusicVolume(0);
    setDialogueVolume(0);
  };
  
  const handleResetVolumes = () => {
    setMusicVolume(0.5);
    setDialogueVolume(0.5);
  };
  
  return (
    <div className="volume-control-container">
      <div className="volume-control-header">
        <h3>Réglage du son</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="volume-sliders">
        <div className="volume-slider">
          <label htmlFor="music-volume">
            {/* Icône musicale */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sound-icon">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <span>Musique</span>
          </label>
          <input
            type="range"
            id="music-volume"
            min="0"
            max="1"
            step="0.01"
            value={musicVolume}
            onChange={handleMusicVolumeChange}
            className="vertical-slider"
          />
          <span className="volume-percentage">
            {Math.round(musicVolume * 100)}%
          </span>
        </div>
        
        <div className="volume-slider">
          <label htmlFor="dialogue-volume">
            {/* Icône dialogue */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sound-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="9" y1="10" x2="15" y2="10"></line>
            </svg>
            <span>Dialogues</span>
          </label>
          <input
            type="range"
            id="dialogue-volume"
            min="0"
            max="1"
            step="0.01"
            value={dialogueVolume}
            onChange={handleDialogueVolumeChange}
            className="vertical-slider"
          />
          <span className="volume-percentage">
            {Math.round(dialogueVolume * 100)}%
          </span>
        </div>
      </div>
      
      <div className="volume-buttons">
        <button
          className="volume-button mute-button"
          onClick={handleMuteAll}
        >
          🔇 Couper le son
        </button>
        
        <button
          className="volume-button reset-button"
          onClick={handleResetVolumes}
        >
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default VolumeControl;