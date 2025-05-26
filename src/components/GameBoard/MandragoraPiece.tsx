import {motion} from 'framer-motion';

import adeniumPink from '@/assets/images/adenium-pink.png';
import citrillusGreen from '@/assets/images/citrillus-green.png';
import korriganBlack from '@/assets/images/korrigan-black.png';
import mandragoraWhite from '@/assets/images/mandragora-white.png';
import pachypodiumBlack from '@/assets/images/pachypodium-black.png';
import type {PieceColor, PieceType} from '../../types';

type MandragoraPieceProps = {
  type: PieceType;
  color: PieceColor;
};

function getImagePath(type: PieceType) {
  switch (type) {
    case 'Adenium':
      return adeniumPink;
    case 'Citrillus':
      return citrillusGreen;
    case 'Korrigan':
      return korriganBlack;
    case 'Mandragora':
      return mandragoraWhite;
    case 'Pachypodium':
      return pachypodiumBlack;
  }
}

const MandragoraPiece: React.FC<MandragoraPieceProps & {showLabel?: boolean}> = ({
  type,
  color,
  showLabel,
}) => {
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
        src={getImagePath(type)}
        alt={`${color} ${type}`}
        className={`h-full w-full transform object-contain transition-all duration-200 ${shouldFlip ? 'scale-x-[-1]' : ''} drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] filter`}
      />
    </motion.div>
  );
};

export default MandragoraPiece;
