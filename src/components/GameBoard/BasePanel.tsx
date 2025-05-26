import {AnimatePresence} from 'framer-motion';

import {cn} from '@/lib/utils';
import {type MandragoraPiece, type MovePiece} from '../../types';
import MandragoraPieceComponent from './MandragoraPiece';

type BasePanelProps = {
  panelRef?: React.RefObject<HTMLDivElement | null>;
  pieces: MandragoraPiece[];
  score: number;
  title: string;
  movingPieces?: MovePiece[];
};

const BasePanel: React.FC<BasePanelProps> = ({
  title,
  score,
  pieces,
  panelRef,
  movingPieces = [],
}) => {
  const borderColor = title === 'Opponent' ? 'border-green-500' : 'border-blue-400';
  const textColor = title === 'Opponent' ? 'text-green-500' : 'text-blue-400';

  // Filter out animating pieces
  const animatingPieces = movingPieces.map(mp => mp.piece);
  const visiblePieces = pieces.filter(piece => !animatingPieces.some(ap => ap === piece));

  return (
    <div
      className={cn(
        'flex h-[30rem] w-40 flex-col rounded-xl border-2 bg-slate-700 shadow-lg',
        borderColor,
      )}
      ref={panelRef}
    >
      <div
        className={cn('border-b-2 bg-slate-800/50 p-4 text-center text-lg', borderColor, textColor)}
      >
        {title}
      </div>

      <div className="flex flex-1 flex-wrap-reverse content-start items-center justify-start gap-x-3 overflow-y-auto px-2 pb-2 pt-2">
        <AnimatePresence>
          {visiblePieces.map((piece, index, array) => (
            <div
              key={`${title}-${index}`}
              className={`aspect-2/3 relative w-[18%] ${index >= 4 ? '-mb-5' : ''}`}
              style={{zIndex: array.length - index}}
            >
              <MandragoraPieceComponent color={piece.color} showLabel type={piece.type} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className={cn('border-t-2 bg-slate-800/50 p-4 text-center', borderColor, textColor)}>
        Score: {score}
      </div>
    </div>
  );
};

export default BasePanel;
