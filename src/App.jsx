import { useState } from 'react';
import MatchCardGame from './games/MatchCardGame';
import TicTacToeGame from './games/TicTacToeGame';
import './index.css';

function App() {
  const [activeGame, setActiveGame] = useState('hub');

  const navigateTo = (gameId) => {
    setActiveGame(gameId);
  };

  if (activeGame === 'match-card') {
    return <MatchCardGame onExit={() => navigateTo('hub')} />;
  }

  if (activeGame === 'tic-tac-toe') {
    return <TicTacToeGame onExit={() => navigateTo('hub')} />;
  }

  // Render Hub
  return (
    <div className="hub-container fade-in">
      <header className="hub-header">
        <h1>Neon Nexus</h1>
        <p className="hub-subtitle">Select a minigame to play</p>
      </header>

      <div className="games-menu">
        <div className="game-card" onClick={() => navigateTo('match-card')}>
          <div className="game-card-icon">🃏</div>
          <div className="game-card-info">
            <h3>Match Cards</h3>
            <p>Test your memory by finding all the space pairs!</p>
          </div>
        </div>

        <div className="game-card" onClick={() => navigateTo('tic-tac-toe')}>
          <div className="game-card-icon">❌⭕</div>
          <div className="game-card-info">
            <h3>Tic-Tac-Toe</h3>
            <p>The classic game of X's and O's with a neon twist.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
