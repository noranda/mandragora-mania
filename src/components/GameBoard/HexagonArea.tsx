import {cn} from '@/lib/utils';
import type {GameArea, MandragoraPiece} from '../../types';
import MandragoraPieceComponent from './MandragoraPiece';

// Color classes for each area type
const colorClasses = {
  blue: 'bg-blue text-blue-100',
  brown: 'bg-brown text-amber-100',
  green: 'bg-gradient-to-br from-green-700 to-green-600 text-green-100',
};

// Helper to calculate left/right margins for each row
function getRowMargins(rowIndex: number) {
  switch (rowIndex) {
    case 0:
      return 23;
    case 1:
      return 16;
    case 2:
      return 10;
    case 3:
      return 16;
    case 4:
      return 23;
    default:
      return 0;
  }
}

/**
 * HexagonArea
 *
 * Renders a single hexagonal area on the board, including its pieces and click/keyboard handlers.
 * Used by HexagonalBoard to display each playable area.
 */
export type HexagonAreaProps = {
  area: GameArea;
  color: 'blue' | 'brown' | 'green';
  isValidMove: boolean;
  onClick: () => void;
  recommendedMoveAreaId?: number | null;
};

const HexagonArea: React.FC<HexagonAreaProps> = ({
  area,
  color,
  isValidMove,
  onClick,
  recommendedMoveAreaId,
}) => {
  // Organize pieces into rows from bottom up
  const organizePieces = (pieces: MandragoraPiece[]) => {
    const rows: MandragoraPiece[][] = [[], [], [], [], []];
    let remainingPieces = [...pieces];
    const rowCapacities = [4, 5, 6, 5, 4];
    for (let i = 0; i < rowCapacities.length && remainingPieces.length > 0; i++) {
      const capacity = rowCapacities[i];
      rows[i] = remainingPieces.slice(0, capacity);
      remainingPieces = remainingPieces.slice(capacity);
    }
    return rows.reverse(); // Reverse to render from top to bottom
  };

  // Accessibility: label for screen readers
  const ariaLabel = `Area ${area.id}${isValidMove ? ', valid move' : ''}`;
  const isRecommended = area.id === recommendedMoveAreaId;

  return (
    <button
      aria-label={ariaLabel}
      className="group relative flex aspect-[1.2/1] w-[23%] cursor-pointer items-center justify-center border-none bg-transparent p-0 focus:outline-none"
      data-hex-id={area.id}
      disabled={!isValidMove}
      onClick={onClick}
      type="button"
    >
      {/* Main hexagon */}
      <div
        className={cn(
          'clip-hexagon absolute inset-0 z-10 shadow-lg shadow-yellow-400/30 ring-4 ring-yellow-400/50 transition-all duration-200',
          colorClasses[color],
          isValidMove && 'group-hover:scale-105',
        )}
        style={{
          transformOrigin: '50% 50%',
        }}
      />

      <div
        className={cn(
          'absolute left-1/2 top-[8%] z-50 -translate-x-1/2 rounded-full px-3 py-1 text-base font-bold',
          isRecommended ? 'bg-yellow-400 text-black' : 'bg-black/40 text-white backdrop-blur-sm',
        )}
      >
        {isRecommended && <span className="mr-1">★</span>}
        Area {area.id}
      </div>

      {/* Pieces container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        {organizePieces(area.pieces).map((row, rowIndex) => (
          <div
            className="flex items-center justify-start gap-2"
            key={rowIndex}
            style={{
              marginLeft: `${getRowMargins(rowIndex)}%`,
              marginRight: `${getRowMargins(rowIndex)}%`,
              marginTop: rowIndex === 0 ? '0' : '-8%',
              position: 'relative',
              width: '100%',
              zIndex: rowIndex + 1,
            }}
          >
            {row.map((piece, pieceIndex) => (
              <div className="aspect-2/3 w-[11%]" key={`${rowIndex}-${pieceIndex}`}>
                <MandragoraPieceComponent color={piece.color} showLabel={false} type={piece.type} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </button>
  );
};

export default HexagonArea;
