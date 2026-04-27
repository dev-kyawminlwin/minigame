import { useState, useEffect } from 'react';
import Card from '../components/Card';

const EMOJIS = ['🚀', '🛸', '🌍', '🌟', '✨', '☄️', '🌙', '🤖', '👾', '👽', '🪐', '🌌', '🌠', '🔭', '👨‍🚀', '👩‍🚀', '🛰️', '☀️'];

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 8, columns: 4 },    // 16 cards
  medium: { pairs: 10, columns: 5 }, // 20 cards
  hard: { pairs: 18, columns: 6 }    // 36 cards
};

export default function MatchCardGame({ onExit }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  
  const [bestScores, setBestScores] = useState({
    easy: { moves: null, time: null },
    medium: { moves: null, time: null },
    hard: { moves: null, time: null }
  });

  useEffect(() => {
    const savedScores = localStorage.getItem('matchCardBestScores');
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, []);

  const initializeGame = (selectedDiff = difficulty) => {
    const { pairs } = DIFFICULTY_SETTINGS[selectedDiff];
    const gameEmojis = EMOJIS.slice(0, pairs);
    const deck = [...gameEmojis, ...gameEmojis]
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
    setIsNewBest(false);
  };

  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);

  useEffect(() => {
    let timer;
    if (!isGameOver && moves > 0 && cards.length > 0) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver, moves, cards.length]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameOver(true);
      let newBest = false;
      const currentBest = bestScores[difficulty];
      const newScores = { ...bestScores };
      
      if (!currentBest.moves || moves < currentBest.moves || (moves === currentBest.moves && timeElapsed < currentBest.time)) {
        newScores[difficulty] = { moves, time: timeElapsed };
        newBest = true;
      }

      if (newBest) {
        setIsNewBest(true);
        setBestScores(newScores);
        localStorage.setItem('matchCardBestScores', JSON.stringify(newScores));
      }
    }
  }, [cards, difficulty, moves, timeElapsed, bestScores]);

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleCardClick = (clickedCard) => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.some(card => card.id === clickedCard.id)) return;

    const newCards = cards.map(c => c.id === clickedCard.id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);
      const [card1, card2] = newFlippedCards;

      if (card1.icon === card2.icon) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.icon === card1.icon ? { ...c, isMatched: true, isFlipped: false } : c));
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => {
            if (c.id === card1.id || c.id === card2.id) return { ...c, isFlipped: false };
            return c;
          }));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-wrapper fade-in">
      <button className="btn-back" onClick={onExit}>⬅ Back to Hub</button>
      <div className="controls-container">
        <h2>Match Cards</h2>
        <div className="difficulty-selector">
          {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
            <button key={level} className={`difficulty-btn ${difficulty === level ? 'active' : ''}`} onClick={() => { if(difficulty !== level) setDifficulty(level); }}>
              {level}
            </button>
          ))}
        </div>
        <div className="stats-board">
          <div className="stats current-score">
            <div className="stat-item"><span className="stat-label">Moves:</span><span className="stat-value">{moves}</span></div>
            <div className="stat-item"><span className="stat-label">Time:</span><span className="stat-value">{formatTime(timeElapsed)}</span></div>
          </div>
          <div className="stats best-score">
            <div className="stat-item"><span className="stat-label">Best Moves:</span><span className="stat-value">{bestScores[difficulty].moves || '--'}</span></div>
            <div className="stat-item"><span className="stat-label">Best Time:</span><span className="stat-value">{formatTime(bestScores[difficulty].time)}</span></div>
          </div>
        </div>
      </div>
      
      <div className={`grid ${difficulty}`}>
        {cards.map(card => <Card key={card.id} card={card} onClick={handleCardClick} />)}
      </div>

      {isGameOver && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Mission Accomplished! 🏆</h2>
            {isNewBest && <div className="new-best">🎉 NEW PERSONAL BEST! 🎉</div>}
            <div className="modal-stats">
              <p>You finished in <strong>{moves}</strong> moves</p>
              <p>Time: <strong>{formatTime(timeElapsed)}</strong></p>
            </div>
            <button className="btn-restart" onClick={() => initializeGame()}>Play Again</button>
            <br/><br/>
            <button className="btn-restart" style={{borderColor: '#ccc', color: '#ccc'}} onClick={onExit}>Return to Hub</button>
          </div>
        </div>
      )}
    </div>
  );
}
