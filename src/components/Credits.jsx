import React from 'react';
import '../styles/Credits.css';

const Credits = () => {
  return (
    <div className="credits">
      <h2>Crédits et Présentation</h2>
      
      <div className="credits-section">
        <h3>L'équipe artistique</h3>
        <div className="team-members">
          <div className="team-member">
            <img 
              src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
              alt="Johnny Delaveau" 
            />
            <h4>Johnny Delaveau</h4>
            <p>Auteur</p>
          </div>
          
          <div className="team-member">
            <img 
              src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png" 
              alt="Quentin Querel" 
            />
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
  );
};

export default Credits;