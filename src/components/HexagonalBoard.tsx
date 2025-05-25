import React, {useEffect, useRef, useState} from 'react';
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
};

const HexagonalBoard: React.FC<HexagonalBoardProps> = ({
  areas,
  onAreaClick,
  isValidMove,
  recommendedMoves = [],
  movingPieces = [],
  basePositions,
}) => {
  const [hexPositions, setHexPositions] = useState<Record<number, DOMRect>>({});
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      const newPositions: Record<number, DOMRect> = {};
      const hexElements = boardRef.current.querySelectorAll('[data-hex-id]');
      hexElements.forEach(hex => {
        const id = parseInt(hex.getAttribute('data-hex-id') || '0');
        newPositions[id] = hex.getBoundingClientRect();
      });
      setHexPositions(newPositions);
    }
  }, [areas]);

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

  const getRecommendationStyles = (areaId: number) => {
    const recommendation = recommendedMoves.find(
      move => move.areaId === areaId,
    );
    if (!recommendation) return '';

    // Different glow effects based on rank
    switch (recommendation.rank) {
      case 1:
        return 'ring-4 ring-yellow-400/50 shadow-lg shadow-yellow-400/30';
      case 2:
        return 'ring-3 ring-yellow-400/30 shadow-md shadow-yellow-400/20';
      case 3:
        return 'ring-2 ring-yellow-400/20 shadow-sm shadow-yellow-400/10';
      default:
        return 'ring-1 ring-yellow-400/10';
    }
  };

  return (
    <div
      className="relative mx-auto w-full min-w-[900px] max-w-[1400px]"
      ref={boardRef}
    >
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
                recommendationStyles={getRecommendationStyles(area.id)}
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
                recommendationStyles={getRecommendationStyles(area.id)}
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
                recommendationStyles={getRecommendationStyles(area.id)}
                recommendedMoves={recommendedMoves}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated pieces layer */}
      <AnimatePresence>
        {movingPieces.map((movingPiece, index) => {
          const fromPos = hexPositions[movingPiece.fromArea];
          const toArea = movingPiece.toArea;

          // Get the target position based on whether it's going to a base or another hex
          let toPos: DOMRect | null = null;
          if (toArea === 0 && basePositions.player) {
            toPos = basePositions.player;
          } else if (toArea === 9 && basePositions.opponent) {
            toPos = basePositions.opponent;
          } else {
            toPos = hexPositions[toArea];
          }

          if (!fromPos || !toPos) return null;

          const boardRect = boardRef.current?.getBoundingClientRect();
          if (!boardRect) return null;

          // Calculate positions accounting for the piece's dimensions
          const pieceWidth = fromPos.width * 0.25;
          const pieceHeight = pieceWidth * (3 / 2); // Since aspect ratio is 2/3

          // Calculate start position - adjust to start from the pieces container area
          const startX = fromPos.left - boardRect.left + fromPos.width * 0.5;
          const startY = fromPos.top - boardRect.top + fromPos.height * 0.7; // Move down to pieces area

          // Calculate end position
          const endX = toPos.left - boardRect.left + toPos.width * 0.5;
          let endY;
          if (toArea === 0 || toArea === 9) {
            // For bases, aim for the content area (about 1/3 down from the top, after the header)
            endY = toPos.top - boardRect.top + toPos.height * 0.33;
          } else {
            // For hex areas, aim for the pieces area
            endY = toPos.top - boardRect.top + toPos.height * 0.7;
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
                scale:
                  toArea === 0 || toArea === 9
                    ? [1, 1.2, 0.9] // Smoother scale animation for bases
                    : [1, 1.2, 1], // Return to original size for hex areas
                opacity: toArea === 0 || toArea === 9 ? [1, 1, 0] : 1, // Fade out when entering base
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: {duration: 0.2},
              }}
              transition={{
                duration: toArea === 0 || toArea === 9 ? 0.6 : 0.4, // Slightly faster base animation
                delay: movingPiece.delay,
                ease: 'easeInOut',
              }}
              className="pointer-events-none absolute left-0 top-0 z-50"
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
    </div>
  );
};

type HexagonAreaProps = {
  area: GameArea;
  isValidMove: boolean;
  onClick: () => void;
  color: 'green' | 'brown' | 'blue';
  recommendationStyles: string;
  recommendedMoves: {areaId: number; rank: number}[];
};

const HexagonArea: React.FC<HexagonAreaProps> = ({
  area,
  isValidMove,
  onClick,
  color,
  recommendationStyles,
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
    <motion.div
      whileHover={isValidMove ? {scale: 1.05} : {}}
      onClick={onClick}
      className={`relative flex w-[23%] transform cursor-pointer items-center justify-center`}
      style={{aspectRatio: '1.2/1'}}
      data-hex-id={area.id}
    >
      {/* Main hexagon */}
      <div
        className={`absolute inset-0 z-0 ${colorClasses[color]} ${recommendationStyles} clip-hexagon transition-all duration-200`}
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
                  className="aspect-2/3 w-[11%]" // The size of each piece
                >
                  <MandragoraPieceComponent
                    type={piece.type}
                    color={piece.color}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HexagonalBoard;
