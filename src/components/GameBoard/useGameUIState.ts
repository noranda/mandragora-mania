/**
 * useGameUIState.ts
 *
 * Custom hook for managing UI-related state and refs in Mandragora Mania.
 * Handles DOM positions, modal open state, and refs for board and base panels.
 *
 * Usage:
 *   const {
 *     basePositions, setBasePositions,
 *     hexPositions, setHexPositions,
 *     statsOpen, setStatsOpen,
 *     boardAreaContainerRef, boardRef,
 *     opponentBaseAnchorRef, opponentBasePanelRef,
 *     playerBaseAnchorRef, playerBasePanelRef
 *   } = useGameUIState();
 */
import {useRef, useState} from 'react';

import {type BasePosition} from '../../types';

/**
 * Custom hook to manage UI state and refs for the game board and base panels.
 * Returns UI state, setters, and refs for use in GameBoard and related components.
 */
export function useGameUIState() {
  // Track the DOM positions of the player and opponent base panels for animation and layout
  const [basePositions, setBasePositions] = useState<BasePosition>({opponent: null, player: null});
  // DOM positions of each hex for piece animation
  const [hexPositions, setHexPositions] = useState<Record<number, DOMRect>>({});
  // Whether the stats modal is open
  const [statsOpen, setStatsOpen] = useState(false);

  // Ref to the container div for the board area (used for animation positioning)
  const boardAreaContainerRef = useRef<HTMLDivElement>(null);
  // Ref to the main board div (used to query hex positions)
  const boardRef = useRef<HTMLDivElement>(null);
  // Ref to the invisible anchor for opponent base (for animation start/end)
  const opponentBaseAnchorRef = useRef<HTMLDivElement | null>(null);
  // Ref to the opponent base panel (for measuring position)
  const opponentBasePanelRef = useRef<HTMLDivElement | null>(null);
  // Ref to the invisible anchor for player base (for animation start/end)
  const playerBaseAnchorRef = useRef<HTMLDivElement | null>(null);
  // Ref to the player base panel (for measuring position)
  const playerBasePanelRef = useRef<HTMLDivElement | null>(null);

  return {
    basePositions, // Current DOM positions of base panels
    setBasePositions, // Setter for base panel positions
    hexPositions, // Current DOM positions of hexes
    setHexPositions, // Setter for hex positions
    statsOpen, // Whether the stats modal is open
    setStatsOpen, // Setter for stats modal open state
    boardAreaContainerRef, // Ref to board area container
    boardRef, // Ref to main board
    opponentBaseAnchorRef, // Ref to opponent base anchor
    opponentBasePanelRef, // Ref to opponent base panel
    playerBaseAnchorRef, // Ref to player base anchor
    playerBasePanelRef, // Ref to player base panel
  };
}
