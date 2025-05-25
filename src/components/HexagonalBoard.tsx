import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';

import type {GameArea, MandragoraPiece} from '../types';
import MandragoraPieceComponent from './MandragoraPiece';

type HexagonalBoardProps = {
  areas: GameArea[];
  onAreaClick: (areaId: number) => void;
  isValidMove: (areaId: number) => boolean;
  recommendedMoves?: {
    areaId: number;
    rank: number; // 1 is best move, 2 is second best, etc.
  }[];
  movingPieces?: {
    piece: MandragoraPiece;
    fromArea: number;
    toArea: number;
    delay: number;
  }[];
  basePositions: {
    opponent: DOMRect | null;
    player: DOMRect | null;
  };
  boardRef: React.RefObject<HTMLDivElement>;
  hexPositions: Record<number, DOMRect>;
  isPlayerTurn: boolean;
};

const HexagonalBoard: React.FC<HexagonalBoardProps> = ({
  areas,
  onAreaClick,
  isValidMove,
  recommendedMoves = [],
  movingPieces = [],
  basePositions,
  boardRef,
  hexPositions,
  isPlayerTurn,
}) => {
  // Calculate positions for a hexagonal layout
  const boardLayout = {
    topRow: [
      // Areas 8, 7, 6 (left to right)
      areas.find(a => a.id === 8),
      areas.find(a => a.id === 7),
      areas.find(a => a.id === 6),
    ].filter(Boolean) as GameArea[],
    middleRow: [
      // Areas 2, 4 (left to right)
      areas.find(a => a.id === 2),
      areas.find(a => a.id === 4),
    ].filter(Boolean) as GameArea[],
    bottomRow: [
      // Areas 1, 3, 5 (left to right)
      areas.find(a => a.id === 1),
      areas.find(a => a.id === 3),
      areas.find(a => a.id === 5),
    ].filter(Boolean) as GameArea[],
  };

  return (
    <div className="relative mx-auto w-full max-w-[1400px]" ref={boardRef}>
      <div className="relative w-full" style={{aspectRatio: '2/1'}}>
        {/* Hexagonal grid */}
        <div className="flex h-full flex-col items-center justify-center">
          {/* Top row (opponent) */}
          <div className="flex w-full justify-center gap-[14%]">
            {boardLayout.topRow.map(area => (
              <HexagonArea
                key={area.id}
                area={area}
                isValidMove={isValidMove(area.id)}
                onClick={() => onAreaClick(area.id)}
                color="green"
                recommendedMoves={recommendedMoves}
              />
            ))}
          </div>

          {/* Middle row (shared) */}
          <div className="-mb-[9%] -mt-[9%] flex w-full justify-center gap-[14%]">
            {boardLayout.middleRow.map(area => (
              <HexagonArea
                key={area.id}
                area={area}
                isValidMove={isValidMove(area.id)}
                onClick={() => onAreaClick(area.id)}
                color="brown"
                recommendedMoves={recommendedMoves}
              />
            ))}
          </div>

          {/* Bottom row (player) */}
          <div className="flex w-full justify-center gap-[14%]">
            {boardLayout.bottomRow.map(area => (
              <HexagonArea
                key={area.id}
                area={area}
                isValidMove={isValidMove(area.id)}
                onClick={() => onAreaClick(area.id)}
                color="blue"
                recommendedMoves={recommendedMoves}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated pieces layer */}
      {renderMovingPieces({
        movingPieces,
        basePositions,
        hexPositions,
        parentRef: boardRef,
      })}
    </div>
  );
};

export function renderMovingPieces({
  movingPieces,
  basePositions,
  hexPositions,
  parentRef,
}: {
  movingPieces: any[];
  basePositions: {opponent: DOMRect | null; player: DOMRect | null};
  hexPositions: Record<number, DOMRect>;
  parentRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <AnimatePresence>
      {movingPieces.map((movingPiece, index) => {
        const fromPos = hexPositions[movingPiece.fromArea];
        const toArea = movingPiece.toArea;
        let toPos: DOMRect | null = null;
        if (toArea === 0 && basePositions.player) {
          toPos = basePositions.player;
        } else if (toArea === 9 && basePositions.opponent) {
          toPos = basePositions.opponent;
        } else {
          toPos = hexPositions[toArea];
        }
        if (!fromPos || !toPos) return null;
        const parentRect = parentRef.current?.getBoundingClientRect();
        if (!parentRect) return null;
        const pieceWidth = fromPos.width * 0.25;
        const pieceHeight = pieceWidth * (3 / 2);
        const startX = fromPos.left - parentRect.left + fromPos.width * 0.5;
        const startY = fromPos.top - parentRect.top + fromPos.height * 0.7;
        let endX;
        if (toArea === 0 && basePositions.player) {
          endX = toPos.left - parentRect.left + toPos.width * 0.85;
        } else if (toArea === 9 && basePositions.opponent) {
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
            <MandragoraPieceComponent
              type={movingPiece.piece.type}
              color={movingPiece.piece.color}
            />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

type HexagonAreaProps = {
  area: GameArea;
  isValidMove: boolean;
  onClick: () => void;
  color: 'green' | 'brown' | 'blue';
  recommendedMoves: {areaId: number; rank: number}[];
};

const HexagonArea: React.FC<HexagonAreaProps> = ({
  area,
  isValidMove,
  onClick,
  color,
  recommendedMoves,
}) => {
  const colorClasses = {
    green: 'bg-gradient-to-br from-green-700 to-green-600 text-green-100',
    brown: 'bg-[#8b7355] text-amber-100',
    blue: 'bg-[#3b82f6] text-blue-100',
  };

  // Organize pieces into rows from bottom up
  const organizePieces = (pieces: MandragoraPiece[]) => {
    const rows: MandragoraPiece[][] = [[], [], [], [], []];
    let remainingPieces = [...pieces];

    // Fill rows from bottom up with their capacities
    const rowCapacities = [4, 5, 6, 5, 4];
    for (
      let i = 0;
      i < rowCapacities.length && remainingPieces.length > 0;
      i++
    ) {
      const capacity = rowCapacities[i];
      rows[i] = remainingPieces.slice(0, capacity);
      remainingPieces = remainingPieces.slice(capacity);
    }

    return rows.reverse(); // Reverse to render from top to bottom
  };

  const pieceRows = organizePieces(area.pieces);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex w-[23%] transform cursor-pointer items-center justify-center`}
      style={{aspectRatio: '1.2/1'}}
      data-hex-id={area.id}
    >
      {/* Main hexagon */}
      <div
        className={`absolute inset-0 z-10 ${colorClasses[color]} clip-hexagon shadow-lg shadow-yellow-400/30 ring-4 ring-yellow-400/50 transition-all duration-200 ${isValidMove ? 'group-hover:scale-105' : ''}`}
        style={{
          transformOrigin: '50% 50%',
        }}
      />

      <div
        className={`absolute left-1/2 top-[8%] -translate-x-1/2 text-base font-bold ${
          recommendedMoves.find(
            move => move.areaId === area.id && move.rank === 1,
          )
            ? 'bg-yellow-400 text-black'
            : 'bg-black/40 text-white backdrop-blur-sm'
        } z-50 rounded-full px-3 py-1`}
      >
        {recommendedMoves.find(
          move => move.areaId === area.id && move.rank === 1,
        ) && <span className="mr-1">★</span>}
        Area {area.id}
      </div>

      {/* Pieces container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        {pieceRows.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="flex items-center justify-start gap-2"
              style={{
                width: '100%',
                marginLeft: `${(() => {
                  // Calculate margins to create a perfect hexagon shape
                  // For a hexagon, we want the pieces to align with the 60° angles
                  switch (rowIndex) {
                    case 0: // Top row (4 pieces)
                      return 23;
                    case 1: // Second row (5 pieces)
                      return 16;
                    case 2: // Middle row (6 pieces)
                      return 10;
                    case 3: // Fourth row (5 pieces)
                      return 16;
                    case 4: // Bottom row (4 pieces)
                      return 23;
                    default:
                      return 0;
                  }
                })()}%`,
                marginRight: `${(() => {
                  // Add right margin to maintain symmetry
                  switch (rowIndex) {
                    case 0: // Top row (4 pieces)
                      return 23;
                    case 1: // Second row (5 pieces)
                      return 16;
                    case 2: // Middle row (6 pieces)
                      return 10;
                    case 3: // Fourth row (5 pieces)
                      return 16;
                    case 4: // Bottom row (4 pieces)
                      return 23;
                    default:
                      return 0;
                  }
                })()}%`,
                marginTop: rowIndex === 0 ? '0' : '-8%', // Create overlap between rows
                zIndex: rowIndex + 1, // Higher index (bottom rows) appear on top
                position: 'relative', // Enable z-index
              }}
            >
              {row.map((piece, pieceIndex) => (
                <div
                  key={`${rowIndex}-${pieceIndex}`}
                  className="aspect-2/3 w-[11%]"
                >
                  <MandragoraPieceComponent
                    type={piece.type}
                    color={piece.color}
                    showLabel={false}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HexagonalBoard;
