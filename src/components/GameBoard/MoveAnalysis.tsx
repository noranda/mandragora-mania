import {cn} from '@/lib/utils';
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
                className={cn(
                  'inline-block w-[100px] px-3 py-1 text-center text-base font-bold',
                  isRecommended
                    ? 'rounded-full bg-yellow-400 text-black shadow'
                    : 'rounded-full bg-black/50 text-white',
                )}
              >
                {isRecommended && <span className="mr-1">★</span>}
                Area {analysis.areaId}
              </span>
              <p className="mb-0 flex-1 text-white">
                <span className="font-semibold">Total Value: {analysis.totalValue.toFixed(1)}</span>
                <span className="mx-2">|</span>
                {(() => {
                  // Split explanation into main and warning parts
                  const match = analysis.explanation.match(/^(.*?)(\| (WARNING:.*))?$/);
                  if (!match) return analysis.explanation;
                  const main = match[1]?.replace(/^Area \d+: /, '');
                  const warning = match[3];
                  return (
                    <>
                      {main}
                      {warning && (
                        <div className="mt-1 text-orange-300">
                          <span role="img" aria-label="warning">
                            ⚠️
                          </span>{' '}
                          {warning.replace(/^\| /, '')}
                        </div>
                      )}
                    </>
                  );
                })()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoveAnalysis;
