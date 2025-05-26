import {describe, expect, it} from 'vitest';

import {type GameArea} from '../../types';
import {
  calculateAveragePieceValueBonus,
  calculateBoardPresenceBonus,
  getOpponentThreatPenalty,
} from '../analyzerUtils';
import {analyzeMoves, simulateMove} from '../moveAnalyzer';
import {createTestAreas, createTestPiece} from './testUtils';

// --- Modern analyzer test suite ---
describe('analyzeMoves (modern rules)', () => {
  it('scores immediate points correctly', () => {
    // Move from area 5, piece lands in base (scores 1 point)
    const areas = createTestAreas([{areaId: 5, pieces: [createTestPiece()]}]);
    const moves = analyzeMoves(areas, true);
    expect(moves.length).toBe(1);
    expect(moves[0].totalValue).toBeGreaterThan(0);
    expect(moves[0].explanation).toContain('gains 1 point');
  });

  it('applies extra turn bonus', () => {
    // Move from area 5, piece lands in base (extra turn)
    const areas = createTestAreas([{areaId: 5, pieces: [createTestPiece()]}]);
    const moves = analyzeMoves(areas, true);
    expect(moves[0].totalValue).toBeGreaterThan(50); // Should be excellent
    expect(moves[0].explanation).toContain('EXTRA TURN');
  });

  it('applies board presence bonus', () => {
    // Move from shared area 2 with 2 pieces, one lands in player area 1, increasing controlled pieces
    const areas = createTestAreas([
      {areaId: 2, pieces: [createTestPiece(), createTestPiece()]}, // shared area
      {areaId: 1, pieces: []}, // player area
    ]);
    const before = calculateBoardPresenceBonus(areas, true);
    const {newAreas} = simulateMove(2, areas, true);
    const after = calculateBoardPresenceBonus(newAreas, true);
    console.log('Board presence before:', before, 'after:', after);
    const moves = analyzeMoves(areas, true);
    console.log(
      'Board presence moves:',
      moves.map(m => ({explanation: m.explanation, value: m.totalValue})),
    );
    // Should get a small bonus for increasing presence
    expect(moves[0].totalValue).toBeGreaterThan(0);
  });

  it('applies future perfect moves bonus', () => {
    // Setup so that after a move, more perfect moves are possible
    const areas = createTestAreas([{areaId: 1, pieces: [createTestPiece(), createTestPiece()]}]);
    const moves = analyzeMoves(areas, true);
    // Should get a bonus if after the move, more perfect moves are possible
    expect(moves[0].totalValue).toBeGreaterThan(0);
  });

  it('applies average piece value bonus', () => {
    // Start with a high-value piece (10) in player area 3 and a low-value piece (1) in player area 1
    // Move from area 1 with 5 pieces so the last lands in base (area 0), leaving only the high-value piece under control
    const areas = createTestAreas([
      {
        areaId: 1,
        pieces: Array(5).fill(createTestPiece('Mandragora', 'Green', 1)),
      }, // player area, low value
      {areaId: 3, pieces: [createTestPiece('Adenium', 'Green', 10)]}, // player area, high value
    ]);
    const before = calculateAveragePieceValueBonus(areas, true);
    const {newAreas} = simulateMove(1, areas, true);
    const after = calculateAveragePieceValueBonus(newAreas, true);
    console.log('Avg piece value before:', before, 'after:', after);
    const moves = analyzeMoves(areas, true);
    console.log(
      'Avg piece value moves:',
      moves.map(m => ({explanation: m.explanation, value: m.totalValue})),
    );
    // Should value the move with higher average piece value
    expect(moves.some(m => m.totalValue > 0)).toBe(true);
  });

  it('applies flexibility bonus', () => {
    // Move from area 1 to area 3, creating a new valid move
    const areas = createTestAreas([
      {areaId: 1, pieces: [createTestPiece(), createTestPiece()]},
      {areaId: 3, pieces: []},
    ]);
    const moves = analyzeMoves(areas, true);
    console.log(
      'Flexibility moves:',
      moves.map(m => ({explanation: m.explanation, value: m.totalValue})),
    );
    // Should get a bonus for increasing flexibility
    expect(moves.some(m => m.totalValue > 0)).toBe(true);
  });

  it('penalizes moves that create new opponent extra turn', () => {
    // Setup: Player moves from area 2 with 9 pieces, last piece lands in area 8 for the opponent
    const areas = createTestAreas([{areaId: 2, pieces: Array(9).fill(createTestPiece())}]);
    const moves = analyzeMoves(areas, true);
    // Simulate the move manually
    const {newAreas} = simulateMove(2, areas, true);
    // Debug output
    console.log('BEFORE:', JSON.stringify(areas));
    console.log('AFTER:', JSON.stringify(newAreas));
    const penalty = getOpponentThreatPenalty(areas, true, newAreas);
    console.log('Penalty result:', penalty);
    console.log(
      'Moves for extra turn penalization:',
      moves.map(m => ({explanation: m.explanation, value: m.totalValue})),
    );
    const penalizedMove = moves.find(m =>
      m.explanation.includes('WARNING: grants opponent an extra move'),
    );
    expect(penalizedMove).toBeDefined();
    expect(penalizedMove!.explanation).toContain('WARNING: grants opponent an extra move');
  });

  it('penalizes moves that create new opponent scoring opportunity', () => {
    // Setup: Opponent cannot score before, but can after the move
    // Before: area 8 has 0 pieces, after: area 8 has 2 pieces (opponent can move from 8 with 2 pieces to land in 9)
    const areas = createTestAreas([
      {areaId: 2, pieces: Array(9).fill(createTestPiece())}, // 9 pieces, last two land in area 8
    ]);
    // Before the move, area 8 is empty, so opponent cannot score
    // After the move, area 8 has 2 pieces, so opponent can move from 8 with 2 pieces to 9 and score
    const moves = analyzeMoves(areas, true);
    const {newAreas} = simulateMove(2, areas, true);
    const penalty = getOpponentThreatPenalty(areas, true, newAreas);
    console.log('Penalty result (scoring):', penalty);
    const penalizedMove = moves.find(m =>
      m.explanation.includes('WARNING: grants opponent an extra move'),
    );
    expect(penalty).not.toBeNull();
    expect(penalty!.warning).toContain('extra move');
    expect(penalizedMove).toBeDefined();
    expect(penalizedMove!.explanation).toContain('WARNING: grants opponent an extra move');
  });

  it('does not penalize if opponent already had the opportunity', () => {
    // Setup: Opponent already has a scoring opportunity before the move
    const areas = createTestAreas([
      {areaId: 8, pieces: [createTestPiece()]}, // Opponent can already move from 8 to 9
      {areaId: 2, pieces: [createTestPiece()]},
    ]);
    const {newAreas} = simulateMove(2, areas, true);
    const penalty = getOpponentThreatPenalty(areas, true, newAreas);
    expect(penalty).toBeNull();
  });

  it('normalizes values to -100 to 100', () => {
    // Create a move with a huge bonus
    const areas = createTestAreas([{areaId: 1, pieces: Array(20).fill(createTestPiece())}]);
    const moves = analyzeMoves(areas, true);
    expect(moves[0].totalValue).toBeLessThanOrEqual(100);
    expect(moves[0].totalValue).toBeGreaterThanOrEqual(0);
  });

  it('normalizes penalized moves to max 0', () => {
    // Create a move that is heavily penalized
    const areas = createTestAreas([
      {areaId: 1, pieces: [createTestPiece()]},
      {areaId: 8, pieces: [createTestPiece()]},
    ]);
    const moves = analyzeMoves(areas, true);
    const penalizedMove = moves.find(m => m.totalValue <= 0);
    expect(penalizedMove).toBeDefined();
  });

  it('returns empty array if no valid moves', () => {
    const areas = createTestAreas();
    const moves = analyzeMoves(areas, true);
    expect(moves).toEqual([]);
  });

  it('handles look-ahead and recursive analysis', () => {
    // Setup: Player moves from area 2 with 9 pieces, last piece lands in area 8, so on the next turn, opponent can move from 8 and get an extra turn
    const areas = createTestAreas([{areaId: 2, pieces: Array(9).fill(createTestPiece())}]);
    const moves = analyzeMoves(areas, true);
    console.log(
      'Moves for look-ahead penalization:',
      moves.map(m => ({explanation: m.explanation, value: m.totalValue})),
    );
    const penalizedMove = moves.find(m => m.explanation.includes('WARNING'));
    expect(penalizedMove).toBeDefined();
    expect(penalizedMove!.explanation).toContain('WARNING');
  });
});

describe('getOpponentThreatPenalty', () => {
  it('detects new opponent extra turn opportunity after player move to area 8', () => {
    // Setup: Player moves from area 2 with 9 pieces, last piece lands in area 8
    const areas: GameArea[] = [
      {id: 0, pieces: [], allowedPlayer: 'player', position: {x: 0, y: 0}},
      {id: 9, pieces: [], allowedPlayer: 'opponent', position: {x: 0, y: 0}},
      {id: 1, pieces: [], allowedPlayer: 'player', position: {x: 0, y: 0}},
      {id: 3, pieces: [], allowedPlayer: 'player', position: {x: 0, y: 0}},
      {id: 5, pieces: [], allowedPlayer: 'player', position: {x: 0, y: 0}},
      {id: 6, pieces: [], allowedPlayer: 'opponent', position: {x: 0, y: 0}},
      {id: 7, pieces: [], allowedPlayer: 'opponent', position: {x: 0, y: 0}},
      {id: 8, pieces: [], allowedPlayer: 'opponent', position: {x: 0, y: 0}},
      {
        id: 2,
        pieces: Array(9).fill(createTestPiece()),
        allowedPlayer: 'both',
        position: {x: 0, y: 0},
      },
      {id: 4, pieces: [], allowedPlayer: 'both', position: {x: 0, y: 0}},
    ];
    const {newAreas} = simulateMove(2, areas, true);
    const penalty = getOpponentThreatPenalty(areas, true, newAreas);
    console.log('Direct penalty test result:', penalty);
    expect(penalty).not.toBeNull();
    if (penalty) {
      expect(penalty.warning).toContain('opponent');
    }
  });
});
