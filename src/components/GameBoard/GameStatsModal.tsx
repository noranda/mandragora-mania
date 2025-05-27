import React, {useState} from 'react';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {OPPONENTS} from '@/constants/opponents';
import {type MandragoraPiece} from '@/types';
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
  analyzerScore?: number;
};

type GameStatsModalProps = {
  state: GameState;
  statsOpen: boolean;
  setStatsOpen: (open: boolean) => void;
};

const GameStatsModal: React.FC<GameStatsModalProps> = ({state, statsOpen, setStatsOpen}) => {
  // Calculate scores
  const playerScoreValue = state.playerScore.reduce(
    (acc, p) => acc + (p.value?.firstPlayer ?? 1),
    0,
  );
  const opponentScoreValue = state.opponentScore.reduce(
    (acc, p) => acc + (p.value?.secondPlayer ?? 1),
    0,
  );
  const moveHistory = state.moveHistory;

  // --- Export logic ---
  const [copied, setCopied] = useState(false);
  function getOpponentRank(name: string): string {
    const idx = OPPONENTS.findIndex(n => n === name);
    return idx === -1 ? '?' : `${idx + 1}/10`;
  }
  function getWinner() {
    if (playerScoreValue > opponentScoreValue) return 'Player';
    if (playerScoreValue < opponentScoreValue) return 'Opponent';
    return 'Draw';
  }
  function getOpeningPattern() {
    // Try to get pattern name from state.selectedPattern
    if (!state.selectedPattern) return '[Pattern not recorded]';
    // If pattern id is like 'pattern-a', extract 'A'
    const match = state.selectedPattern.match(/pattern-([a-z])/i);
    if (match) return match[1].toUpperCase();
    return state.selectedPattern;
  }
  function getOpponentName() {
    return state.opponentName || '[Unknown Opponent]';
  }
  function getWhoWentFirst() {
    if (state.playerGoesFirst === null) return '[Unknown]';
    return state.playerGoesFirst ? 'Player' : 'Opponent';
  }
  function formatMove(move: any, idx: number) {
    const who = move.player === 'player' ? 'Player' : 'Opponent';
    let moveStr = `${idx + 1}. ${who}: Area ${move.fromArea}`;
    if (typeof move.analyzerScore === 'number') {
      moveStr += ` (Analyzer Score: ${move.analyzerScore.toFixed(1)})`;
    }
    if (move.extraTurn) moveStr += ' (Extra Turn)';
    return moveStr;
  }
  function formatMoves() {
    return moveHistory.map(formatMove).join('  \n');
  }
  function formatExport() {
    const opponentName = getOpponentName();
    const now = new Date();
    const dateStr =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0');
    const timeStr = now.toLocaleTimeString([], {hour12: false}); // Local time, HH:MM:SS
    return `### Game Date: ${dateStr} ${timeStr}\n\n- **Opponent:** ${opponentName}\n- **Opponent Difficulty:** ${getOpponentRank(opponentName)}\n- **Who Went First:** ${getWhoWentFirst()}\n- **Opening Pattern:** ${getOpeningPattern()}\n- **Final Score:** Player ${playerScoreValue} - Opponent ${opponentScoreValue}\n- **Winner:** ${getWinner()}\n- **Move Sequence:**  \n${formatMoves()}\n- **Notes/Observations:**  \n  - [Add notes here]\n`;
  }
  async function handleExport() {
    await navigator.clipboard.writeText(formatExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="mb-4 text-center text-3xl font-bold text-pink-400">
            Game Stats
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-invert max-w-none text-center text-white">
          <div className="mb-2 flex items-center justify-center gap-8 text-2xl font-bold">
            <span className="text-green-400">Opponent: {opponentScoreValue}</span>
            <span className="text-slate-400">-</span>
            <span className="text-blue-400">You: {playerScoreValue}</span>
          </div>
          <hr className="my-4 border-slate-700" />
          <div className="mb-4 flex w-full flex-wrap items-center justify-between text-base font-medium">
            <div className="flex flex-col text-left">
              <div className="mb-1">
                Opponent:{' '}
                <span className="text-pink-300">{state.opponentName || '[Unknown Opponent]'}</span>
              </div>
              <div className="mb-1">
                Pattern: <span className="text-yellow-300">{getOpeningPattern()}</span>
              </div>
              <div>
                First Move: <span className="text-blue-300">{getWhoWentFirst()}</span>
              </div>
            </div>
            <button
              className="ml-auto flex items-center gap-1 rounded bg-yellow-400 px-2 py-1 text-sm font-bold text-black shadow hover:bg-yellow-300"
              onClick={handleExport}
              type="button"
              style={{minWidth: 0}}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
              Export
            </button>
          </div>
          {copied && <div className="mb-2 font-semibold text-green-300">Copied to clipboard!</div>}
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
                        move.player === 'player'
                          ? (piece.value?.firstPlayer ?? 1)
                          : (piece.value?.secondPlayer ?? 1);
                    }
                    label = `Your Base (+${pts} pt${pts !== 1 ? 's' : ''})`;
                  } else if (to === 9) {
                    // Opponent's Base: use the i-th piece that landed there
                    const piece = move.piecesMoved[i];
                    if (piece) {
                      pts =
                        move.player === 'player'
                          ? (piece.value?.secondPlayer ?? 1)
                          : (piece.value?.firstPlayer ?? 1);
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
                {typeof move.analyzerScore === 'number' && (
                  <span className="ml-2 text-xs font-semibold text-yellow-300">
                    (Analyzer Score: {move.analyzerScore.toFixed(1)})
                  </span>
                )}
                <span className="ml-2 text-xs text-slate-400">
                  {new Date(move.timestamp).toLocaleTimeString()}
                </span>
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
