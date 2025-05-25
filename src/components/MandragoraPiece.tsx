import React from 'react';
import {motion} from 'framer-motion';

type PieceType =
  | 'Adenium'
  | 'Citrillus'
  | 'Korrigan'
  | 'Pachypodium'
  | 'Mandragora';
type PieceColor = 'Pink' | 'Green' | 'Black' | 'White';

type MandragoraPieceProps = {
  type: PieceType;
  color: PieceColor;
};

const MandragoraPiece: React.FC<
  MandragoraPieceProps & {showLabel?: boolean}
> = ({type, color, showLabel}) => {
  const getImagePath = () => {
    if (type === 'Mandragora') {
      return '/images/mandragora-white.png';
    }
    return `/images/${type.toLowerCase()}-${color.toLowerCase()}.png`;
  };

  const shouldFlip = type === 'Korrigan' || type === 'Pachypodium';

  return (
    <motion.div
      initial={{scale: 0}}
      animate={{scale: 1}}
      exit={{scale: 0}}
      whileHover={{scale: 1.1, rotate: 5}}
      transition={{type: 'spring', stiffness: 400, damping: 25}}
      className="group relative"
    >
      {showLabel && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-full border border-slate-700 bg-slate-800/90 px-1.5 py-0.5 text-[8px] font-medium text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
          {type}
        </div>
      )}
      <img
        src={getImagePath()}
        alt={`${color} ${type}`}
        className={`h-full w-full transform object-contain transition-all duration-200 ${shouldFlip ? 'scale-x-[-1]' : ''} drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] filter`}
      />
    </motion.div>
  );
};

export default MandragoraPiece;
