import {Dialog, DialogContent, DialogHeader, DialogTitle} from './ui/dialog';

type AnalyzerRulesModalProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const AnalyzerRulesModal: React.FC<AnalyzerRulesModalProps> = ({onOpenChange, open}) => (
  <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-700 bg-slate-900 p-8 shadow-2xl">
      <DialogHeader>
        <DialogTitle className="mb-4 text-center text-3xl font-bold text-pink-400">
          Move Analyzer Scoring
        </DialogTitle>
      </DialogHeader>
      <div className="prose prose-invert max-w-none text-white">
        <h3 className="mb-1 text-lg font-bold text-purple-400">About the Move Analyzer AI</h3>
        <p className="mb-4">
          The move analyzer uses a modern AI strategy inspired by classic board game AIs. It
          simulates possible moves using a minimax algorithm with alpha-beta pruning, planning
          several turns ahead for both you and your opponent. The analyzer adapts its strategy based
          on the phase of the game, aiming to recommend the smartest moves to maximize your chances
          of winning.
        </p>
        <h3 className="mb-1 text-lg font-bold text-purple-400">How Moves Are Scored</h3>
        <ul className="list-disc space-y-2 pl-6 marker:text-pink-300">
          <li>
            <b>Immediate Points:</b> <span className="text-pink-300">+10</span> for each point you
            score (each piece that lands in your base).
          </li>
          <li>
            <b>Future Value:</b> The analyzer looks up to <span className="text-pink-300">3</span>{' '}
            moves ahead, discounting future moves by <span className="text-pink-300">0.8</span> each
            step.
          </li>
          <li>
            <b>Extra Turns:</b> If your move grants an extra turn, the analyzer keeps planning as if
            you keep playing (chaining extra turns).
          </li>
          <li>
            <b>Game Phase:</b> Early in the game, having more options (mobility) and setting up
            extra turns is important. Late in the game, maximizing your score lead is what matters
            most.
            <ul className="list-disc space-y-0.5 pl-6 marker:text-pink-100">
              <li>
                Early: (your score - opponent score) × <span className="text-pink-300">5</span> +
                mobility × <span className="text-pink-300">3</span>
              </li>
              <li>
                Late: (your score - opponent score) × <span className="text-pink-300">15</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);

export default AnalyzerRulesModal;
