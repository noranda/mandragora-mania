import {InfoCircledIcon} from '@radix-ui/react-icons';

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

const GameInfo: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="mt-2 rounded-full p-2 transition-colors hover:bg-white/10">
            <InfoCircledIcon className="h-8 w-8 text-purple-400/80 transition-colors hover:text-purple-400" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="max-w-[500px] rounded-xl border border-purple-500/20 bg-slate-800/95 p-6 text-white shadow-xl backdrop-blur-sm"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-400">Mandragora Mania Rules</h3>

            <div>
              <h4 className="mb-1 font-semibold text-pink-400">Overview</h4>
              <p>
                Battle for jingly by moving your mandragora pieces to the goal. Your goal is the
                blue one on the right, while your opponent&apos;s is the green one on the left.
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-pink-400">Setup</h4>
              <p>
                Three mandragoras are placed in each of the eight game areas. Choose from five
                starting patterns (A through E) or use the default random setting.
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-pink-400">Areas & Movement</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>The three blue areas in front are yours</li>
                <li>The three green areas at the back are your opponent&apos;s</li>
                <li>The two brown areas are neutral</li>
                <li>Choose one of your areas or a neutral area to move from</li>
                <li>Pieces move from back to front (last in, first out)</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-pink-400">Scoring (Jingly)</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>Adenium & Citrillus: 3 jingly (first player) / 4 jingly (second player)</li>
                <li>Korrigan & Pachypodium: 2 jingly (first player) / 3 jingly (second player)</li>
                <li>Standard Mandragoras: 1 jingly (both players)</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-pink-400">Special Rules</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>If your last moving piece reaches the goal, you get an extra turn</li>
                <li>If your piece reaches the opponent&apos;s goal, it returns to your area</li>
                <li>The game ends when a player has no valid moves</li>
                <li>The player with the most jingly wins</li>
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GameInfo;
