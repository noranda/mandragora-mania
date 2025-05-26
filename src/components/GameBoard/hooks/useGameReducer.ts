import {useReducer} from 'react';

import {boardPatterns} from '@/config/boardPatterns';
import {
  type GameArea,
  type GameStateSnapshot,
  type MandragoraPiece,
  type MoveAnalysisItem,
  type MovePiece,
  type MoveRecord,
} from '@/types';

/**
 * useGameReducer
 *
 * Centralized reducer and custom hook for managing Mandragora Mania game logic state.
 * Handles all game state transitions, undo/redo, move history, and board state.
 *
 * Returns a tuple: [state, dispatch]
 *   - state: GameState (current game state)
 *   - dispatch: function to dispatch GameAction
 *
 * Usage:
 *   const [state, dispatch] = useGameReducer();
 */
export type GameState = {
  areas: GameArea[];
  gameStarted: boolean;
  gameStateHistory: GameStateSnapshot[];
  isGameOver: boolean;
  isPlayerTurn: boolean;
  moveAnalysis: MoveAnalysisItem[];
  moveHistory: MoveRecord[];
  movingPieces: MovePiece[];
  opponentScore: MandragoraPiece[];
  playerGoesFirst: boolean | null;
  playerScore: MandragoraPiece[];
  redoGameStateStack: GameStateSnapshot[];
  redoStack: MoveRecord[];
  selectedPattern: string;
};

export type GameAction =
  | {type: 'INIT_GAME'; patternId: string; playerGoesFirst: boolean}
  | {type: 'RESET_GAME'}
  | {type: 'ANALYZE_MOVES'; analysis: MoveAnalysisItem[]}
  | {type: 'START_MOVE_ANIMATION'; movingPieces: MovePiece[]}
  | {type: 'END_MOVE_ANIMATION'}
  | {
      type: 'MAKE_MOVE';
      areaId: number;
      newAreas: GameArea[];
      newPlayerScore: MandragoraPiece[];
      newOpponentScore: MandragoraPiece[];
      moveRecord: MoveRecord;
      extraTurn: boolean;
      isGameOver: boolean;
    }
  | {type: 'UNDO'}
  | {type: 'REDO'}
  | {type: 'SET_PATTERN'; patternId: string}
  | {type: 'SET_PLAYER_GOES_FIRST'; value: boolean}
  | {type: 'SET_GAME_STARTED'; value: boolean};

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
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME': {
      const pattern = boardPatterns.find(p => p.id === action.patternId);
      if (!pattern) return state;
      return {
        ...initialGameState,
        areas: JSON.parse(JSON.stringify(pattern.areas)),
        gameStarted: true,
        isPlayerTurn: action.playerGoesFirst,
        playerGoesFirst: action.playerGoesFirst,
        selectedPattern: action.patternId,
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
      return {...initialGameState};
    case 'ANALYZE_MOVES':
      return {...state, moveAnalysis: action.analysis};
    case 'START_MOVE_ANIMATION':
      return {...state, movingPieces: action.movingPieces};
    case 'END_MOVE_ANIMATION':
      return {...state, movingPieces: []};
    case 'MAKE_MOVE': {
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
      return {...state, selectedPattern: action.patternId};
    case 'SET_PLAYER_GOES_FIRST':
      return {...state, playerGoesFirst: action.value};
    case 'SET_GAME_STARTED':
      return {...state, gameStarted: action.value};
    default:
      return state;
  }
}

export function useGameReducer() {
  return useReducer(gameReducer, initialGameState);
}
