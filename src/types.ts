export type MandragoraPiece = {
  type: 'Adenium' | 'Citrillus' | 'Korrigan' | 'Pachypodium' | 'Mandragora';
  color: 'Pink' | 'Green' | 'Black' | 'White';
  value: {
    firstPlayer: number;
    secondPlayer: number;
  };
};

export type Position = {
  x: number;
  y: number;
};

export type GameArea = {
  id: number;
  pieces: MandragoraPiece[];
  allowedPlayer: 'player' | 'opponent' | 'both';
  position: Position;
};
