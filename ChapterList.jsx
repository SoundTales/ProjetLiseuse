import { useState, useEffect } from 'react';
import { chapterData } from '../data/chapterData';
import '../styles/ChapterList.css';

const ChapterList = ({ 
  onSelectChapter, 
  onResumeReading,
  currentChapter, 
  readingProgress,
  bookmarks,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('chapters');
  const [showHorizontalNav, setShowHorizontalNav] = useState(false);
  
  // Format reading progress into percentage
  const formatProgress = (progress) => {
    if (!progress) return 0;
    return Math.round(progress * 100);
  };
  
  // Format duration for display
  const formatDuration = (chapter) => {
    // Simuler une durée pour chaque chapitre (en pratique, cela viendrait des données réelles)
    const hours = chapter.id % 2 === 0 ? 1 : 0;
    const minutes = chapter.id * 10 % 60;
    return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
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
    <div className="chapter-list-container">
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
                <span>Progression totale: {calculateOverallProgress()}%</span>
                <span>{Object.keys(readingProgress).length} chapitres commencés sur {chapterData.length}</span>
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
                  className={`chapter-item ${chapter.id === currentChapter ? 'current' : ''}`}
                  onClick={() => onSelectChapter(chapter.id)}
                >
                  <div className="chapter-item-content">
                    <div className="chapter-icon">
                      <img src={chapter.icon || '/default-icon.png'} alt="" />
                    </div>
                    <div className="chapter-details">
                      <h3 className="chapter-title">
                        {`${chapter.id}. ${chapter.title}`}
                      </h3>
                      
                      <div className="chapter-meta">
                        <span className="chapter-duration">{formatDuration(chapter)}</span>
                        <span className="chapter-year">2023</span>
                      </div>
                      
                      {hasStarted(chapter.id) && (
                        <div className="chapter-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${formatProgress(readingProgress[chapter.id])}%` }}
                            ></div>
                          </div>
                          <div className="progress-text">
                            <span>Avancement</span>
                            <span className="progress-percentage">
                              {formatProgress(readingProgress[chapter.id])}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {getChapterBookmarks(chapter.id).length > 0 && (
                        <div className="bookmark-indicator">
                          🔖 {getChapterBookmarks(chapter.id).length} marque-page(s)
                        </div>
                      )}
                    </div>
                    
                    <div className="chapter-download-button">
                      <span className="download-icon">↓</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        
        {/* ONGLET FAN STORE */}
        {activeTab === 'fanstore' && (
          <div className="fanstore">
            <div className="fanstore-header">
              <h2 className="fanstore-title">Fan Store Osrase</h2>
              <p className="store-description">
                Découvrez nos produits exclusifs liés à l'univers d'Osrase 
                et soutenez les créateurs de cette expérience unique
              </p>
            </div>
            
            <div className="universe-showcase">
              <h3 className="universe-title">L'Univers OSRASE</h3>
              <div className="team-members">
                <div className="team-member">
                  <div className="team-member-photo">
                    <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Johnny Delaveau" />
                  </div>
                  <h4>Johnny Delaveau</h4>
                  <p>Auteur</p>
                </div>
                
                <div className="team-member">
                  <div className="team-member-photo">
                    <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Quentin Querel" />
                  </div>
                  <h4>Quentin Querel</h4>
                  <p>Compositeur</p>
                </div>
              </div>
              
              <div className="production-label">Une production originale SOUND TALES</div>
              
              <div className="tale-features">
                <div className="tale-feature">
                  <div className="feature-icon">📖</div>
                  <div className="feature-title">Tale</div>
                  <div className="feature-description">20 chapitres - L'histoire de Malone et Zadig</div>
                </div>
                
                <div className="tale-feature">
                  <div className="feature-icon">🎵</div>
                  <div className="feature-title">Sound</div>
                  <div className="feature-description">20 thèmes originaux accompagnent l'ambiance</div>
                </div>
                
                <div className="tale-feature">
                  <div className="feature-icon">💬</div>
                  <div className="feature-title">Dialogue</div>
                  <div className="feature-description">Dialogues interactifs pour vivre la scène</div>
                </div>
                
                <div className="tale-feature">
                  <div className="feature-icon">🖼️</div>
                  <div className="feature-title">Illustration</div>
                  <div className="feature-description">Vue d'artiste à la fin de chaque chapitre</div>
                </div>
              </div>
            </div>
            
            <div className="benefits-distribution">
              <div className="benefit-item">
                <div className="benefit-percentage">50%</div>
                <div className="benefit-label">AUTEUR</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-percentage">30%</div>
                <div className="benefit-label">COMPOSITEUR</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-percentage">20%</div>
                <div className="benefit-label">PLATEFORME</div>
              </div>
            </div>
            
            <h3 className="store-items-heading">Produits Osrase</h3>
            <div className="store-items">
              <div className="store-item">
                <div className="store-item-image-container">
                  <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Livre collector" />
                  <div className="store-item-label">LIVRE COLLECTION</div>
                </div>
                <div className="store-item-content">
                  <h3>Édition Collector Limitée</h3>
                  <p>Édition limitée avec illustrations exclusives et signature de l'auteur Johnny Delaveau</p>
                  <div className="item-price">29,99€</div>
                  <button className="store-button" onClick={() => window.open('https://soundtales.com/store/livre-collector', '_blank')}>
                    VOIR LE PRODUIT
                  </button>
                </div>
              </div>
              
              <div className="store-item">
                <div className="store-item-image-container">
                  <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Bande originale" />
                  <div className="store-item-label">BANDE ORIGINAL</div>
                </div>
                <div className="store-item-content">
                  <h3>Bande Originale d'Osrase</h3>
                  <p>L'intégrale des thèmes musicaux du Tale en CD ou vinyle composés par Quentin Querel</p>
                  <div className="item-price">14,99€</div>
                  <button className="store-button" onClick={() => window.open('https://soundtales.com/store/bande-originale', '_blank')}>
                    VOIR LE PRODUIT
                  </button>
                </div>
              </div>
              
              <div className="store-item">
                <div className="store-item-image-container">
                  <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Pack Collector" />
                  <div className="store-item-label">OSRASE</div>
                </div>
                <div className="store-item-content">
                  <h3>Pack Collector Complet</h3>
                  <p>Le livre, la bande originale et un pendentif Osrase authentique en édition limitée</p>
                  <div className="item-price">49,99€</div>
                  <button className="store-button" onClick={() => window.open('https://soundtales.com/store/pack-collector', '_blank')}>
                    VOIR LE PRODUIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ONGLET CREDITS */}
        {activeTab === 'credits' && (
          <div className="credits">
            <div className="credits-header">
              <h2 className="credits-title">Crédits et Présentation</h2>
              <p className="credits-subtitle">
                Découvrez l'équipe derrière Osrase et les détails de cette expérience narrative unique
              </p>
            </div>
            
            <div className="credits-section">
              <h3>L'équipe artistique</h3>
              <div className="team-members">
                <div className="team-member">
                  <div className="team-member-photo">
                    <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Johnny Delaveau" />
                  </div>
                  <h4>Johnny Delaveau</h4>
                  <p>Auteur</p>
                </div>
                
                <div className="team-member">
                  <div className="team-member-photo">
                    <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Quentin Querel" />
                  </div>
                  <h4>Quentin Querel</h4>
                  <p>Compositeur</p>
                </div>
              </div>
            </div>
            
            <div className="credits-proportions">
              <h3 className="proportions-title">Répartition des bénéfices</h3>
              
              <div className="proportion-item">
                <div className="proportion-role">Auteur</div>
                <div className="proportion-percentage">50%</div>
                <div className="proportion-bar-container">
                  <div className="proportion-bar" style={{ width: '50%' }}>
                    <div className="proportion-label">Johnny Delaveau</div>
                  </div>
                </div>
              </div>
              
              <div className="proportion-item">
                <div className="proportion-role">Compositeur</div>
                <div className="proportion-percentage">30%</div>
                <div className="proportion-bar-container">
                  <div className="proportion-bar" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div className="proportion-item">
                <div className="proportion-role">Plateforme</div>
                <div className="proportion-percentage">20%</div>
                <div className="proportion-bar-container">
                  <div className="proportion-bar" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="tale-description">
              <h3>À propos d'Osrase</h3>
              <p>
                Alors que de profondes inégalités rongent le monde des Osrases, Malone et Zadig, deux habitants d'un secteur défavorisé, sont confrontés à la mort de leur ami Aimé, avec qui ils formaient un trio inséparable. Malone, calculateur, rêve de transformer le monde de l'intérieur grâce à une ascension sociale fulgurante, tandis que Zadig, plus populiste prend la tête d'un mouvement révolutionnaire.
              </p>
              <p>
                L'un agira dans l'ombre, l'autre dans la lumière. Leur amitié résistera-t-elle à ces choix opposés ? Malone deviendra-t-il un traître ? Et laquelle de leurs visions triomphera ?
              </p>
              <p>
                L'histoire tragique d'une amitié entre deux leaders unis par une loyauté indéfectible.
              </p>
            </div>
            
            <div className="tale-features">
              <h3>Caractéristiques techniques</h3>
              <ul>
                <li><strong>Format :</strong> Tale One-Shot</li>
                <li><strong>Durée de lecture :</strong> 2h30 environ</li>
                <li><strong>Nombre de chapitres :</strong> 20</li>
                <li><strong>Thèmes musicaux :</strong> 12 compositions originales</li>
                <li><strong>Voix :</strong> 8 comédiens professionnels</li>
                <li><strong>Sound design :</strong> Créé spécifiquement pour cette expérience</li>
              </ul>
            </div>
            
            <div className="awards-section">
              <h3 className="awards-title">Récompenses</h3>
              <div className="awards-list">
                <div className="award-item">
                  <div className="award-name">Prix de l'innovation narrative</div>
                  <div className="award-category">Festival du livre numérique 2023</div>
                </div>
                <div className="award-item">
                  <div className="award-name">Meilleure bande-son originale</div>
                  <div className="award-category">Expérience narrative interactive 2023</div>
                </div>
              </div>
            </div>
            
            <div className="contact-section">
              <h3>Nous contacter</h3>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">contact@soundtales.com</div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📱</div>
                  <div className="contact-label">Réseaux sociaux</div>
                  <div className="contact-value">@SoundTalesOfficial</div>
                </div>
              </div>
            </div>
          </div>
        )}
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