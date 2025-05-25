import React from 'react';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from './ui/dialog';

export type GameRulesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const GameRulesModal: React.FC<GameRulesModalProps> = ({
  open,
  onOpenChange,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-700 bg-slate-900 p-8 shadow-2xl">
      <DialogHeader>
        <DialogTitle className="mb-4 text-center text-3xl font-bold text-pink-400">
          Game Rules
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-invert max-w-none text-white">
        <h3 className="mb-1 text-xl font-bold text-purple-400">
          Mandragora Mania
        </h3>
        <ul>
          <li>
            <b>Goal:</b> Move your mandragora pieces to your goal area (blue,
            right side). Your opponent&apos;s goal is green (left side).
          </li>
          <li>
            <b>Setup:</b> Each of the 8 areas starts with 3 mandragoras. Choose
            a starting pattern and who goes first to start the game.
          </li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">Gameplay</h4>
        <ul>
          <li>
            Move pieces from your areas or neutral areas. Pieces move last-in,
            first-out (LIFO).
          </li>
          <li>
            Areas: 3 blue (yours), 3 green (opponent&apos;s), 2 brown (neutral).
          </li>
          <li>
            Each turn, select a valid area and move a piece toward your goal.
          </li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">
          Scoring (Jingly)
        </h4>
        <ul>
          <li>
            <b>Adenium & Citrillus:</b> 3 jingly (first player) / 4 jingly
            (second player)
          </li>
          <li>
            <b>Korrigan & Pachypodium:</b> 2 jingly (first player) / 3 jingly
            (second player)
          </li>
          <li>
            <b>Standard Mandragoras:</b> 1 jingly (both players)
          </li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">Special Rules</h4>
        <ul>
          <li>
            If your last moving piece reaches the goal, you get an extra turn.
          </li>
          <li>The game ends when a player has no valid moves.</li>
          <li>The player with the most jingly wins!</li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);

export default GameRulesModal;
