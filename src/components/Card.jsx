import React from 'react';

const Card = ({ card, onClick }) => {
  const isFlipped = card.isFlipped || card.isMatched;

  return (
    <div 
      className={`card-container ${isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={() => onClick(card)}
    >
      <div className="card-inner">
        {/* Front of the physical card (hidden when flipped) */}
        <div className="card-face card-front">
          {/* Decorative pattern handled in CSS */}
        </div>
        
        {/* Back of the physical card (shows the icon when flipped) */}
        <div className="card-face card-back">
          <span className="card-icon">{card.icon}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
