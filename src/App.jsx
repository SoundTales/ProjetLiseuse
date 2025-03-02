import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import IntroScreen from './components/IntroScreen';
import ChapterList from './components/ChapterList';
import Reader from './components/Reader';
import Navigation from './components/Navigation';
import VolumeControl from './components/VolumeControl';
import { themeMusic, dialogueClips, preloadThemes } from './data/audioData';

function App() {
  // States for application
  const [currentChapter, setCurrentChapter] = useState(1);
  const [readingProgress, setReadingProgress] = useState({});
  const [showIntro, setShowIntro] = useState(true);
  const [exitIntro, setExitIntro] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [textSize, setTextSize] = useState('medium');
  const [dialogueVolume, setDialogueVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [chapterListOpen, setChapterListOpen] = useState(false);
  
  // États pour la gestion des sons hébergés
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [currentThemeUrl, setCurrentThemeUrl] = useState('');
  const [lastDialogueTime, setLastDialogueTime] = useState(0);
  
  // Refs for audio elements
  const themeMusicRef = useRef(null);
  const currentDialogueRef = useRef(null); // Référence au dialogue en cours de lecture
  
  const navigate = useNavigate();

  // Préchargement des thèmes musicaux
  useEffect(() => {
    try {
      preloadThemes();
      setAudioLoaded(true);
    } catch (error) {
      console.error("Erreur lors du préchargement des thèmes:", error);
      setAudioError(true);
    }
  }, []);

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('soundTalesSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNightMode(settings.nightMode || false);
      setTextSize(settings.textSize || 'medium');
      setDialogueVolume(settings.dialogueVolume || 0.5);
      setMusicVolume(settings.musicVolume || 0.5);
    }
    
    const savedProgress = localStorage.getItem('soundTalesProgress');
    if (savedProgress) {
      setReadingProgress(JSON.parse(savedProgress));
    }
    
    const savedBookmarks = localStorage.getItem('soundTalesBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    const settings = {
      nightMode,
      textSize,
      dialogueVolume,
      musicVolume
    };
    
    localStorage.setItem('soundTalesSettings', JSON.stringify(settings));
  }, [nightMode, textSize, dialogueVolume, musicVolume]);

  // Mise à jour du volume du dialogue en cours de lecture lorsque le volume change
  useEffect(() => {
    if (currentDialogueRef.current) {
      currentDialogueRef.current.volume = dialogueVolume;
    }
  }, [dialogueVolume]);

  // Save reading progress to localStorage
  useEffect(() => {
    if (Object.keys(readingProgress).length > 0) {
      localStorage.setItem('soundTalesProgress', JSON.stringify(readingProgress));
    }
  }, [readingProgress]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('soundTalesBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Start theme music when chapter loads - Modifié pour éviter de relancer le thème
  useEffect(() => {
    if (!showIntro && audioPlaying) {
      const musicUrl = themeMusic[currentChapter];
      
      if (!musicUrl) {
        console.warn(`Musique de thème non trouvée pour le chapitre: ${currentChapter}`);
        return;
      }
      
      // Ne relancez la musique que si l'URL a changé
      if (musicUrl !== currentThemeUrl) {
        if (themeMusicRef.current) {
          themeMusicRef.current.src = musicUrl;
          themeMusicRef.current.load();
          
          themeMusicRef.current.play().catch(error => {
            console.error("Impossible de jouer la musique de thème:", error);
            setAudioError(true);
          });
          
          setCurrentThemeUrl(musicUrl);
        }
      }
    }
    
    return () => {
      if (themeMusicRef.current && showIntro) {
        themeMusicRef.current.pause();
      }
    };
  }, [showIntro, audioPlaying, currentChapter, currentThemeUrl]);

  // Mise à jour du volume sans relancer le thème
  useEffect(() => {
    if (themeMusicRef.current) {
      themeMusicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  // Fonction pour activer le mode plein écran
  const enableFullscreen = () => {
    const elem = document.documentElement;
    
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Impossible d'activer le mode plein écran:", error);
    }
  };

  // MODIFIÉ: Dirige vers la page de chapitrage au lieu de la liseuse
  const startReading = () => {
    // Activer le mode plein écran
    enableFullscreen();
    
    // Animation de sortie avant de changer de vue
    setExitIntro(true);
    
    // Attendre la fin de l'animation avant de naviguer
    setTimeout(() => {
      setShowIntro(false);
      setAudioPlaying(true);
      
      // Rediriger vers la page de chapitrage
      navigate('/chapters');
    }, 500); // Délai correspondant à la durée de l'animation fadeOut
  };

  // Pour reprendre la lecture où l'utilisateur s'est arrêté
  const resumeReading = () => {
    if (readingProgress.lastChapter) {
      setCurrentChapter(readingProgress.lastChapter);
      navigate(`/read/${readingProgress.lastChapter}`);
    } else {
      // Si pas de progression enregistrée, commencer au chapitre 1
      navigate('/read/1');
    }
  };

  const toggleNightMode = () => {
    setNightMode(!nightMode);
  };

  const changeTextSize = (size) => {
    setTextSize(size);
  };

  const toggleVolumeControls = () => {
    setShowVolumeControls(!showVolumeControls);
  };

  // Fonction de gestion des clics sur les dialogues - MODIFIÉE pour ne pas jouer deux dialogues à la fois
  const handleDialogueClick = (dialogueId) => {
    console.log("Dialogue cliqué:", dialogueId);
    
    // Anti-rebond pour éviter des clics trop rapides
    const now = Date.now();
    if (now - lastDialogueTime < 300) {
      console.log("Clic ignoré (trop rapide)");
      return;
    }
    setLastDialogueTime(now);
    
    // Récupérer l'URL du dialogue
    const audioUrl = dialogueClips[dialogueId];
    
    console.log("URL audio:", audioUrl);
    
    if (!audioUrl) {
      console.warn(`Dialogue audio non trouvé pour l'ID: ${dialogueId}`);
      return;
    }
    
    // Arrêter le dialogue en cours s'il y en a un
    if (currentDialogueRef.current) {
      currentDialogueRef.current.pause();
      // Optionnel: réinitialiser pour permettre une future lecture
      try {
        currentDialogueRef.current.currentTime = 0;
      } catch (e) {
        // Ignorer les erreurs liées à la réinitialisation
      }
    }
    
    // Créer un nouvel élément audio pour le dialogue
    const dialogueAudio = new Audio(audioUrl);
    dialogueAudio.volume = dialogueVolume;
    
    // Stocker la référence au nouveau dialogue
    currentDialogueRef.current = dialogueAudio;
    
    // Tenter de jouer le dialogue
    dialogueAudio.play().catch(error => {
      console.error("Impossible de jouer le dialogue:", error);
      currentDialogueRef.current = null;
    });
    
    // Nettoyer la référence une fois le dialogue terminé
    dialogueAudio.addEventListener('ended', () => {
      if (currentDialogueRef.current === dialogueAudio) {
        currentDialogueRef.current = null;
      }
    });
  };

  const navigateToChapter = (chapterNumber) => {
    setCurrentChapter(chapterNumber);
    setChapterListOpen(false);
    navigate(`/read/${chapterNumber}`);
    
    // Update reading progress
    setReadingProgress({
      ...readingProgress,
      lastChapter: chapterNumber
    });
  };

  const toggleBookmark = (chapterId, position) => {
    const existingBookmarkIndex = bookmarks.findIndex(
      bookmark => bookmark.chapterId === chapterId && Math.abs(bookmark.position - position) < 0.01
    );
    
    if (existingBookmarkIndex >= 0) {
      // Remove bookmark
      const newBookmarks = [...bookmarks];
      newBookmarks.splice(existingBookmarkIndex, 1);
      setBookmarks(newBookmarks);
    } else {
      // Add bookmark
      setBookmarks([
        ...bookmarks,
        { chapterId, position, timestamp: new Date().toISOString() }
      ]);
    }
  };

  const returnToStore = () => {
    // Dans l'implémentation réelle, cela naviguerait vers le site Wix
    window.location.href = 'https://soundtales.com';
  };

  return (
    <div className={`app-container ${nightMode ? 'night-mode' : 'day-mode'}`}>
      {/* Audio Elements */}
      <audio ref={themeMusicRef} loop />
      
      {/* Notification pour les erreurs audio */}
      {audioError && (
        <div className="audio-error-message">
          Problème de chargement audio. Vérifiez votre connexion.
          <button onClick={() => setAudioError(false)}>Fermer</button>
        </div>
      )}
      
      {/* Volume Controls */}
      {showVolumeControls && (
        <VolumeControl 
          musicVolume={musicVolume}
          dialogueVolume={dialogueVolume}
          setMusicVolume={setMusicVolume}
          setDialogueVolume={setDialogueVolume}
          onClose={() => setShowVolumeControls(false)}
        />
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={
            <IntroScreen 
              onStart={startReading} 
              showIntro={showIntro}
              exitIntro={exitIntro}
            />
          } 
        />
        
        <Route 
          path="/chapters" 
          element={
            <ChapterList 
              onSelectChapter={navigateToChapter}
              onResumeReading={resumeReading}
              currentChapter={currentChapter}
              readingProgress={readingProgress}
              bookmarks={bookmarks}
              onClose={() => navigate('/')}
              nightMode={nightMode}
            />
          } 
        />
        
        <Route 
          path="/read/:chapterId" 
          element={
            <Reader 
              chapterId={currentChapter}
              textSize={textSize}
              nightMode={nightMode}
              onDialogueClick={handleDialogueClick}
              onBookmark={toggleBookmark}
              bookmarks={bookmarks}
              updateProgress={(progress) => {
                setReadingProgress({
                  ...readingProgress,
                  [currentChapter]: progress,
                  lastChapter: currentChapter
                });
              }}
            />
          } 
        />
      </Routes>
      
      {!showIntro && !window.location.pathname.includes('/chapters') && (
        <Navigation 
          currentChapter={currentChapter}
          onPreviousChapter={() => navigateToChapter(Math.max(1, currentChapter - 1))}
          onNextChapter={() => navigateToChapter(currentChapter + 1)}
          onReturnToStore={returnToStore}
          onToggleChapterList={() => navigate('/chapters')}
          onToggleBookmarks={() => setShowBookmarks(!showBookmarks)}
          onToggleNightMode={toggleNightMode}
          onToggleVolumeControls={toggleVolumeControls}
          onChangeTextSize={changeTextSize}
          textSize={textSize}
          nightMode={nightMode}
        />
      )}
      
      {showBookmarks && (
        <div className="bookmarks-panel">
          <h3>Marque-pages</h3>
          <ul>
            {bookmarks.map((bookmark, index) => (
              <li key={index} onClick={() => {
                navigateToChapter(bookmark.chapterId);
                setShowBookmarks(false);
              }}>
                Chapitre {bookmark.chapterId} - {new Date(bookmark.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowBookmarks(false)}>Fermer</button>
        </div>
      )}
    </div>
  );
}

export default App;