import React from 'react';

import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {type GameAction, type GameState} from './useGameReducer';

type PatternOption = {id: string; name: string};

type GameControlsProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  patternOptions: PatternOption[];
};

const GameControls: React.FC<GameControlsProps> = ({state, dispatch, patternOptions}) => {
  // Derived disables and values
  const undoDisabled = state.moveHistory.length === 0;
  const redoDisabled = state.redoStack.length === 0;
  const patternDisabled = state.gameStarted;
  const playerGoesFirstDisabled = state.gameStarted;
  const startResetDisabled = !state.gameStarted && (state.playerGoesFirst === null || !state.selectedPattern);
  const selectedPattern = state.selectedPattern;
  const playerGoesFirst = state.playerGoesFirst;
  const gameStarted = state.gameStarted;

  // Local function for start/reset logic
  const handleStartReset = () => {
    if (state.gameStarted) {
      dispatch({type: 'RESET_GAME'});
    } else {
      if (state.playerGoesFirst === null || !state.selectedPattern) return;
      dispatch({
        type: 'INIT_GAME',
        patternId: state.selectedPattern,
        playerGoesFirst: state.playerGoesFirst,
      });
    }
  };

  return (
    <div className="relative mb-6 flex h-11 flex-col items-center md:flex-row">
      {/* Undo/Redo Buttons */}
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 gap-2" style={{zIndex: 10}}>
        <button
          className="flex h-10 items-center rounded-full bg-slate-700 px-4 py-2 text-base font-semibold text-white shadow hover:bg-slate-800 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => dispatch({type: 'UNDO'})}
          disabled={undoDisabled}
        >
          Undo
        </button>
        <button
          className="flex h-10 items-center rounded-full bg-slate-700 px-4 py-2 text-base font-semibold text-white shadow hover:bg-slate-800 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => dispatch({type: 'REDO'})}
          disabled={redoDisabled}
        >
          Redo
        </button>
      </div>
      <div className="absolute right-0 flex items-center gap-4">
        <Select
          value={selectedPattern}
          onValueChange={patternId => dispatch({type: 'SET_PATTERN', patternId})}
          disabled={patternDisabled}
        >
          <SelectTrigger className="w-40 border-slate-600 bg-slate-700 text-white">
            <SelectValue placeholder="Which pattern?" />
          </SelectTrigger>
          <SelectContent>
            {[...patternOptions]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(pattern => (
                <SelectItem key={pattern.id} value={pattern.id}>
                  {pattern.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {!gameStarted && (
          <Select
            value={playerGoesFirst === null ? '' : playerGoesFirst ? 'player' : 'opponent'}
            onValueChange={value => dispatch({type: 'SET_PLAYER_GOES_FIRST', value: value === 'player'})}
            disabled={playerGoesFirstDisabled}
          >
            <SelectTrigger className="w-48 border-slate-600 bg-slate-700 text-white">
              <SelectValue placeholder="Who goes first?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="player">You go first</SelectItem>
              <SelectItem value="opponent">Opponent goes first</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          onClick={handleStartReset}
          disabled={startResetDisabled}
          size="lg"
          className="w-40 bg-gradient-to-r from-purple-400 to-pink-400 text-base font-semibold text-white shadow-lg hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/20"
        >
          {gameStarted ? 'Reset Game' : 'Start Game'}
        </Button>
      </div>
      <div className="flex h-11 flex-1 justify-center"></div>
    </div>
  );
};

export default GameControls;
