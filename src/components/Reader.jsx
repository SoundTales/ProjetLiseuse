import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import { chapterData } from '../data/chapterData';
import '../styles/Reader.css';

const Reader = ({ 
  textSize, 
  nightMode, 
  onDialogueClick, 
  onBookmark,
  bookmarks,
  updateProgress 
}) => {
  const { chapterId } = useParams(); // Récupérer l'ID du chapitre depuis l'URL
  const [chapter, setChapter] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  
  // Load chapter data when chapterId changes
  useEffect(() => {
    const numericChapterId = parseInt(chapterId);
    const foundChapter = chapterData.find(c => c.id === numericChapterId);
    
    if (foundChapter) {
      setChapter(foundChapter);
    } else {
      // Si le chapitre n'existe pas, rediriger vers le chapitre 1
      console.warn(`Chapitre ${chapterId} non trouvé, redirection vers le chapitre 1`);
      navigate('/read/1');
    }
  }, [chapterId, navigate]);

  // Track reading progress
  useEffect(() => {
    if (!contentRef.current) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const position = scrollTop / (scrollHeight - clientHeight);
      setScrollPosition(position);
      
      // Update reading progress
      if (typeof updateProgress === 'function') {
        updateProgress(position);
      }
    };
    
    const contentElement = contentRef.current;
    contentElement.addEventListener('scroll', handleScroll);
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [updateProgress]);

  if (!chapter) {
    return <div className="loading">Chargement du chapitre...</div>;
  }

  // Process chapter content to identify dialogue segments
  const processContent = (content) => {
    if (!content) return [];
    
    // Split content by dialogue markers
    const segments = [];
    let currentText = '';
    
    const lines = content.split('\n');
    
    lines.forEach(line => {
      // Check if line is a dialogue
      const dialogueMatch = line.match(/^([A-Za-z]+):\s*(.+)$/);
      
      if (dialogueMatch) {
        // If there was text before, add it as a regular segment
        if (currentText.trim()) {
          segments.push({ type: 'text', content: currentText });
          currentText = '';
        }
        
        // Add the dialogue segment with a specific ID format
        const speaker = dialogueMatch[1];
        segments.push({
          type: 'dialogue',
          speaker: speaker,
          content: dialogueMatch[2],
          id: `${speaker}_${segments.length}` // Format utilisé par audioData.js
        });
      } else {
        // Regular text, add to current text buffer
        currentText += line + '\n';
      }
    });
    
    // Add any remaining text
    if (currentText.trim()) {
      segments.push({ type: 'text', content: currentText });
    }
    
    return segments;
  };

  const segments = processContent(chapter.content);

  // Check if a position has a bookmark
  const hasBookmark = (position) => {
    return bookmarks.some(bookmark => 
      bookmark.chapterId === parseInt(chapterId) && 
      Math.abs(bookmark.position - position) < 0.01
    );
  };

  // Handler for adding a bookmark at current position
  const handleAddBookmark = () => {
    onBookmark(parseInt(chapterId), scrollPosition);
  };

  // Handler for dialogue clicks
  const handleDialogueClick = (segment) => {
    console.log("Dialogue clicked:", segment.id);
    console.log("Speaker:", segment.speaker);
    console.log("Content:", segment.content);
    
    if (onDialogueClick) {
      onDialogueClick(segment.id);
    }
  };

  return (
    <div 
      className={`reader-container ${textSize} ${nightMode ? 'night' : 'day'}`}
      ref={contentRef}
    >
      <div className="chapter-header">
        <h1>{chapter.title}</h1>
        <p className="chapter-number">Chapitre {chapterId}</p>
      </div>
      
      <div className="chapter-content">
        {segments.map((segment, index) => {
          if (segment.type === 'text') {
            return (
              <div 
                key={index} 
                className="text-segment"
                dangerouslySetInnerHTML={{ __html: segment.content.replace(/\n/g, '<br/>') }}
              />
            );
          } else if (segment.type === 'dialogue') {
            return (
              <div 
                key={index} 
                className="dialogue-segment"
                onClick={() => handleDialogueClick(segment)}
              >
                <div className="dialogue-marker"></div>
                <div className="dialogue-content">
                  <span className="speaker">{segment.speaker}: </span>
                  {segment.content}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      
      {/* Bouton de marque-page avec icône */}
      <div className="bookmark-indicator">
        <button 
          className={`bookmark-button ${hasBookmark(scrollPosition) ? 'active' : ''}`} 
          onClick={handleAddBookmark}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={hasBookmark(scrollPosition) ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="bookmark-icon"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="bookmark-text">
            {hasBookmark(scrollPosition) ? 'Retirer le marque-page' : 'Ajouter un marque-page'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Reader;