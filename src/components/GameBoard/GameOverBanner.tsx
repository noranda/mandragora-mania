type GameOverBannerProps = {
  playerScoreValue: number;
  opponentScoreValue: number;
};

const GameOverBanner = ({playerScoreValue, opponentScoreValue}: GameOverBannerProps) => (
  <div className="mt-8 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-8 text-center text-white backdrop-blur-sm">
    <h2 className="mb-3 text-3xl font-bold">Game Over!</h2>
    <p className="mb-2 text-2xl">
      {playerScoreValue > opponentScoreValue
        ? '🎉 You Win! 🎉'
        : playerScoreValue < opponentScoreValue
          ? '😔 Opponent Wins!'
          : "It's a Tie!"}
    </p>
    <p className="text-xl text-slate-300">
      Final Score: {playerScoreValue} - {opponentScoreValue}
    </p>
  </div>
);

export default GameOverBanner;
