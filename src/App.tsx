import GameBoard from './components/GameBoard';
import GameInfo from './components/GameInfo';

function App() {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white">
      <div className="w-full px-4 py-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <h1 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent">
            Mandragora Mania
          </h1>
          <GameInfo />
        </div>
        <div className="w-full rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
          <GameBoard />
        </div>
      </div>
    </div>
  );
}

export default App;
