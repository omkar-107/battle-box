import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Swords } from 'lucide-react';

const BattleGame = () => {
  const INITIAL_HEALTH = 100;
  const DAMAGE = 10;
  const SPEED = 5;
  const MIN_SIZE = 30;
  const INITIAL_SIZE = 100;
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const HEALTH_BOOST = 20; 
  const initialGameState = {
    player1: {
      x: 100,
      y: 100,
      direction: { x: 1, y: 0 },
      health: INITIAL_HEALTH,
      size: INITIAL_SIZE,
      stripes: 'vertical'
    },
    player2: {
      x: 600,
      y: 400,
      direction: { x: -1, y: 0 },
      health: INITIAL_HEALTH,
      size: INITIAL_SIZE,
      stripes: 'vertical'
    }
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [player1, setPlayer1] = useState(initialGameState.player1);
  const [player2, setPlayer2] = useState(initialGameState.player2);
  const [sphere, setSphere] = useState({ x: Math.random() * (GAME_WIDTH - 20), y: Math.random() * (GAME_HEIGHT - 20) });

  const getSize = (health) => {
    return Math.max(MIN_SIZE, (health / INITIAL_HEALTH) * INITIAL_SIZE);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setWinner(null);
    setPlayer1(initialGameState.player1);
    setPlayer2(initialGameState.player2);
    setSphere({ x: Math.random() * (GAME_WIDTH - 20), y: Math.random() * (GAME_HEIGHT - 20) });
  };

  const startGame = useCallback(() => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
    }
  }, [gameStarted, gameOver]);

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();

    if (key === ' ') {
      if (gameOver) {
        resetGame();
      } else {
        startGame();
      }
      return;
    }

    if (!gameStarted || gameOver) return;

    if (key === 'w') setPlayer1(p => ({ ...p, direction: { x: 0, y: -1 }, stripes: 'horizontal' }));
    if (key === 's') setPlayer1(p => ({ ...p, direction: { x: 0, y: 1 }, stripes: 'horizontal' }));
    if (key === 'a') setPlayer1(p => ({ ...p, direction: { x: -1, y: 0 }, stripes: 'vertical' }));
    if (key === 'd') setPlayer1(p => ({ ...p, direction: { x: 1, y: 0 }, stripes: 'vertical' }));

    if (key === 'arrowup') setPlayer2(p => ({ ...p, direction: { x: 0, y: -1 }, stripes: 'horizontal' }));
    if (key === 'arrowdown') setPlayer2(p => ({ ...p, direction: { x: 0, y: 1 }, stripes: 'horizontal' }));
    if (key === 'arrowleft') setPlayer2(p => ({ ...p, direction: { x: -1, y: 0 }, stripes: 'vertical' }));
    if (key === 'arrowright') setPlayer2(p => ({ ...p, direction: { x: 1, y: 0 }, stripes: 'vertical' }));
  }, [gameStarted, gameOver, startGame]);

  const checkCollision = useCallback((p1, p2) => {
    const p1Right = p1.x + p1.size;
    const p1Bottom = p1.y + p1.size;
    const p2Right = p2.x + p2.size;
    const p2Bottom = p2.y + p2.size;

    if (p1.x < p2Right && p1Right > p2.x && p1.y < p2Bottom && p1Bottom > p2.y) {
      const overlapX = Math.min(p1Right, p2Right) - Math.max(p1.x, p2.x);
      const overlapY = Math.min(p1Bottom, p2Bottom) - Math.max(p1.y, p2.y);

      const isHorizontalCollision = overlapX < overlapY;

      const p1HasStripesOnCollisionSide = (isHorizontalCollision && p1.stripes === 'vertical') || 
                                        (!isHorizontalCollision && p1.stripes === 'horizontal');

      const p2HasStripesOnCollisionSide = (isHorizontalCollision && p2.stripes === 'vertical') || 
                                        (!isHorizontalCollision && p2.stripes === 'horizontal');

      if (p1HasStripesOnCollisionSide && !p2HasStripesOnCollisionSide) {
        setPlayer2(p => ({ ...p, health: Math.max(0, p.health - DAMAGE) }));
      } else if (!p1HasStripesOnCollisionSide && p2HasStripesOnCollisionSide) {
        setPlayer1(p => ({ ...p, health: Math.max(0, p.health - DAMAGE) }));
      }
    }
  }, []);

  const updatePlayerPosition = useCallback((player, setPlayer) => {
    let newDirection = { ...player.direction };
    let newX = player.x + player.direction.x * SPEED;
    let newY = player.y + player.direction.y * SPEED;
    let newStripes = player.stripes;

    if (newX <= 0 || newX >= GAME_WIDTH - player.size) {
      newDirection.x *= -1;
      newStripes = 'vertical';
    }
    if (newY <= 0 || newY >= GAME_HEIGHT - player.size) {
      newDirection.y *= -1;
      newStripes = 'horizontal';
    }

    newX = Math.max(0, Math.min(newX, GAME_WIDTH - player.size));
    newY = Math.max(0, Math.min(newY, GAME_HEIGHT - player.size));

    setPlayer(p => ({
      ...p,
      x: newX,
      y: newY,
      direction: newDirection,
      stripes: newStripes,
      size: getSize(p.health)
    }));
  }, []);

  const checkSphereCollision = useCallback((player, setPlayer) => {
    const playerCenterX = player.x + player.size / 2;
    const playerCenterY = player.y + player.size / 2;
    const sphereCenterX = sphere.x + 10;
    const sphereCenterY = sphere.y + 10;

    const distance = Math.sqrt(
      Math.pow(playerCenterX - sphereCenterX, 2) + Math.pow(playerCenterY - sphereCenterY, 2)
    );

    if (distance < player.size / 2 + 10) {
      setPlayer(p => ({ ...p, health: Math.min(INITIAL_HEALTH, p.health + HEALTH_BOOST) }));
      setSphere({ x: Math.random() * (GAME_WIDTH - 20), y: Math.random() * (GAME_HEIGHT - 20) });
    }
  }, [sphere]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      if (gameOver) return;

      updatePlayerPosition(player1, setPlayer1);
      updatePlayerPosition(player2, setPlayer2);
      checkCollision(player1, player2);
      checkSphereCollision(player1, setPlayer1);
      checkSphereCollision(player2, setPlayer2);

      if (player1.health <= 0) {
        setGameOver(true);
        setWinner('Player 2');
      } else if (player2.health <= 0) {
        setGameOver(true);
        setWinner('Player 1');
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [player1, player2, checkCollision, checkSphereCollision, gameStarted, gameOver, updatePlayerPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="relative w-[800px] h-[600px] mx-auto my-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-1 shadow-lg shadow-blue-500/50">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]" />

            <div
              className="absolute transition-transform duration-100"
              style={{
                width: player1.size,
                height: player1.size,
                transform: `translate(${player1.x}px, ${player1.y}px)`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg relative">
                {player1.stripes === 'horizontal' && (
                  <>
                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-lg" />
                    <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-lg" />
                  </>
                )}
                {player1.stripes === 'vertical' && (
                  <>
                    <div className="absolute left-0 w-2 h-full bg-gradient-to-b from-red-600 to-red-400 rounded-lg" />
                    <div className="absolute right-0 w-2 h-full bg-gradient-to-b from-red-600 to-red-400 rounded-lg" />
                  </>
                )}
              </div>
            </div>

            <div
              className="absolute transition-transform duration-100"
              style={{
                width: player2.size,
                height: player2.size,
                transform: `translate(${player2.x}px, ${player2.y}px)`,
              }}
            >
              <div className="w-full rou h-full bg-gradient-to-br from-amber-500 to-orange-700 rounded-lg shadow-lg relative">
                {player2.stripes === 'horizontal' && (
                  <>
                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-lg" />
                    <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400v rounded-lg" />
                  </>
                )}
                {player2.stripes === 'vertical' && (
                  <>
                    <div className="absolute left-0 w-2 h-full bg-gradient-to-b from-red-600 to-red-400 rounded-lg" />
                    <div className="absolute right-0 w-2 h-full bg-gradient-to-b from-red-600 to-red-400 rounded-lg" />
                  </>
                )}
              </div>
            </div>

            {/* Blue Sphere */}
            <div
              className="absolute w-5 h-5 bg-blue-500 rounded-full"
              style={{
                transform: `translate(${sphere.x}px, ${sphere.y}px)`
              }}
            />

            <div className="absolute top-4 left-4 w-48">
              <div className="text-emerald-400 text-sm font-bold mb-1">Player 1</div>
              <div className="h-4 bg-gray-800 rounded-full border border-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-200"
                  style={{ width: `${player1.health}%` }}
                />
              </div>
            </div>
            <div className="absolute top-4 right-4 w-48">
              <div className="text-amber-500 text-sm font-bold mb-1 text-right">Player 2</div>
              <div className="h-4 bg-gray-800 rounded-full border border-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-200"
                  style={{ width: `${player2.health}%` }}
                />
              </div>
            </div>

            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="text-6xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-extrabold">
                  Battle Game
                </div>
                <Swords className="w-16 h-16 text-blue-400 mb-8 animate-pulse" />
                <div className="text-white text-xl mb-8 font-light">
                  Press SPACE to start
                </div>
                <div className="flex gap-8 text-gray-400 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-emerald-400 mb-2">Player 1</div>
                    <div>WASD Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-amber-500 mb-2">Player 2</div>
                    <div>Arrow Keys</div>
                  </div>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center">
                <Shield className="w-16 h-16 text-purple-400 mb-4" />
                <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {winner} Wins!
                </div>
                <div className="text-gray-400 mb-8">
                  Press SPACE to play again
                </div>
              </div>
            )}

            {gameStarted && !gameOver && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 text-gray-600 text-sm">
                <div>Player 1: WASD</div>
                <div>Player 2: Arrow Keys</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleGame;
