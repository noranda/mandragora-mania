export type BasePosition = {
  opponent: DOMRect | null;
  player: DOMRect | null;
};

export type GameArea = {
  id: number;
  allowedPlayer: 'player' | 'opponent' | 'both';
  pieces: MandragoraPiece[];
  position: Position;
};

export type MandragoraPiece = {
  type: PieceType;
  color: PieceColor;
  value: {
    firstPlayer: number;
    secondPlayer: number;
  };
};

export type PieceColor = 'Pink' | 'Green' | 'Black' | 'White';

export type PieceType = 'Adenium' | 'Citrillus' | 'Korrigan' | 'Mandragora' | 'Pachypodium';

export type Position = {
  x: number;
  y: number;
};

export type MoveAnalysisItem = {
  areaId: number;
  explanation: string;
  totalValue: number;
};

export type MovePiece = {
  delay: number;
  fromArea: number;
  piece: MandragoraPiece;
  toArea: number;
};

export type MoveRecord = {
  extraTurn?: boolean;
  fromArea: number;
  piecesMoved: MandragoraPiece[];
  player: 'player' | 'opponent';
  timestamp: number;
  toArea: number[];
  analyzerScore?: number;
};

export type GameStateSnapshot = {
  areas: GameArea[];
  isGameOver: boolean;
  isPlayerTurn: boolean;
  opponentScore: MandragoraPiece[];
  playerScore: MandragoraPiece[];
};
