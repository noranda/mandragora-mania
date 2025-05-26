import {AnimatePresence, motion} from 'framer-motion';

import type {MovePiece} from '@/types';
import MandragoraPieceComponent from './MandragoraPiece';

/**
 * MovingPiecesLayer animates pieces as they move between areas on the board.
 * If a piece is moving to a hex, it animates to the hex position.
 * If a piece is moving to a base (toArea 0 or 9), it animates to the far right (player base) or far left (opponent base) of the board.
 * This component no longer relies on base DOMRects or refs.
 *
 * Props:
 *   - hexPositions: DOMRects for each hex area (for animation start/end)
 *   - movingPieces: Array of piece movement objects (with from/to, delay, etc)
 *   - parentRef: Ref to the board container (for absolute positioning)
 *
 * Usage:
 *   <MovingPiecesLayer
 *     hexPositions={uiState.hexPositions}
 *     movingPieces={state.movingPieces}
 *     parentRef={uiState.boardRef}
 *   />
 */
export type MovingPiecesLayerProps = {
  hexPositions: Record<number, DOMRect>;
  movingPieces: MovePiece[];
  parentRef: React.RefObject<HTMLDivElement | null>;
};

const MovingPiecesLayer: React.FC<MovingPiecesLayerProps> = ({
  hexPositions,
  movingPieces,
  parentRef,
}) => {
  return (
    <AnimatePresence>
      {movingPieces.map((movingPiece, index) => {
        // Get the DOMRect for the starting area
        const fromPos = hexPositions[movingPiece.fromArea];
        const toArea = movingPiece.toArea;

        // Determine the DOMRect for the destination (hex or base)
        let toPos: DOMRect | null = null;
        if (toArea === 0 || toArea === 9) {
          // Animate to the far right (player base) or far left (opponent base) of the board, with extra offset
          const parentRect = parentRef.current?.getBoundingClientRect();
          if (!parentRect) return null;
          // Fake a DOMRect for the edge, offset by 100px
          const offset = 100;
          toPos = {
            left: toArea === 0 ? parentRect.right + offset : parentRect.left - offset,
            right: toArea === 0 ? parentRect.right + offset : parentRect.left - offset,
            top: parentRect.top + parentRect.height / 2,
            bottom: parentRect.top + parentRect.height / 2,
            width: 0,
            height: 0,
            x: toArea === 0 ? parentRect.right + offset : parentRect.left - offset,
            y: parentRect.top + parentRect.height / 2,
            toJSON: () => ({}),
          } as DOMRect;
        } else {
          toPos = hexPositions[toArea];
        }

        // If either position is missing, skip rendering this piece
        if (!fromPos || !toPos) {
          return null;
        }

        // Get the bounding rect of the board container for absolute positioning
        const parentRect = parentRef.current?.getBoundingClientRect();
        if (!parentRect) return null;

        // Calculate piece size and start/end coordinates
        const pieceWidth = fromPos.width * 0.25;
        const pieceHeight = pieceWidth * (3 / 2);
        const startX = fromPos.left - parentRect.left + fromPos.width * 0.5;
        const startY = fromPos.top - parentRect.top + fromPos.height * 0.7;

        // Calculate end coordinates based on destination
        let endX;
        if (toArea === 0) {
          endX = toPos.left - parentRect.left + toPos.width * 0.85;
        } else if (toArea === 9) {
          endX = toPos.left - parentRect.left + toPos.width * 0.15;
        } else {
          endX = toPos.left - parentRect.left + toPos.width * 0.5;
        }
        let endY;
        if (toArea === 0 || toArea === 9) {
          endY = toPos.top - parentRect.top + toPos.height * 0.5;
        } else {
          endY = toPos.top - parentRect.top + toPos.height * 0.7;
        }

        return (
          <motion.div
            key={`moving-${index}`}
            initial={{
              x: startX - pieceWidth / 2,
              y: startY - pieceHeight / 2,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: endX - pieceWidth / 2,
              y: endY - pieceHeight / 2,
              scale: toArea === 0 || toArea === 9 ? [1, 1.2, 0.9] : [1, 1.2, 1],
              opacity: toArea === 0 || toArea === 9 ? [1, 1, 0] : 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: {duration: 0.2},
            }}
            transition={{
              duration: toArea === 0 || toArea === 9 ? 0.6 : 0.4,
              delay: movingPiece.delay,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute left-0 top-0 z-[9999]"
            style={{
              width: pieceWidth,
              filter:
                toArea === 0 || toArea === 9
                  ? 'brightness(1.5) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
                  : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
            }}
          >
            {/* Render the animated Mandragora piece */}
            <MandragoraPieceComponent
              type={movingPiece.piece.type}
              color={movingPiece.piece.color}
            />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default MovingPiecesLayer;
