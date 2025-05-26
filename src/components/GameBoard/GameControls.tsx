import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {type GameAction, type GameState} from './useGameReducer';

type PatternOption = {id: string; name: string};

type GameControlsProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  patternOptions: PatternOption[];
};

const OPPONENTS = [
  'Green Thumb Moogle',
  'Monsieur Kupont',
  'Susuroon',
  'Little Sheep',
  'Yeestog',
  'Atelloune',
  'Kuyin Hathdenna',
  'Kupofried',
  'Chacharoon',
  'Sakura',
];

const GameControls: React.FC<GameControlsProps> = ({state, dispatch, patternOptions}) => {
  const startResetDisabled =
    !state.gameStarted && (state.playerGoesFirst === null || !state.selectedPattern);

  // Start/reset logic
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
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-2" style={{zIndex: 10}}>
        <Button
          disabled={state.moveHistory.length === 0}
          onClick={() => dispatch({type: 'UNDO'})}
          variant="chip"
        >
          Undo
        </Button>

        <Button
          disabled={state.redoStack.length === 0}
          onClick={() => dispatch({type: 'REDO'})}
          variant="chip"
        >
          Redo
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select
          disabled={state.gameStarted}
          onValueChange={patternId => dispatch({type: 'SET_PATTERN', patternId})}
          value={state.selectedPattern}
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

        <Select
          disabled={state.gameStarted}
          onValueChange={name => dispatch({type: 'SET_OPPONENT_NAME', name})}
          value={state.opponentName}
        >
          <SelectTrigger className="w-56 border-slate-600 bg-slate-700 text-white">
            <SelectValue placeholder="Which opponent?" />
          </SelectTrigger>

          <SelectContent>
            {OPPONENTS.map(name => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!state.gameStarted && (
          <Select
            disabled={state.gameStarted}
            onValueChange={value =>
              dispatch({type: 'SET_PLAYER_GOES_FIRST', value: value === 'player'})
            }
            value={
              state.playerGoesFirst === null ? '' : state.playerGoesFirst ? 'player' : 'opponent'
            }
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

        <Button disabled={startResetDisabled} onClick={handleStartReset}>
          {state.gameStarted ? 'Reset Game' : 'Start Game'}
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
