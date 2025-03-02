import React from 'react';
import '../styles/FanStore.css';

const FanStore = () => {
  return (
    <div className="fanstore">
      <h2>Fan Store Osrase</h2>
      <p className="store-description">
        Découvrez nos produits exclusifs liés à l'univers d'Osrase
      </p>
      
      <div className="store-items">
        <div className="store-item">
          <img 
            src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
            alt="Livre collector" 
          />
          <h3>Livre Collector</h3>
          <p>Édition limitée avec illustrations exclusives et signature de l'auteur</p>
          <div className="item-price">29,99€</div>
          <button 
            className="store-button" 
            onClick={() => window.open('https://soundtales.com/store/livre-collector', '_blank')}
          >
            Voir le produit
          </button>
        </div>
        
        <div className="store-item">
          <img 
            src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
            alt="Bande originale" 
          />
          <h3>Bande Originale</h3>
          <p>L'intégrale des thèmes musicaux du Tale en CD ou vinyle</p>
          <div className="item-price">14,99€</div>
          <button 
            className="store-button" 
            onClick={() => window.open('https://soundtales.com/store/bande-originale', '_blank')}
          >
            Voir le produit
          </button>
        </div>
        
        <div className="store-item">
          <img 
            src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
            alt="Pack Collector" 
          />
          <h3>Pack Collector Complet</h3>
          <p>Le livre, la bande originale et un pendentif Osrase authentique</p>
          <div className="item-price">49,99€</div>
          <button 
            className="store-button" 
            onClick={() => window.open('https://soundtales.com/store/pack-collector', '_blank')}
          >
            Voir le produit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FanStore;