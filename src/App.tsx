import AppBar from './components/AppBar';
import Footer from './components/Footer';
import GameBoard from './components/GameBoard/GameBoard';

function App() {
  return (
    <div className="font-lexend flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 text-white">
      <AppBar />
      <GameBoard />
      <Footer />
    </div>
  );
}

export default App;
