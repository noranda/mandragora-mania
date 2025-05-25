import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {makeMove} from '@/utils/gameLogic';
import {isValidMove} from '@/utils/gameMechanics';
import {analyzeMoves} from '@/utils/moveAnalyzer';
import {getDistributionPattern} from '@/utils/movementPaths';
import {calculatePoints} from '@/utils/scoring';
import {boardPatterns} from '../config/boardPatterns';
import {type GameArea, type MandragoraPiece} from '../types';
import HexagonalBoard from './HexagonalBoard';
import MandragoraPieceComponent from './MandragoraPiece';

const GameBoard: React.FC = () => {
  const [areas, setAreas] = useState<GameArea[]>([]);
  const [playerScore, setPlayerScore] = useState<MandragoraPiece[]>([]);
  const [opponentScore, setOpponentScore] = useState<MandragoraPiece[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [playerGoesFirst, setPlayerGoesFirst] = useState<boolean | null>(null);
  const [moveAnalysis, setMoveAnalysis] = useState<
    ReturnType<typeof analyzeMoves>
  >([]);
  const [movingPieces, setMovingPieces] = useState<
    {
      piece: MandragoraPiece;
      fromArea: number;
      toArea: number;
      delay: number;
    }[]
  >([]);
  const opponentBaseRef = useRef<HTMLDivElement>(null);
  const playerBaseRef = useRef<HTMLDivElement>(null);
  const [basePositions, setBasePositions] = useState<{
    opponent: DOMRect | null;
    player: DOMRect | null;
  }>({opponent: null, player: null});

  const initializeGame = () => {
    if (gameStarted) {
      // Reset everything
      setAreas([]);
      setPlayerScore([]);
      setOpponentScore([]);
      setIsPlayerTurn(true);
      setGameStarted(false);
      setIsGameOver(false);
      setSelectedPattern('');
      setPlayerGoesFirst(null);
      setMoveAnalysis([]);
      setMovingPieces([]);
    } else {
      // Start new game
      if (playerGoesFirst === null || !selectedPattern) return;

      const pattern = boardPatterns.find(p => p.id === selectedPattern);
      if (!pattern) return;

      setAreas(pattern.areas);
      setPlayerScore([]);
      setOpponentScore([]);
      setIsPlayerTurn(playerGoesFirst);
      setGameStarted(true);
      setIsGameOver(false);
      setMoveAnalysis([]);
      setMovingPieces([]);
    }
  };

  // Automatically analyze moves when it's the player's turn
  useEffect(() => {
    if (gameStarted && !isGameOver && isPlayerTurn) {
      const analysis = analyzeMoves(areas, isPlayerTurn);
      setMoveAnalysis(analysis);
    } else {
      setMoveAnalysis([]);
    }
  }, [areas, isPlayerTurn, gameStarted, isGameOver]);

  // Update base positions when the component mounts or window resizes
  useEffect(() => {
    const updateBasePositions = () => {
      setBasePositions({
        opponent: opponentBaseRef.current?.getBoundingClientRect() || null,
        player: playerBaseRef.current?.getBoundingClientRect() || null,
      });
    };

    updateBasePositions();
    window.addEventListener('resize', updateBasePositions);
    return () => window.removeEventListener('resize', updateBasePositions);
  }, []);

  const handleAreaClick = async (areaId: number) => {
    if (isGameOver || !gameStarted) return;

    if (!isValidMove(areaId, areas, isPlayerTurn)) {
      return;
    }

    const sourceArea = areas.find(a => a.id === areaId);
    if (!sourceArea) return;

    // Calculate piece movements based on the distribution pattern
    const distributionPattern = getDistributionPattern(
      areaId,
      sourceArea.pieces.length,
      isPlayerTurn,
    );

    // Create animation sequence - pieces move from back to front (last in, first out)
    const animations = [...sourceArea.pieces].reverse().map((piece, index) => ({
      piece,
      fromArea: areaId,
      toArea: distributionPattern[index],
      delay: index * 0.25, // Reduced from 0.5 to 0.25
    }));

    // Start animations
    setMovingPieces(animations);

    // Wait for all animations to complete before updating game state
    const totalDuration = animations.length * 0.25 + 0.1; // Reduced delay between pieces and final buffer
    await new Promise(resolve => setTimeout(resolve, totalDuration * 1000));

    const {newAreas, newPlayerScore, newOpponentScore, extraTurn} = makeMove(
      areaId,
      areas,
      playerScore,
      opponentScore,
      isPlayerTurn,
    );

    setAreas(newAreas);
    setPlayerScore(newPlayerScore);
    setOpponentScore(newOpponentScore);
    setMovingPieces([]);

    // Check if game is over
    const hasValidMoves = (isPlayerTurn: boolean) => {
      return areas.some(area => {
        const isPlayerArea =
          area.allowedPlayer === 'player' || area.allowedPlayer === 'both';
        const isOpponentArea =
          area.allowedPlayer === 'opponent' || area.allowedPlayer === 'both';
        return (
          area.pieces.length > 0 &&
          ((isPlayerTurn && isPlayerArea) || (!isPlayerTurn && isOpponentArea))
        );
      });
    };

    const nextTurn = !extraTurn ? !isPlayerTurn : isPlayerTurn;
    if (!hasValidMoves(nextTurn)) {
      setIsGameOver(true);
    }

    if (!extraTurn) {
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const playerScoreValue = calculatePoints(playerScore, true);
  const opponentScoreValue = calculatePoints(opponentScore, false);

  // Convert move analysis to board recommendations
  const recommendedMoves = moveAnalysis.map((analysis, index) => ({
    areaId: analysis.areaId,
    rank: index + 1,
  }));

  return (
    <div className="flex w-full flex-col items-stretch gap-8">
      <div className="w-full">
        <div className="relative mb-6 flex h-11 flex-col items-center md:flex-row">
          <div className="absolute right-0 flex items-center gap-4">
            <Select
              value={selectedPattern}
              onValueChange={value => setSelectedPattern(value)}
              disabled={gameStarted}
            >
              <SelectTrigger className="w-40 border-slate-600 bg-slate-700 text-white">
                <SelectValue placeholder="Which pattern?" />
              </SelectTrigger>
              <SelectContent>
                {[...boardPatterns]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(pattern => (
                    <SelectItem key={pattern.id} value={pattern.id}>
                      {pattern.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {!gameStarted && (
              <Select
                value={
                  playerGoesFirst === null
                    ? ''
                    : playerGoesFirst
                      ? 'player'
                      : 'opponent'
                }
                onValueChange={value => setPlayerGoesFirst(value === 'player')}
              >
                <SelectTrigger className="w-48 border-slate-600 bg-slate-700 text-white">
                  <SelectValue placeholder="Who goes first?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">You go first</SelectItem>
                  <SelectItem value="opponent">Opponent goes first</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={initializeGame}
              disabled={
                !gameStarted && (playerGoesFirst === null || !selectedPattern)
              }
              size="lg"
              className="w-40 bg-gradient-to-r from-purple-400 to-pink-400 text-base font-semibold text-white shadow-lg hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/20"
            >
              {gameStarted ? 'Reset Game' : 'Start Game'}
            </Button>
          </div>

          <div className="flex h-11 flex-1 justify-center">
            {gameStarted && (
              <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                className={`h-11 min-w-[260px] rounded-sm px-10 py-2 text-center text-xl font-bold ${
                  isGameOver
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                    : isPlayerTurn
                      ? 'bg-gradient-to-r from-blue-500/40 via-blue-400/40 to-blue-500/40 text-blue-100'
                      : 'bg-gradient-to-r from-green-500/40 via-green-400/40 to-green-500/40 text-green-100'
                } flex items-center justify-center shadow-md backdrop-blur-sm`}
              >
                {isGameOver
                  ? `Game Complete! ${
                      playerScoreValue > opponentScoreValue
                        ? 'Win!'
                        : playerScoreValue < opponentScoreValue
                          ? 'Defeat!'
                          : 'Draw!'
                    } (${playerScoreValue} - ${opponentScoreValue})`
                  : isPlayerTurn
                    ? '🎲 Your Turn'
                    : "⏳ Opponent's Turn"}
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-8 flex w-full items-center">
          {/* Left base (Opponent) */}
          <div className="flex w-40 flex-col gap-4">
            <div
              ref={opponentBaseRef}
              className="flex h-[29.7rem] w-40 flex-col rounded-xl border-2 border-green-600 bg-slate-700 shadow-lg"
            >
              <h3 className="border-b border-green-500 p-4 text-center text-lg font-bold text-green-400">
                Opponent
              </h3>
              <div className="flex flex-1 flex-wrap-reverse content-start items-center justify-start gap-x-3 overflow-y-auto px-2 pb-2 pt-2">
                <AnimatePresence>
                  {opponentScore.map((piece, index, array) => (
                    <div
                      key={`opponent-${index}`}
                      className={`aspect-2/3 relative w-[18%] ${index >= 4 ? '-mb-5' : ''}`}
                      style={{zIndex: array.length - index}}
                    >
                      <MandragoraPieceComponent
                        type={piece.type}
                        color={piece.color}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="border-t border-green-500 bg-slate-800/50 p-4 text-center text-green-400">
                Score: <span className="font-bold">{opponentScoreValue}</span>
              </div>
            </div>
            <div className="w-40 rounded-lg bg-slate-800 p-3">
              <div className="flex w-full items-end justify-evenly">
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Adenium" color="Pink" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-pink-400">
                      {!playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Citrillus" color="Green" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-green-400">
                      {!playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Korrigan" color="Black" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {!playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Pachypodium"
                      color="Black"
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {!playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Mandragora" color="White" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">1</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="flex-1 px-8">
            <HexagonalBoard
              areas={areas}
              onAreaClick={handleAreaClick}
              isValidMove={areaId => isValidMove(areaId, areas, isPlayerTurn)}
              recommendedMoves={recommendedMoves}
              movingPieces={movingPieces}
              basePositions={basePositions}
            />
          </div>

          {/* Right base (Player) */}
          <div className="flex w-40 flex-col gap-4">
            <div
              ref={playerBaseRef}
              className="flex h-[29.7rem] w-40 flex-col rounded-xl border-2 border-[#3b82f6] bg-slate-700 shadow-lg"
            >
              <h3 className="border-b border-[#3b82f6] p-4 text-center text-lg font-bold text-[#3b82f6]">
                You
              </h3>
              <div className="flex flex-1 flex-wrap-reverse content-start items-center justify-start gap-x-3 overflow-y-auto px-2 pb-2 pt-2">
                <AnimatePresence>
                  {playerScore.map((piece, index, array) => (
                    <div
                      key={`player-${index}`}
                      className={`aspect-2/3 relative w-[18%] ${index >= 4 ? '-mb-5' : ''}`}
                      style={{zIndex: array.length - index}}
                    >
                      <MandragoraPieceComponent
                        type={piece.type}
                        color={piece.color}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="border-t border-[#3b82f6] bg-slate-800/50 p-4 text-center text-[#3b82f6]">
                Score: <span className="font-bold">{playerScoreValue}</span>
              </div>
            </div>
            <div className="w-40 rounded-lg bg-slate-800 p-3">
              <div className="flex w-full items-end justify-evenly">
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Adenium" color="Pink" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-pink-400">
                      {playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Citrillus" color="Green" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-green-400">
                      {playerGoesFirst ? '3' : '4'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Korrigan" color="Black" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent
                      type="Pachypodium"
                      color="Black"
                    />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">
                      {playerGoesFirst ? '2' : '3'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="aspect-2/3 w-6">
                    <MandragoraPieceComponent type="Mandragora" color="White" />
                  </div>
                  {gameStarted && (
                    <span className="mt-1 font-bold text-white">1</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {moveAnalysis.length > 0 && (
          <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-4">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Move Analysis
            </h3>
            <div className="space-y-2">
              {moveAnalysis.map(analysis => (
                <div
                  key={analysis.areaId}
                  className="rounded border border-slate-600 bg-slate-700 p-3"
                >
                  <p className="text-white">
                    <span className="font-semibold">
                      Total Value: {analysis.totalValue.toFixed(1)}
                    </span>
                    <span className="mx-2">|</span>
                    {analysis.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="mt-8 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-8 text-center text-white backdrop-blur-sm"
        >
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
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;
