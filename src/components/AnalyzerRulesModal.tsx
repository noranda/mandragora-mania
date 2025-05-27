import {Dialog, DialogContent, DialogHeader, DialogTitle} from './ui/dialog';

export type AnalyzerRulesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AnalyzerRulesModal: React.FC<AnalyzerRulesModalProps> = ({open, onOpenChange}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-700 bg-slate-900 p-8 shadow-2xl">
      <DialogHeader>
        <DialogTitle className="mb-4 text-center text-3xl font-bold text-pink-400">
          Analyzer Scoring Rules
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-invert max-w-none text-white">
        <h3 className="text-xl font-bold text-purple-400">How the Analyzer Ranks Moves</h3>
        <p>
          The move analyzer recommends moves that maximize your chances of winning, based on both
          immediate and strategic factors:
        </p>
        <ul className="list-disc pl-6">
          <li>Controlling more pieces (board presence)</li>
          <li>Setting up future scoring or extra turn opportunities (perfect moves)</li>
          <li>Maximizing the value of pieces you control (high-value Mandragoras)</li>
          <li>Denying the opponent opportunities (penalization)</li>
          <li>Immediate scoring and extra turns</li>
          <li>Flexibility and move options (not getting stuck)</li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">Scoring Breakdown</h4>
        <ul className="list-disc pl-6">
          <li>
            Immediate Points: <span className="text-pink-300">+10</span> for each point scored
            (piece lands in your base).
          </li>
          <li>
            Extra Turn Bonus: <span className="text-pink-300">+90</span> if the move grants an extra
            turn (last piece lands in your base).
          </li>
          <li>
            Board Presence: <span className="text-pink-300">+5</span> for each net increase in
            pieces you control after the move.
          </li>
          <li>
            Future Perfect Moves: <span className="text-pink-300">+20</span> for each new possible
            move (after your move) that would result in a perfect score (last piece lands in your
            base).
          </li>
          <li>
            Average Piece Value: <span className="text-pink-300">+2</span> for each 0.1 increase in
            the average value of pieces you control after the move.
          </li>
          <li>
            Flexibility: <span className="text-pink-300">+3</span> for each additional valid move
            you have after the move.
          </li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">Penalties</h4>
        <ul className="list-disc pl-6">
          <li>
            <span className="text-pink-300">-50</span> if your move grants the opponent a new extra
            turn opportunity.
          </li>
          <li>
            <span className="text-pink-300">-80</span> if your move grants the opponent a new
            scoring opportunity.
          </li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">Look-Ahead</h4>
        <ul className="list-disc pl-6">
          <li>
            The analyzer simulates up to <span className="text-pink-300">3</span> moves ahead
            (minimax-like approach). The value of the best future move is multiplied by{' '}
            <span className="text-pink-300">0.8</span> and added to the current move&apos;s value.
          </li>
        </ul>
        <h4 className="mb-1 mt-4 font-semibold text-pink-400">Normalization</h4>
        <ul className="list-disc pl-6">
          <li>
            After all calculations, the total value is normalized to a{' '}
            <span className="text-pink-300">-100 to 100</span> scale.
          </li>
          <li>
            <b>Interpretation:</b> Positive is good, negative is bad, zero is neutral.
          </li>
        </ul>
        <p className="mt-4 text-sm text-slate-300">
          All bonuses and penalties are applied before normalization. This system is designed to be
          transparent and easily adjustable as the game evolves.
        </p>
      </div>
    </DialogContent>
  </Dialog>
);

export default AnalyzerRulesModal;
