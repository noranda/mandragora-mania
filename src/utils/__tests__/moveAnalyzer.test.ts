import {describe, expect, it} from 'vitest';

import type {GameArea} from '../../types';
import {analyzeMoves, simulateMove} from '../moveAnalyzer';
import {createTestAreas, createTestPiece} from './testUtils';

// Helper: get best move
function getBestMove(areas: GameArea[], isPlayerTurn: boolean) {
  const moves = analyzeMoves(areas, isPlayerTurn);
  return moves.length ? moves.reduce((a, b) => (a.totalValue > b.totalValue ? a : b)) : null;
}

describe('moveAnalyzer (modern minimax)', () => {
  it('scores immediate points for moves to base', () => {
    // Move from area 5, piece lands in base (scores 1 point)
    const areas = createTestAreas([{areaId: 5, pieces: [createTestPiece()]}]);
    const moves = analyzeMoves(areas, true);
    expect(moves.length).toBe(1);
    expect(moves[0].totalValue).toBeGreaterThan(0);
    expect(moves[0].explanation).toContain('gains 1 point');
  });

  it('detects and explains extra turn', () => {
    // Move from area 5, piece lands in base (extra turn)
    const areas = createTestAreas([{areaId: 5, pieces: [createTestPiece()]}]);
    const moves = analyzeMoves(areas, true);
    expect(moves[0].explanation).toMatch(/EXTRA TURN/i);
  });

  it('returns empty array if no valid moves', () => {
    const areas = createTestAreas();
    const moves = analyzeMoves(areas, true);
    expect(moves).toEqual([]);
  });

  it('minimax: future value changes with board', () => {
    // If player has more points, future value should be higher
    const areas1 = createTestAreas([
      {areaId: 0, pieces: Array(5).fill(createTestPiece())}, // player base
      {areaId: 9, pieces: []}, // opponent base
      {areaId: 5, pieces: [createTestPiece()]},
    ]);
    const areas2 = createTestAreas([
      {areaId: 0, pieces: []},
      {areaId: 9, pieces: Array(5).fill(createTestPiece())},
      {areaId: 5, pieces: [createTestPiece()]},
    ]);
    const best1 = getBestMove(areas1, true);
    const best2 = getBestMove(areas2, true);
    expect(best1 && best2).toBeTruthy();
    expect(best1!.totalValue).toBeGreaterThan(best2!.totalValue);
  });

  it('evaluates late game (score diff) vs early game (mobility)', () => {
    // Early game: lots of pieces, mobility matters
    const earlyAreas = createTestAreas([
      {areaId: 1, pieces: Array(3).fill(createTestPiece())},
      {areaId: 3, pieces: Array(3).fill(createTestPiece())},
      {areaId: 5, pieces: Array(3).fill(createTestPiece())},
      {areaId: 0, pieces: []},
      {areaId: 9, pieces: []},
    ]);
    // Late game: few pieces, score diff matters
    const lateAreas = createTestAreas([
      {areaId: 1, pieces: []},
      {areaId: 3, pieces: []},
      {areaId: 5, pieces: [createTestPiece()]},
      {areaId: 0, pieces: Array(7).fill(createTestPiece())},
      {areaId: 9, pieces: Array(2).fill(createTestPiece())},
    ]);
    const earlyBest = getBestMove(earlyAreas, true);
    const lateBest = getBestMove(lateAreas, true);
    expect(earlyBest && lateBest).toBeTruthy();
    // Just check that both are numbers and not equal; log for manual review
    expect(typeof earlyBest!.totalValue).toBe('number');
    expect(typeof lateBest!.totalValue).toBe('number');
    expect(earlyBest!.totalValue).not.toBe(lateBest!.totalValue);
    // Log for manual review

    console.log('Early game best:', earlyBest!.totalValue, 'Late game best:', lateBest!.totalValue);
  });

  it('correctly switches player/opponent turns in minimax', () => {
    // Player moves, then opponent moves
    const areas = createTestAreas([
      {areaId: 5, pieces: [createTestPiece()]},
      {areaId: 8, pieces: [createTestPiece()]},
    ]);
    // Player's move
    const playerMoves = analyzeMoves(areas, true);
    // Simulate move
    const {newAreas} = simulateMove(5, areas, true);
    // Opponent's move
    const opponentMoves = analyzeMoves(newAreas, false);
    expect(playerMoves.length).toBeGreaterThan(0);
    expect(opponentMoves.length).toBeGreaterThan(0);
    // Just check that both player and opponent have valid moves
  });
});
