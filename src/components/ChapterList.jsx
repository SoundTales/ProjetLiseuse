import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chapterData } from '../data/chapterData';
import FanStore from './FanStore';
import Credits from './Credits';
import '../styles/ChapterList.css';
import '../styles/FanStore.css';
import '../styles/Credits.css';

const ChapterList = ({ 
  onSelectChapter, 
  onResumeReading,
  currentChapter, 
  readingProgress = {},
  bookmarks = [],
  onClose,
  nightMode = false
}) => {
  const [activeTab, setActiveTab] = useState('chapters');
  
  // Format reading progress into percentage
  const formatProgress = (progress) => {
    if (!progress) return 0;
    return Math.round(progress * 100);
  };
  
  // Check if chapter has been started
  const hasStarted = (chapterId) => {
    return readingProgress[chapterId] !== undefined;
  };
  
  // Calculate overall progress
  const calculateOverallProgress = () => {
    const chapterCount = chapterData.length;
    let chaptersStarted = 0;
    let totalProgress = 0;
    
    chapterData.forEach(chapter => {
      const progress = readingProgress[chapter.id];
      if (progress !== undefined) {
        chaptersStarted++;
        totalProgress += progress;
      }
    });
    
    return chaptersStarted > 0 
      ? Math.round((totalProgress / chapterCount) * 100) 
      : 0;
  };
  
  // Get bookmarks for a specific chapter
  const getChapterBookmarks = (chapterId) => {
    return bookmarks.filter(bookmark => bookmark.chapterId === chapterId);
  };

  // Détection des mouvements horizontaux pour la navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveTab(prev => {
          if (prev === 'chapters') return 'fanstore';
          if (prev === 'credits') return 'chapters';
          return prev;
        });
      } else if (e.key === 'ArrowRight') {
        setActiveTab(prev => {
          if (prev === 'chapters') return 'credits';
          if (prev === 'fanstore') return 'chapters';
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Ajout de la navigation tactile (swipe)
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const MIN_SWIPE_DISTANCE = 50;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) < MIN_SWIPE_DISTANCE) return;
      
      if (swipeDistance > 0) {
        // Swipe vers la droite
        setActiveTab(prev => {
          if (prev === 'chapters') return 'fanstore';
          if (prev === 'credits') return 'chapters';
          return prev;
        });
      } else {
        // Swipe vers la gauche
        setActiveTab(prev => {
          if (prev === 'chapters') return 'credits';
          if (prev === 'fanstore') return 'chapters';
          return prev;
        });
      }
    };
    
    const contentElement = document.querySelector('.chapter-list-content');
    if (contentElement) {
      contentElement.addEventListener('touchstart', handleTouchStart);
      contentElement.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        contentElement.removeEventListener('touchstart', handleTouchStart);
        contentElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);
  
  return (
    <div className={`chapter-list-container ${nightMode ? 'night-mode' : ''}`}>
      <div className="chapter-list-header">
        <h1 className="osrase-title">OSRASE</h1>
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'fanstore' ? 'active' : ''}`}
            onClick={() => setActiveTab('fanstore')}
          >
            <span className="tab-icon">🛒</span>
            <span className="tab-text">Fan Store</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'chapters' ? 'active' : ''}`}
            onClick={() => setActiveTab('chapters')}
          >
            <span className="tab-icon">📚</span>
            <span className="tab-text">Chapitres</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'credits' ? 'active' : ''}`}
            onClick={() => setActiveTab('credits')}
          >
            <span className="tab-icon">ℹ️</span>
            <span className="tab-text">Crédits</span>
          </button>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="chapter-list-content">
        {/* ONGLET CHAPITRES */}
        {activeTab === 'chapters' && (
          <>
            <div className="resume-reading">
              {readingProgress.lastChapter ? (
                <div className="resume-reading-info">
                  <p>Vous étiez en train de lire le chapitre {readingProgress.lastChapter}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${formatProgress(readingProgress[readingProgress.lastChapter])}%` }}
                    ></div>
                  </div>
                  <button className="resume-button" onClick={onResumeReading}>
                    Reprendre la lecture
                  </button>
                </div>
              ) : (
                <div className="resume-reading-info">
                  <p>Commencez votre lecture</p>
                  <button className="resume-button" onClick={() => onSelectChapter(1)}>
                    Commencer au chapitre 1
                  </button>
                </div>
              )}
            </div>

            <div className="progress-overview">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Progression totale: {calculateOverallProgress()}%
              </div>
            </div>
            
            {bookmarks.length > 0 && (
              <div className="bookmarks-section">
                <h3>Vos marque-pages</h3>
                <div className="bookmarks-list">
                  {bookmarks.map((bookmark, index) => {
                    const chapter = chapterData.find(c => c.id === bookmark.chapterId);
                    return (
                      <div 
                        key={index}
                        className="bookmark-item"
                        onClick={() => onSelectChapter(bookmark.chapterId)}
                      >
                        <div className="bookmark-icon">🔖</div>
                        <div className="bookmark-details">
                          <span className="bookmark-chapter">
                            {chapter ? `Chapitre ${chapter.id}: ${chapter.title}` : `Chapitre ${bookmark.chapterId}`}
                          </span>
                          <span className="bookmark-position">
                            {Math.round(bookmark.position * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <h3>Tous les chapitres</h3>
            <ul className="chapters">
              {chapterData.map(chapter => (
                <li 
                  key={chapter.id}
                  className={`
                    chapter-item ${chapter.id === currentChapter ? 'current' : ''}`}
                  onClick={() => onSelectChapter(chapter.id)}
                >
                  <div className="chapter-item-content">
                    <div className="chapter-icon">
                      <img src={chapter.icon || '/default-icon.png'} alt="" />
                    </div>
                    <div className="chapter-details">
                      <h3 className="chapter-title">
                        {`Chapitre ${chapter.id}: ${chapter.title}`}
                      </h3>
                      {hasStarted(chapter.id) && (
                        <div className="chapter-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${formatProgress(readingProgress[chapter.id])}%` }}
                            ></div>
                          </div>
                          <span className="progress-percentage">
                            {formatProgress(readingProgress[chapter.id])}%
                          </span>
                        </div>
                      )}
                      {getChapterBookmarks(chapter.id).length > 0 && (
                        <div className="bookmark-indicator">
                          🔖 {getChapterBookmarks(chapter.id).length} marque-page(s)
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        
        {/* ONGLET FAN STORE */}
        {activeTab === 'fanstore' && <FanStore />}
        
        {/* ONGLET CREDITS */}
        {activeTab === 'credits' && <Credits />}
      </div>
      
      {/* Guides de navigation horizontale */}
      <div className="horizontal-navigation-guides">
        {activeTab === 'chapters' && (
          <>
            <div className="left-guide" onClick={() => setActiveTab('fanstore')}>
              <span className="guide-arrow">←</span>
              <span className="guide-text">Fan Store</span>
            </div>
            <div className="right-guide" onClick={() => setActiveTab('credits')}>
              <span className="guide-text">Crédits</span>
              <span className="guide-arrow">→</span>
            </div>
          </>
        )}
        {activeTab === 'fanstore' && (
          <div className="right-guide" onClick={() => setActiveTab('chapters')}>
            <span className="guide-text">Chapitres</span>
            <span className="guide-arrow">→</span>
          </div>
        )}
        {activeTab === 'credits' && (
          <div className="left-guide" onClick={() => setActiveTab('chapters')}>
            <span className="guide-arrow">←</span>
            <span className="guide-text">Chapitres</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterList;