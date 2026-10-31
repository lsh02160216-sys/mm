/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameStats, Direction } from './types/game';
import { GameCanvas } from './game/GameCanvas';
import { HUD } from './components/HUD';
import { TitleScreen } from './components/TitleScreen';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { VirtualControls } from './components/VirtualControls';
import { sound } from './utils/sound';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [virtualDir, setVirtualDir] = useState<Direction | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('hanok_ghost_high_score') || 0);
    } catch {
      return 0;
    }
  });

  const [currentStats, setCurrentStats] = useState<GameStats>({
    lives: 3,
    maxLives: 3,
    applesCollected: 0,
    targetApples: 5,
    peppersEaten: 0,
    ghostCount: 2,
    elapsedTime: 0,
    score: 0,
    isSpicyActive: false,
    spicyPercent: 0,
  });

  // Start game action
  const handleStartGame = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  // Victory action
  const handleVictory = useCallback((stats: GameStats) => {
    setGameState('VICTORY');
    setCurrentStats(stats);
    // Save high score based on speed and remaining lives
    const calculatedScore = Math.max(100, Math.floor(2000 - stats.elapsedTime * 15 + stats.lives * 300));
    setHighScore((prev) => {
      const best = Math.max(prev, calculatedScore);
      try {
        localStorage.setItem('hanok_ghost_high_score', best.toString());
      } catch {
        // Ignore
      }
      return best;
    });
  }, []);

  // Game over action
  const handleGameOver = useCallback((stats: GameStats) => {
    setGameState('GAME_OVER');
    setCurrentStats(stats);
  }, []);

  // Toggle mute
  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Toggle pause
  const handleTogglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  }, [gameState]);

  // Restart to playing
  const handleRestart = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  // Keyboard shortcut listener for Space/Enter on Title and Escape for Pause
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'PLAYING') {
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          setGameState('PLAYING');
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (gameState === 'TITLE') {
          handleStartGame();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameState, handleStartGame]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center select-none font-sans">
      {/* Title Screen View */}
      {gameState === 'TITLE' && (
        <TitleScreen onStart={handleStartGame} highScore={highScore} />
      )}

      {/* Active Game Canvas View */}
      {gameState !== 'TITLE' && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <GameCanvas
            isPlaying={gameState === 'PLAYING' || gameState === 'PAUSED'}
            isPaused={gameState === 'PAUSED'}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            onStatsUpdate={setCurrentStats}
            virtualDirection={virtualDir}
          />

          {/* Low-Occlusion HUD Overlay */}
          <HUD
            stats={currentStats}
            isMuted={isMuted}
            isPaused={gameState === 'PAUSED'}
            onToggleMute={handleToggleMute}
            onTogglePause={handleTogglePause}
          />

          {/* Virtual D-pad for touch / mobile */}
          <VirtualControls onDirectionChange={(dir) => setVirtualDir(dir)} />

          {/* Pause Modal */}
          {gameState === 'PAUSED' && (
            <PauseModal onResume={() => setGameState('PLAYING')} onRestart={handleRestart} />
          )}

          {/* Victory Modal */}
          {gameState === 'VICTORY' && (
            <VictoryModal stats={currentStats} onRestart={handleRestart} />
          )}

          {/* Game Over Modal */}
          {gameState === 'GAME_OVER' && (
            <GameOverModal stats={currentStats} onRestart={handleRestart} />
          )}
        </div>
      )}
    </div>
  );
}
