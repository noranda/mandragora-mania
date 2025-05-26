import React from 'react';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import {type GameState} from './useGameReducer';

// Match the type from GameBoard
export type MoveRecord = {
  player: 'player' | 'opponent';
  fromArea: number;
  toArea: number[];
  piecesMoved: MandragoraPiece[];
  timestamp: number;
  extraTurn?: boolean;
};

type GameStatsModalProps = {
  state: GameState;
  statsOpen: boolean;
  setStatsOpen: (open: boolean) => void;
};

const GameStatsModal: React.FC<GameStatsModalProps> = ({state, statsOpen, setStatsOpen}) => {
  // Calculate scores
  const playerScoreValue = state.playerScore.reduce((acc, p) => acc + (p.value?.firstPlayer ?? 1), 0);
  const opponentScoreValue = state.opponentScore.reduce((acc, p) => acc + (p.value?.secondPlayer ?? 1), 0);
  const moveHistory = state.moveHistory;

  return (
    <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center text-3xl font-bold text-pink-400">Game Stats</DialogTitle>
        </DialogHeader>
        <div className="prose prose-invert max-w-none text-center text-white">
          <p className="mb-2 text-xl">Final Score</p>
          <div className="flex items-center justify-center gap-8 text-2xl font-bold">
            <span className="text-green-400">Opponent: {opponentScoreValue}</span>
            <span className="text-slate-400">-</span>
            <span className="text-blue-400">You: {playerScoreValue}</span>
          </div>
          <hr className="my-6 border-slate-700" />
          <h3 className="mb-2 text-lg font-bold text-pink-300">Move History</h3>
          <ol className="text-left text-base">
            {moveHistory.map((move, idx) => (
              <li key={move.timestamp + '-' + idx} className="mb-2">
                <span className={move.player === 'player' ? 'text-blue-400' : 'text-green-400'}>
                  {move.player === 'player' ? 'You' : 'Opponent'}
                </span>
                {': '}from <b>{move.fromArea}</b> →
                {move.toArea.map((to, i) => {
                  let label = `${to}`;
                  let pts = 0;
                  if (to === 0) {
                    // Your Base: use the i-th piece that landed there
                    const piece = move.piecesMoved[i];
                    if (piece) {
                      pts =
                        move.player === 'player' ? (piece.value?.firstPlayer ?? 1) : (piece.value?.secondPlayer ?? 1);
                    }
                    label = `Your Base (+${pts} pt${pts !== 1 ? 's' : ''})`;
                  } else if (to === 9) {
                    // Opponent's Base: use the i-th piece that landed there
                    const piece = move.piecesMoved[i];
                    if (piece) {
                      pts =
                        move.player === 'player' ? (piece.value?.secondPlayer ?? 1) : (piece.value?.firstPlayer ?? 1);
                    }
                    label = `Opponent's Base (+${pts} pt${pts !== 1 ? 's' : ''})`;
                  }
                  return (
                    <span key={i}>
                      {' '}
                      {label}
                      {i < move.toArea.length - 1 ? ',' : ''}
                    </span>
                  );
                })}
                <span className="ml-2 text-xs text-slate-400">{new Date(move.timestamp).toLocaleTimeString()}</span>
                {move.extraTurn && <span className="ml-2 text-pink-400">(Extra Turn)</span>}
              </li>
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameStatsModal;
