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
                  className={`chapter-item ${chapter.id === currentChapter ? 'current' : ''}`}
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
        {activeTab === 'fanstore' && (
          <div className="fanstore">
            <h2>Fan Store Osrase</h2>
            <p className="store-description">
              Découvrez nos produits exclusifs liés à l'univers d'Osrase
            </p>
            
            <div className="store-items">
              <div className="store-item">
                <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Livre collector" />
                <h3>Livre Collector</h3>
                <p>Édition limitée avec illustrations exclusives et signature de l'auteur</p>
                <div className="item-price">29,99€</div>
                <button className="store-button" onClick={() => window.open('https://soundtales.com/store/livre-collector', '_blank')}>
                  Voir le produit
                </button>
              </div>
              
              <div className="store-item">
                <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Bande originale" />
                <h3>Bande Originale</h3>
                <p>L'intégrale des thèmes musicaux du Tale en CD ou vinyle</p>
                <div className="item-price">14,99€</div>
                <button className="store-button" onClick={() => window.open('https://soundtales.com/store/bande-originale', '_blank')}>
                  Voir le produit
                </button>
              </div>
              
              <div className="store-item">
                <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Pack Collector" />
                <h3>Pack Collector Complet</h3>
                <p>Le livre, la bande originale et un pendentif Osrase authentique</p>
                <div className="item-price">49,99€</div>
                <button className="store-button" onClick={() => window.open('https://soundtales.com/store/pack-collector', '_blank')}>
                  Voir le produit
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* ONGLET CREDITS */}
        {activeTab === 'credits' && (
          <div className="credits">
            <h2>Crédits et Présentation</h2>
            
            <div className="credits-section">
              <h3>L'équipe artistique</h3>
              <div className="team-members">
                <div className="team-member">
                  <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Johnny Delaveau" />
                  <h4>Johnny Delaveau</h4>
                  <p>Auteur</p>
                </div>
                
                <div className="team-member">
                  <img src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" alt="Quentin Querel" />
                  <h4>Quentin Querel</h4>
                  <p>Compositeur</p>
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