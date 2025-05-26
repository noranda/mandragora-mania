import React, {type RefObject} from 'react';
import {AnimatePresence} from 'framer-motion';

import {type MandragoraPiece} from '../../types';
import MandragoraPieceComponent from './MandragoraPiece';

type BasePanelProps = {
  title: string;
  score: number;
  scoreColor: string;
  borderColor: string;
  pieces: MandragoraPiece[];
  panelRef: RefObject<HTMLDivElement | null>;
};

const BasePanel: React.FC<BasePanelProps> = ({title, score, scoreColor, borderColor, pieces, panelRef}) => (
  <div
    ref={panelRef}
    className={`absolute flex h-[29.7rem] w-40 -translate-y-1/2 flex-col rounded-xl border-2 bg-slate-700 shadow-lg`}
    style={{borderColor, zIndex: 2}}
  >
    <h3 className={`border-b p-4 text-center text-lg font-bold`} style={{borderColor: scoreColor, color: scoreColor}}>
      <span className="font-bold">{title}</span>
    </h3>
    <div className="flex flex-1 flex-wrap-reverse content-start items-center justify-start gap-x-3 overflow-y-auto px-2 pb-2 pt-2">
      <AnimatePresence>
        {pieces.map((piece, index, array) => (
          <div
            key={`${title}-${index}`}
            className={`aspect-2/3 relative w-[18%] ${index >= 4 ? '-mb-5' : ''}`}
            style={{zIndex: array.length - index}}
          >
            <MandragoraPieceComponent type={piece.type} color={piece.color} showLabel={true} />
          </div>
        ))}
      </AnimatePresence>
    </div>
    <div className={`border-t bg-slate-800/50 p-4 text-center`} style={{borderColor: scoreColor, color: scoreColor}}>
      <span className="font-bold">Score:</span> <span className="font-bold">{score}</span>
    </div>
  </div>
);

export default BasePanel;
