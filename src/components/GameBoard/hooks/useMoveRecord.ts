import type {MandragoraPiece} from '@/types';

/**
 * useMoveRecord
 *
 * Returns a function to build a move record for a turn.
 *
 * The returned function takes an object with:
 *   - areaId: number (the area the move started from)
 *   - distributionPattern: number[] (the destination areas for each piece)
 *   - extraTurn: boolean (whether the move grants an extra turn)
 *   - isPlayerTurn: boolean (true if it was the player's turn)
 *   - pieces: MandragoraPiece[] (the pieces moved)
 *   - analyzerScore?: number (optional analyzer score for the move)
 *
 * Returns a MoveRecord object for storing in game history.
 *
 * Usage:
 *   const buildMoveRecord = useMoveRecord();
 *   const moveRecord = buildMoveRecord({ areaId, distributionPattern, extraTurn, isPlayerTurn, pieces, analyzerScore });
 */
export function useMoveRecord() {
  function buildMoveRecord({
    areaId,
    distributionPattern,
    extraTurn,
    isPlayerTurn,
    pieces,
    analyzerScore,
  }: {
    areaId: number;
    distributionPattern: number[];
    extraTurn: boolean;
    isPlayerTurn: boolean;
    pieces: MandragoraPiece[];
    analyzerScore?: number;
  }) {
    return {
      extraTurn,
      fromArea: areaId,
      piecesMoved: [...pieces],
      player: isPlayerTurn ? ('player' as const) : ('opponent' as const),
      timestamp: Date.now(),
      toArea: distributionPattern,
      analyzerScore,
    };
  }

  return buildMoveRecord;
}
