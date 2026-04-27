import { useState, useEffect } from 'react';
import Card from './components/Card';
import './index.css';

const EMOJIS = ['🚀', '🛸', '🌍', '🌟', '✨', '☄️', '🌙', '🤖'];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize game
  const initializeGame = () => {
    // Create pairs and shuffle
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        icon: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setIsGameOver(false);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (!isGameOver && moves > 0) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver, moves]);

  // Check for game over
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameOver(true);
    }
  }, [cards]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleCardClick = (clickedCard) => {
    // Prevent clicking if locked, already flipped, or matched
    if (
      isLocked || 
      clickedCard.isFlipped || 
      clickedCard.isMatched ||
      flippedCards.some(card => card.id === clickedCard.id)
    ) {
      return;
    }

    const newCards = cards.map(c => 
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    
    setCards(newCards);
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // If 2 cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [card1, card2] = newFlippedCards;

      if (card1.icon === card2.icon) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.icon === card1.icon ? { ...c, isMatched: true, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match, flip them back
        setTimeout(() => {
          setCards(prev => prev.map(c => {
            if (c.id === card1.id || c.id === card2.id) {
              return { ...c, isFlipped: false };
            }
            return c;
          }));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <>
      <h1>Match Cards</h1>
      
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{formatTime(timeElapsed)}</span>
        </div>
      </div>
      
      <div className="grid">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            onClick={handleCardClick} 
          />
        ))}
      </div>

      {isGameOver && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Mission Accomplished! 🏆</h2>
            <div className="modal-stats">
              <p>You finished in <strong>{moves}</strong> moves</p>
              <p>Time: <strong>{formatTime(timeElapsed)}</strong></p>
            </div>
            <button className="btn-restart" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
