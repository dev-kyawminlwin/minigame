import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [
  { x: 7, y: 7 },
  { x: 7, y: 8 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP initially
const FAST_SPEED = 180;

export default function SnakeGame({ onExit }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Generate random food not on snake
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent reversing into itself
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Main game loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check Wall Collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          // We don't pop the tail, so it grows
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, FAST_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  const handleGameOver = () => {
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="game-wrapper fade-in">
      <button className="btn-back" onClick={onExit}>⬅ Back to Hub</button>
      <div className="controls-container">
        <h2>Neon Snake</h2>
        <div className="stats-board">
          <div className="stats current-score">
            <div className="stat-item"><span className="stat-label">Score:</span><span className="stat-value">{score}</span></div>
          </div>
          <div className="stats best-score">
            <div className="stat-item"><span className="stat-label">High Score:</span><span className="stat-value">{highScore}</span></div>
          </div>
        </div>
      </div>

      <div className="snake-board-container">
        <div 
          className="snake-grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`snake-cell ${isSnake ? 'snake-body' : ''} ${isHead ? 'snake-head' : ''} ${isFood ? 'snake-food' : ''}`} 
              />
            );
          })}
        </div>
        
        {/* Mobile controls overlay underneath board ideally, but keeping it simple below */}
      </div>
      
      <div className="mobile-dpad">
          <button className="dpad-btn up" onClick={() => direction.y !== 1 && setDirection({x:0, y:-1})}>▲</button>
          <div className="dpad-middle">
            <button className="dpad-btn left" onClick={() => direction.x !== 1 && setDirection({x:-1, y:0})}>◀</button>
            <button className="dpad-btn right" onClick={() => direction.x !== -1 && setDirection({x:1, y:0})}>▶</button>
          </div>
          <button className="dpad-btn down" onClick={() => direction.y !== -1 && setDirection({x:0, y:1})}>▼</button>
      </div>

      {isGameOver && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>GAME OVER 💥</h2>
            {score > highScore && score > 0 && <div className="new-best">🎉 NEW HIGH SCORE! 🎉</div>}
            <div className="modal-stats">
              <p>Final Score: <strong>{score}</strong></p>
            </div>
            <button className="btn-restart" onClick={resetGame}>Play Again</button>
            <br/><br/>
            <button className="btn-restart" style={{borderColor: '#ccc', color: '#ccc'}} onClick={onExit}>Return to Hub</button>
          </div>
        </div>
      )}
    </div>
  );
}
