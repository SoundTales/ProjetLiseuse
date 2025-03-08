import React, { useState, useEffect, useRef } from 'react';
import { chapterData } from '../data/chapterData';
import '../styles/ChapterList.css';

const ChapterList = ({ 
  onSelectChapter, 
  onResumeReading,
  currentChapter, 
  readingProgress = {},
  bookmarks = [],
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('CHAPITRES');
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  // URL de l'image de fond pour la section haute
  const headerBackgroundImage = "https://static.wixstatic.com/media/b9ad46_230c347148794d72b89c4f815234e359~mv2.jpg";
  
  const MIN_SWIPE_DISTANCE = 50;
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // Format reading progress
  const formatProgress = (progress) => {
    if (!progress) return 0;
    return Math.round(progress * 100);
  };

  // Calcul du temps restant (simulé)
  const calculateRemainingTime = () => {
    // Supposons une durée totale de 150 minutes (2h30)
    const totalDuration = 150;
    
    // Calculer la progression globale
    const totalChapters = chapterData.length;
    let completedPercentage = 0;
    
    Object.values(readingProgress).forEach(progress => {
      if (typeof progress === 'number') {
        completedPercentage += progress / totalChapters;
      }
    });
    
    // Calculer le temps restant
    const remainingMinutes = Math.round(totalDuration * (1 - completedPercentage));
    
    return `${remainingMinutes} minutes`;
  };

  // Générer une description courte pour chaque chapitre
  const getChapterShortDescription = (chapter) => {
    // Extraire la première phrase ou les premiers mots du contenu du chapitre
    if (!chapter.content) return "Phrase introduisant le chapitre";
    
    const firstSentence = chapter.content.split('.')[0].trim();
    if (firstSentence.length < 60) {
      return firstSentence + "...";
    } else {
      return firstSentence.substring(0, 57) + "...";
    }
  };
  
  // Handler pour les gestes de swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };
  
  const handleSwipe = () => {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) < MIN_SWIPE_DISTANCE) return;
    
    if (swipeDistance > 0) {
      // Swipe vers la droite
      setActiveTab(prev => {
        if (prev === 'CHAPITRES') return 'FAN STORE';
        if (prev === 'CREDITS') return 'CHAPITRES';
        return prev;
      });
    } else {
      // Swipe vers la gauche
      setActiveTab(prev => {
        if (prev === 'CHAPITRES') return 'CREDITS';
        if (prev === 'FAN STORE') return 'CHAPITRES';
        return prev;
      });
    }
  };
  
  // Gestion de l'affichage en plein écran
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        containerRef.current.style.height = `${viewportHeight}px`;
        
        // Ajustement de la hauteur du contenu
        if (contentRef.current) {
          const headerHeight = document.querySelector('.header-section')?.offsetHeight || 0;
          const tabNavHeight = document.querySelector('.tab-navigation')?.offsetHeight || 0;
          
          const contentHeight = viewportHeight - headerHeight - tabNavHeight;
          contentRef.current.style.height = `${contentHeight}px`;
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculer le pourcentage global de progression
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
  
  // Style personnalisé pour masquer le logo ou s'assurer que le texte est lisible
  const headerStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(66, 66, 64, 0.9)), url(${headerBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    zIndex: 1
  };
  
  // Style pour rendre le texte plus visible
  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#F5FF85', // Jaune vif pour meilleur contraste
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    marginBottom: '20px'
  };
  
  const taglineStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.4',
    color: '#FFFFFF', // Blanc pour meilleur contraste
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)',
    marginBottom: '30px'
  };
  
  // Style pour la section de contenu
  const headerContentStyle = {
    position: 'relative',
    zIndex: 2, // S'assurer que le contenu est au-dessus de tout logo
    padding: '40px 40px',
    flex: 1
  };

  return (
    <div 
      className="chapter-list-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bouton de fermeture */}
      <button className="close-button" onClick={onClose}>
        <span aria-hidden="true">×</span>
        <span className="visually-hidden">Fermer</span>
      </button>
      
      {/* Partie supérieure avec fond d'image - NOUVEAU DESIGN avec styles modifiés */}
      <div 
        className="header-section"
        style={headerStyle}
      >
        {/* Bloc qui pourrait masquer ou limiter l'affichage du logo */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
            zIndex: 1
          }}
        ></div>
        
        <div className="header-content" style={headerContentStyle}>
          <h1 className="title" style={titleStyle}>OSRASE</h1>
          
          <p className="tagline" style={taglineStyle}>
            Phrase d'accroche du roman en<br/>deux lignes
          </p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calculateOverallProgress()}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <span>{calculateOverallProgress()}%</span>
              <span>{calculateRemainingTime()} restantes</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="button button-secondary"
              onClick={() => onSelectChapter(1)}
            >
              Lire le Tale
            </button>
            
            {readingProgress.lastChapter && (
              <button 
                className="button button-primary"
                onClick={onResumeReading}
              >
                Reprendre la lecture
              </button>
            )}
          </div>
        </div>
        
        {/* Couverture du livre avec style modifié */}
        <div className="cover-image" style={{ position: 'relative', zIndex: 2 }}>
          <img 
            src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
            alt="Couverture du livre OSRASE" 
            className="cover-image-https"
            style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)' }}
          />
        </div>
      </div>
      
      {/* Navigation par onglets - NOUVEAU DESIGN */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'FAN STORE' ? 'active' : ''}`}
          onClick={() => setActiveTab('FAN STORE')}
        >
          FAN STORE
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'CHAPITRES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CHAPITRES')}
        >
          CHAPITRES
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'CREDITS' ? 'active' : ''}`}
          onClick={() => setActiveTab('CREDITS')}
        >
          CREDITS
        </button>
      </div>
      
      {/* Contenu principal - REDESIGN POUR LE LAYOUT DES CHAPITRES */}
      <div className="tab-content-container" ref={contentRef}>
        {activeTab === 'CHAPITRES' && (
          <div className="chapters-content tab-content">
            <h2 className="section-title">Tous les chapitres</h2>
            <div className="chapters-grid">
              {chapterData.map(chapter => (
                <div 
                  key={chapter.id}
                  className={`chapter-card ${chapter.id === currentChapter ? 'current' : ''}`}
                  onClick={() => onSelectChapter(chapter.id)}
                >
                  <div className="chapter-image">
                    IMAGE CHAPITRE
                  </div>
                  
                  <div className="chapter-info">
                    <h3 className="chapter-title">
                      {chapter.id}. {chapter.title}
                    </h3>
                    <p className="chapter-description">
                      {getChapterShortDescription(chapter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'FAN STORE' && (
          <div className="fan-store-container tab-content">
            <h2 className="section-title">Produits OSRASE</h2>
            
            <div className="products-grid">
              <div className="product-card">
                <div className="product-image">
                  <img 
                    src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
                    alt="Livre collector"
                  />
                  <div className="product-badge">EXCLUSIF</div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">Édition Collector Limitée</h3>
                  <p className="product-description">
                    Édition limitée avec illustrations exclusives et signature de l'auteur Johnny Delaveau
                  </p>
                  <div className="product-price">29,99€</div>
                  <button 
                    className="buy-button"
                    onClick={() => window.open('https://soundtales.com/store/livre-collector', '_blank')}
                  >
                    VOIR LE PRODUIT
                  </button>
                </div>
              </div>
              
              <div className="product-card">
                <div className="product-image">
                  <img 
                    src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
                    alt="Bande originale"
                  />
                  <div className="product-badge">MUSIQUE</div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">Bande Originale d'Osrase</h3>
                  <p className="product-description">
                    L'intégrale des thèmes musicaux du Tale en CD ou vinyle composés par Quentin Querel
                  </p>
                  <div className="product-price">14,99€</div>
                  <button 
                    className="buy-button"
                    onClick={() => window.open('https://soundtales.com/store/bande-originale', '_blank')}
                  >
                    VOIR LE PRODUIT
                  </button>
                </div>
              </div>
              
              <div className="product-card highlight">
                <div className="product-image">
                  <img 
                    src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
                    alt="Pack collector"
                  />
                  <div className="product-badge">PACK COMPLET</div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">Pack Collector Complet</h3>
                  <p className="product-description">
                    Le livre, la bande originale et un pendentif Osrase authentique en édition limitée
                  </p>
                  <div className="product-price">49,99€</div>
                  <button 
                    className="buy-button"
                    onClick={() => window.open('https://soundtales.com/store/pack-collector', '_blank')}
                  >
                    VOIR LE PRODUIT
                  </button>
                </div>
              </div>
            </div>
            
            <div className="benefits-distribution">
              <h3 className="benefits-title">Distribution des bénéfices</h3>
              <div className="benefits-chart">
                <div className="benefit-bar">
                  <div className="benefit-fill author" style={{ width: '50%' }}>
                    <span className="benefit-label">Auteur</span>
                    <span className="benefit-value">50%</span>
                  </div>
                </div>
                <div className="benefit-bar">
                  <div className="benefit-fill composer" style={{ width: '30%' }}>
                    <span className="benefit-label">Compositeur</span>
                    <span className="benefit-value">30%</span>
                  </div>
                </div>
                <div className="benefit-bar">
                  <div className="benefit-fill platform" style={{ width: '20%' }}>
                    <span className="benefit-label">Plateforme</span>
                    <span className="benefit-value">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'CREDITS' && (
          <div className="credits-container tab-content">
            <div className="credits-section">
              <h2 className="section-title">L'équipe artistique</h2>
              <div className="team-grid">
                <div className="team-member">
                  <div className="member-photo">
                    <img 
                      src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
                      alt="Johnny Delaveau" 
                    />
                  </div>
                  <h3 className="member-name">Johnny Delaveau</h3>
                  <p className="member-role">Auteur</p>
                </div>
                
                <div className="team-member">
                  <div className="member-photo">
                    <img 
                      src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
                      alt="Quentin Querel" 
                    />
                  </div>
                  <h3 className="member-name">Quentin Querel</h3>
                  <p className="member-role">Compositeur</p>
                </div>
              </div>
            </div>
            
            <div className="credits-section">
              <h2 className="section-title">À propos d'OSRASE</h2>
              <div className="about-content">
                <p className="story-description">
                  Alors que de profondes inégalités rongent le monde des Osrases, Malone et Zadig, deux habitants d'un secteur défavorisé, sont confrontés à la mort de leur ami Aimé, avec qui ils formaient un trio inséparable. Malone, calculateur, rêve de transformer le monde de l'intérieur grâce à une ascension sociale fulgurante, tandis que Zadig, plus populiste prend la tête d'un mouvement révolutionnaire.
                </p>
                <p className="story-description">
                  L'un agira dans l'ombre, l'autre dans la lumière. Leur amitié résistera-t-elle à ces choix opposés ? Malone deviendra-t-il un traître ? Et laquelle de leurs visions triomphera ?
                </p>
                <div className="story-tagline">
                  L'histoire tragique d'une amitié entre deux leaders unis par une loyauté indéfectible.
                </div>
              </div>
            </div>
            
            <div className="credits-section">
              <h2 className="section-title">Caractéristiques techniques</h2>
              <div className="specs-grid">
                <div className="specs-item">
                  <div className="specs-icon">📙</div>
                  <div className="specs-details">
                    <span className="specs-label">Format</span>
                    <span className="specs-value">Tale One-Shot</span>
                  </div>
                </div>
                
                <div className="specs-item">
                  <div className="specs-icon">⏱️</div>
                  <div className="specs-details">
                    <span className="specs-label">Durée de lecture</span>
                    <span className="specs-value">2h30 environ</span>
                  </div>
                </div>
                
                <div className="specs-item">
                  <div className="specs-icon">📑</div>
                  <div className="specs-details">
                    <span className="specs-label">Chapitres</span>
                    <span className="specs-value">{chapterData.length}</span>
                  </div>
                </div>
                
                <div className="specs-item">
                  <div className="specs-icon">🎵</div>
                  <div className="specs-details">
                    <span className="specs-label">Thèmes musicaux</span>
                    <span className="specs-value">12 compositions</span>
                  </div>
                </div>
                
                <div className="specs-item">
                  <div className="specs-icon">🎭</div>
                  <div className="specs-details">
                    <span className="specs-label">Voix</span>
                    <span className="specs-value">8 comédiens</span>
                  </div>
                </div>
                
                <div className="specs-item">
                  <div className="specs-icon">🔊</div>
                  <div className="specs-details">
                    <span className="specs-label">Sound design</span>
                    <span className="specs-value">Création spécifique</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Guides de navigation horizontale - conservés pour la navigation mobile */}
      <div className="horizontal-navigation-guides">
        {activeTab === 'CHAPITRES' && (
          <>
            <div className="left-guide" onClick={() => setActiveTab('FAN STORE')}>
              <span className="guide-arrow">←</span>
              <span className="guide-text">Fan Store</span>
            </div>
            <div className="right-guide" onClick={() => setActiveTab('CREDITS')}>
              <span className="guide-text">Crédits</span>
              <span className="guide-arrow">→</span>
            </div>
          </>
        )}
        {activeTab === 'FAN STORE' && (
          <div className="right-guide" onClick={() => setActiveTab('CHAPITRES')}>
            <span className="guide-text">Chapitres</span>
            <span className="guide-arrow">→</span>
          </div>
        )}
        {activeTab === 'CREDITS' && (
          <div className="left-guide" onClick={() => setActiveTab('CHAPITRES')}>
            <span className="guide-arrow">←</span>
            <span className="guide-text">Chapitres</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterList;