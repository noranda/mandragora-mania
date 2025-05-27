import {type GameArea} from '../types';

export type BoardPattern = {
  id: string;
  name: string;
  areas: GameArea[];
};

export const BOARD_PATTERNS: BoardPattern[] = [
  // Pattern A
  {
    id: 'pattern-a',
    name: 'Pattern A',
    areas: [
      {
        id: 1,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Citrillus', color: 'Green', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 0, y: 0},
      },
      {
        id: 2,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 1, y: 0},
      },
      {
        id: 3,
        pieces: [
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'player',
        position: {x: 2, y: 0},
      },
      {
        id: 4,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 0.5, y: 1},
      },
      {
        id: 5,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 1.5, y: 1},
      },
      {
        id: 6,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Adenium', color: 'Pink', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 0, y: 2},
      },
      {
        id: 7,
        pieces: [
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 1, y: 2},
      },
      {
        id: 8,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 2, y: 2},
      },
    ],
  },
  // Pattern B
  {
    id: 'pattern-b',
    name: 'Pattern B',
    areas: [
      {
        id: 1,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 0, y: 0},
      },
      {
        id: 2,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Citrillus', color: 'Green', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 1, y: 0},
      },
      {
        id: 3,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 2, y: 0},
      },
      {
        id: 4,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Adenium', color: 'Pink', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 0.5, y: 1},
      },
      {
        id: 5,
        pieces: [
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'player',
        position: {x: 1.5, y: 1},
      },
      {
        id: 6,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 0, y: 2},
      },
      {
        id: 7,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 1, y: 2},
      },
      {
        id: 8,
        pieces: [
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 2, y: 2},
      },
    ],
  },
  // Pattern C
  {
    id: 'pattern-c',
    name: 'Pattern C',
    areas: [
      {
        id: 1,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 0, y: 0},
      },
      {
        id: 2,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Citrillus', color: 'Green', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 1, y: 0},
      },
      {
        id: 3,
        pieces: [
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'player',
        position: {x: 2, y: 0},
      },
      {
        id: 4,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Adenium', color: 'Pink', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 0.5, y: 1},
      },
      {
        id: 5,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 1.5, y: 1},
      },
      {
        id: 6,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 0, y: 2},
      },
      {
        id: 7,
        pieces: [
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 1, y: 2},
      },
      {
        id: 8,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 2, y: 2},
      },
    ],
  },
  // Pattern D
  {
    id: 'pattern-d',
    name: 'Pattern D',
    areas: [
      {
        id: 1,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 0, y: 0},
      },
      {
        id: 2,
        pieces: [
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'both',
        position: {x: 1, y: 0},
      },
      {
        id: 3,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Citrillus', color: 'Green', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 2, y: 0},
      },
      {
        id: 4,
        pieces: [
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'both',
        position: {x: 0.5, y: 1},
      },
      {
        id: 5,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 1.5, y: 1},
      },
      {
        id: 6,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 0, y: 2},
      },
      {
        id: 7,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Adenium', color: 'Pink', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 1, y: 2},
      },
      {
        id: 8,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 2, y: 2},
      },
    ],
  },
  // Pattern E
  {
    id: 'pattern-e',
    name: 'Pattern E',
    areas: [
      {
        id: 1,
        pieces: [
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Pachypodium', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'player',
        position: {x: 0, y: 0},
      },
      {
        id: 2,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 1, y: 0},
      },
      {
        id: 3,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Citrillus', color: 'Green', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 2, y: 0},
      },
      {
        id: 4,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'both',
        position: {x: 0.5, y: 1},
      },
      {
        id: 5,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'player',
        position: {x: 1.5, y: 1},
      },
      {
        id: 6,
        pieces: [
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Korrigan', color: 'Black', value: {firstPlayer: 2, secondPlayer: 3}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 0, y: 2},
      },
      {
        id: 7,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Adenium', color: 'Pink', value: {firstPlayer: 3, secondPlayer: 4}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 1, y: 2},
      },
      {
        id: 8,
        pieces: [
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
          {type: 'Mandragora', color: 'White', value: {firstPlayer: 1, secondPlayer: 1}},
        ],
        allowedPlayer: 'opponent',
        position: {x: 2, y: 2},
      },
    ],
  },
];
