import type {MandragoraPiece} from '@/types';

/**
 * useMoveAnimation
 *
 * Returns a function to create the animation sequence for moving pieces.
 *
 * The returned function takes:
 *   - animDelay: number (delay between each piece's animation, in seconds)
 *   - areaId: number (the area the pieces are moving from)
 *   - distributionPattern: number[] (the destination area for each piece)
 *   - pieces: MandragoraPiece[] (the pieces to animate)
 *
 * Returns an array of animation objects for each piece, including delay, fromArea, toArea, and the piece itself.
 *
 * Usage:
 *   const createMoveAnimations = useMoveAnimation();
 *   const animations = createMoveAnimations(animDelay, areaId, distributionPattern, pieces);
 */
export function useMoveAnimation() {
  function createMoveAnimations(
    animDelay = 0.25,
    areaId: number,
    distributionPattern: number[],
    pieces: MandragoraPiece[],
  ) {
    // Reverse the pieces so the last-in piece animates first (LIFO)
    return [...pieces].reverse().map((piece, index) => ({
      delay: index * animDelay,
      fromArea: areaId,
      piece,
      toArea: distributionPattern[index],
    }));
  }

  return createMoveAnimations;
}
