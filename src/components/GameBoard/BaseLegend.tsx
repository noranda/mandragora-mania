import React from 'react';

import MandragoraPieceComponent from './MandragoraPiece';

type BaseLegendProps = {
  isPlayer: boolean;
  playerGoesFirst: boolean | null;
  gameStarted: boolean;
};

const BaseLegend: React.FC<BaseLegendProps> = ({isPlayer, playerGoesFirst, gameStarted}) => {
  // Piece counts based on who goes first
  const getCounts = () => {
    if (!gameStarted || playerGoesFirst === null) {
      return {
        Adenium: '',
        Citrillus: '',
        Korrigan: '',
        Pachypodium: '',
        Mandragora: '',
      };
    }
    const first = isPlayer ? playerGoesFirst : !playerGoesFirst;
    return {
      Adenium: first ? '3' : '4',
      Citrillus: first ? '3' : '4',
      Korrigan: first ? '2' : '3',
      Pachypodium: first ? '2' : '3',
      Mandragora: '1',
    };
  };
  const counts = getCounts();
  return (
    <div className="w-40 rounded-lg bg-slate-800 p-3">
      <div className="flex w-full items-end justify-evenly">
        <div className="flex flex-col items-center justify-end">
          <div className="aspect-2/3 w-6">
            <MandragoraPieceComponent type="Adenium" color="Pink" showLabel={true} />
          </div>
          {gameStarted && <span className="mt-1 font-bold text-pink-400">{counts.Adenium}</span>}
        </div>
        <div className="flex flex-col items-center justify-end">
          <div className="aspect-2/3 w-6">
            <MandragoraPieceComponent type="Citrillus" color="Green" showLabel={true} />
          </div>
          {gameStarted && <span className="mt-1 font-bold text-green-400">{counts.Citrillus}</span>}
        </div>
        <div className="flex flex-col items-center justify-end">
          <div className="aspect-2/3 w-6">
            <MandragoraPieceComponent type="Korrigan" color="Black" showLabel={true} />
          </div>
          {gameStarted && <span className="mt-1 font-bold text-white">{counts.Korrigan}</span>}
        </div>
        <div className="flex flex-col items-center justify-end">
          <div className="aspect-2/3 w-6">
            <MandragoraPieceComponent type="Pachypodium" color="Black" showLabel={true} />
          </div>
          {gameStarted && <span className="mt-1 font-bold text-white">{counts.Pachypodium}</span>}
        </div>
        <div className="flex flex-col items-center justify-end">
          <div className="aspect-2/3 w-6">
            <MandragoraPieceComponent type="Mandragora" color="White" showLabel={true} />
          </div>
          {gameStarted && <span className="mt-1 font-bold text-white">{counts.Mandragora}</span>}
        </div>
      </div>
    </div>
  );
};

export default BaseLegend;
