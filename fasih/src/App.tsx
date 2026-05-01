import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/ui/Header';
import { HomeScreen } from './components/screens/HomeScreen';
import { PuzzleScreen } from './components/screens/PuzzleScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { StatsScreen } from './components/screens/StatsScreen';

function AppShell() {
  const { state } = useGame();

  return (
    <div className="min-h-dvh flex flex-col safe-top safe-bottom">
      <Header />
      <main className="flex-1 flex flex-col">
        {state.screen === 'home' && <HomeScreen />}
        {state.screen === 'puzzle' && <PuzzleScreen />}
        {state.screen === 'result' && <ResultScreen />}
      </main>
      {state.screen === 'stats' && <StatsScreen />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}
