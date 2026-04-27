import { useState } from 'react';

export default function TicTacToeGame({ onExit }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const winInfo = calculateWinner(board);
  const winner = winInfo?.winner;
  const isDraw = !winner && board.every((square) => square !== null);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const renderSquare = (i) => {
    const isWinningSquare = winInfo?.line.includes(i);
    return (
      <button 
        className={`ttt-square ${board[i] ? 'filled' : ''} ${isWinningSquare ? 'winning-square' : ''} ${board[i] === 'X' ? 'sign-x' : 'sign-o'}`}
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  return (
    <div className="game-wrapper fade-in">
      <button className="btn-back" onClick={onExit}>⬅ Back to Hub</button>
      <div className="controls-container">
        <h2>Neon Tic-Tac-Toe</h2>
        <div className="ttt-status">
          {winner ? (
            <span className="winner-text">Winner: <span className={winner === 'X' ? 'sign-x' : 'sign-o'}>{winner}</span></span>
          ) : isDraw ? (
            <span className="draw-text">It's a Draw!</span>
          ) : (
            <span>Next Player: <span className={xIsNext ? 'sign-x' : 'sign-o'}>{xIsNext ? 'X' : 'O'}</span></span>
          )}
        </div>
      </div>

      <div className="ttt-board">
        <div className="ttt-row">
          {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
        </div>
        <div className="ttt-row">
          {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
        </div>
        <div className="ttt-row">
          {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
        </div>
      </div>

      {(winner || isDraw) && (
        <div className="modal-overlay">
          <div className="modal-content">
            {winner ? <h2>{winner} WINS! 🏆</h2> : <h2>It's a Draw! 🤝</h2>}
            <button className="btn-restart" onClick={resetGame}>Play Again</button>
            <br/><br/>
            <button className="btn-restart" style={{borderColor: '#ccc', color: '#ccc'}} onClick={onExit}>Return to Hub</button>
          </div>
        </div>
      )}
    </div>
  );
}
