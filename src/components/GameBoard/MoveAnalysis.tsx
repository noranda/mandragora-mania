import {type GameState} from './useGameReducer';

type MoveAnalysisProps = {
  state: GameState;
};

const MoveAnalysis: React.FC<MoveAnalysisProps> = ({state}) => {
  const sortedMoveAnalysis = [...state.moveAnalysis].sort((a, b) => b.totalValue - a.totalValue);
  if (!sortedMoveAnalysis.length) return null;
  return (
    <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-2 text-lg font-semibold text-white">Move Analysis</h3>
      <div className="space-y-2">
        {sortedMoveAnalysis.map((analysis, index) => {
          const isRecommended = index === 0;

          return (
            <div
              key={analysis.areaId}
              className="flex items-center gap-3 rounded border border-slate-600 bg-slate-700 p-3"
            >
              <span
                className={
                  isRecommended
                    ? 'rounded-full bg-yellow-400 px-3 py-1 text-base font-bold text-black shadow'
                    : 'rounded-full bg-black/50 px-3 py-1 text-base font-bold text-white'
                }
                style={{
                  minWidth: 70,
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                Area {analysis.areaId}
              </span>
              <p className="mb-0 flex-1 text-white">
                <span className="font-semibold">Total Value: {analysis.totalValue.toFixed(1)}</span>
                <span className="mx-2">|</span>
                {analysis.explanation
                  .replace(/^Area \d+:\s*/, '')
                  .replace(
                    'WARNING: grants opponent an extra move',
                    'WARNING: grants opponent an extra move opportunity',
                  )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoveAnalysis;
