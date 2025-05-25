// Test helpers for Mandragora Mania analyzer tests
import {type GameArea, type MandragoraPiece} from '../../types';

export const createTestPiece = (
  type: MandragoraPiece['type'] = 'Mandragora',
  color: MandragoraPiece['color'] = 'Green',
  value = 1,
): MandragoraPiece => ({
  type,
  color,
  value: {firstPlayer: value, secondPlayer: value},
});

export const createTestArea = (
  id: number,
  pieces: MandragoraPiece[] = [],
  allowedPlayer: GameArea['allowedPlayer'] = 'both',
): GameArea => ({
  id,
  pieces,
  allowedPlayer,
  position: {x: 0, y: 0},
});

export const createTestAreas = (
  pieceConfigs: {areaId: number; pieces: MandragoraPiece[]}[] = [],
): GameArea[] => {
  // Standard board: 0 = player base, 9 = opponent base
  const areas: GameArea[] = [
    createTestArea(0, [], 'player'),
    createTestArea(9, [], 'opponent'),
    createTestArea(1, [], 'player'),
    createTestArea(3, [], 'player'),
    createTestArea(5, [], 'player'),
    createTestArea(6, [], 'opponent'),
    createTestArea(7, [], 'opponent'),
    createTestArea(8, [], 'opponent'),
    createTestArea(2, [], 'both'),
    createTestArea(4, [], 'both'),
  ];
  pieceConfigs.forEach(config => {
    const area = areas.find(a => a.id === config.areaId);
    if (area) area.pieces = config.pieces;
  });
  return areas;
};
