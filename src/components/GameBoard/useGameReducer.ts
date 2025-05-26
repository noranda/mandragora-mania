/**
 * useGameReducer.ts
 *
 * Centralized reducer and custom hook for managing Mandragora Mania game logic state.
 * Handles all game state transitions, undo/redo, move history, and board state.
 *
 * Usage:
 *   const [state, dispatch] = useGameReducer();
 */
import {useReducer} from 'react';

import {boardPatterns} from '../../config/boardPatterns';
import {
  type GameArea,
  type GameStateSnapshot,
  type MandragoraPiece,
  type MoveAnalysisItem,
  type MovePiece,
  type MoveRecord,
} from '../../types';

/**
 * The shape of the main game state managed by the reducer.
 */
export type GameState = {
  /** Current board areas and their pieces */
  areas: GameArea[];
  /** Whether the game has started */
  gameStarted: boolean;
  /** History of all game states for undo/redo */
  gameStateHistory: GameStateSnapshot[];
  /** Whether the game is over */
  isGameOver: boolean;
  /** Whether it is currently the player's turn */
  isPlayerTurn: boolean;
  /** List of analyzed moves for the current turn */
  moveAnalysis: MoveAnalysisItem[];
  /** History of all moves made */
  moveHistory: MoveRecord[];
  /** Pieces currently being animated as moving */
  movingPieces: MovePiece[];
  /** Pieces collected by the opponent (scoring) */
  opponentScore: MandragoraPiece[];
  /** Whether the player goes first (null = not chosen) */
  playerGoesFirst: boolean | null;
  /** Pieces collected by the player (scoring) */
  playerScore: MandragoraPiece[];
  /** Stack of game states for redo functionality */
  redoGameStateStack: GameStateSnapshot[];
  /** Stack of moves for redo functionality */
  redoStack: MoveRecord[];
  /** The selected board pattern (by id) */
  selectedPattern: string;
  opponentName: string;
};

/**
 * All possible actions that can be dispatched to the game reducer.
 */
export type GameAction =
  | {type: 'INIT_GAME'; patternId: string; playerGoesFirst: boolean} // Start a new game
  | {type: 'RESET_GAME'} // Reset all state
  | {type: 'ANALYZE_MOVES'; analysis: MoveAnalysisItem[]} // Set move analysis
  | {type: 'START_MOVE_ANIMATION'; movingPieces: MovePiece[]} // Start animating pieces
  | {type: 'END_MOVE_ANIMATION'} // End animation
  | {
      type: 'MAKE_MOVE'; // Make a move and update state
      areaId: number;
      newAreas: GameArea[];
      newPlayerScore: MandragoraPiece[];
      newOpponentScore: MandragoraPiece[];
      moveRecord: MoveRecord;
      extraTurn: boolean;
      isGameOver: boolean;
    }
  | {type: 'UNDO'} // Undo last move
  | {type: 'REDO'} // Redo last undone move
  | {type: 'SET_PATTERN'; patternId: string} // Set board pattern
  | {type: 'SET_PLAYER_GOES_FIRST'; value: boolean} // Set who goes first
  | {type: 'SET_GAME_STARTED'; value: boolean} // Set game started flag
  | {type: 'SET_OPPONENT_NAME'; name: string}; // Set opponent name

/**
 * The initial state for a new game or after reset.
 */
const initialGameState: GameState = {
  areas: [],
  gameStarted: false,
  gameStateHistory: [],
  isGameOver: false,
  isPlayerTurn: true,
  moveAnalysis: [],
  moveHistory: [],
  movingPieces: [],
  opponentScore: [],
  playerGoesFirst: null,
  playerScore: [],
  redoGameStateStack: [],
  redoStack: [],
  selectedPattern: '',
  opponentName: '',
};

/**
 * The main reducer function for all game logic state transitions.
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME': {
      // Start a new game with the selected pattern and who goes first
      const pattern = boardPatterns.find(p => p.id === action.patternId);
      if (!pattern) return state;
      return {
        ...initialGameState,
        areas: JSON.parse(JSON.stringify(pattern.areas)),
        gameStarted: true,
        isPlayerTurn: action.playerGoesFirst,
        playerGoesFirst: action.playerGoesFirst,
        selectedPattern: action.patternId,
        opponentName: state.opponentName,
        gameStateHistory: [
          {
            areas: JSON.parse(JSON.stringify(pattern.areas)),
            playerScore: [],
            opponentScore: [],
            isPlayerTurn: action.playerGoesFirst,
            isGameOver: false,
          },
        ],
      };
    }
    case 'RESET_GAME':
      // Reset all state to initial
      return {...initialGameState};
    case 'ANALYZE_MOVES':
      // Set the move analysis for the current turn
      return {...state, moveAnalysis: action.analysis};
    case 'START_MOVE_ANIMATION':
      // Start animating pieces
      return {...state, movingPieces: action.movingPieces};
    case 'END_MOVE_ANIMATION':
      // End all piece animations
      return {...state, movingPieces: []};
    case 'MAKE_MOVE': {
      // Apply a move, update board, scores, turn, and history
      return {
        ...state,
        areas: action.newAreas,
        gameStateHistory: [
          ...state.gameStateHistory,
          {
            areas: JSON.parse(JSON.stringify(action.newAreas)),
            isGameOver: action.isGameOver,
            isPlayerTurn: action.extraTurn ? state.isPlayerTurn : !state.isPlayerTurn,
            opponentScore: action.newOpponentScore,
            playerScore: action.newPlayerScore,
          },
        ],
        isGameOver: action.isGameOver,
        isPlayerTurn: action.extraTurn ? state.isPlayerTurn : !state.isPlayerTurn,
        moveHistory: [...state.moveHistory, action.moveRecord],
        opponentScore: action.newOpponentScore,
        playerScore: action.newPlayerScore,
        redoGameStateStack: [],
        redoStack: [],
      };
    }
    case 'UNDO': {
      // Undo the last move, restoring the previous game state
      if (state.moveHistory.length === 0 || state.gameStateHistory.length === 0) return state;
      const prevState = state.gameStateHistory[state.gameStateHistory.length - 1];
      const undoneMove = state.moveHistory[state.moveHistory.length - 1];
      return {
        ...state,
        areas: prevState.areas,
        gameStateHistory: state.gameStateHistory.slice(0, -1),
        isGameOver: prevState.isGameOver,
        isPlayerTurn: prevState.isPlayerTurn,
        moveHistory: state.moveHistory.slice(0, -1),
        opponentScore: prevState.opponentScore,
        playerScore: prevState.playerScore,
        redoGameStateStack: [
          ...state.redoGameStateStack,
          {
            areas: JSON.parse(JSON.stringify(state.areas)),
            playerScore: [...state.playerScore],
            opponentScore: [...state.opponentScore],
            isPlayerTurn: state.isPlayerTurn,
            isGameOver: state.isGameOver,
          },
        ],
        redoStack: [...state.redoStack, undoneMove],
      };
    }
    case 'REDO': {
      // Redo the last undone move, restoring the next game state
      if (state.redoStack.length === 0 || state.redoGameStateStack.length === 0) return state;
      const redoMove = state.redoStack[state.redoStack.length - 1];
      const redoState = state.redoGameStateStack[state.redoGameStateStack.length - 1];
      return {
        ...state,
        areas: redoState.areas,
        gameStateHistory: [...state.gameStateHistory, redoState],
        isGameOver: redoState.isGameOver,
        isPlayerTurn: redoState.isPlayerTurn,
        moveHistory: [...state.moveHistory, redoMove],
        opponentScore: redoState.opponentScore,
        playerScore: redoState.playerScore,
        redoGameStateStack: state.redoGameStateStack.slice(0, -1),
        redoStack: state.redoStack.slice(0, -1),
      };
    }
    case 'SET_PATTERN':
      // Set the selected board pattern
      return {...state, selectedPattern: action.patternId};
    case 'SET_PLAYER_GOES_FIRST':
      // Set who goes first
      return {...state, playerGoesFirst: action.value};
    case 'SET_GAME_STARTED':
      // Set the game started flag
      return {...state, gameStarted: action.value};
    case 'SET_OPPONENT_NAME':
      return {...state, opponentName: action.name};
    default:
      return state;
  }
}

/**
 * Custom hook to use the game reducer and initial state.
 * @returns [state, dispatch] tuple for game logic
 */
export function useGameReducer() {
  return useReducer(gameReducer, initialGameState);
}
