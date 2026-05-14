import { Routes, Route, Navigate } from 'react-router-dom';
import PageShell from './components/PageShell.jsx';
import { ConfirmProvider } from './components/ConfirmProvider.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';
import HomePage from './pages/HomePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import AudioPage from './pages/AudioPage.jsx';

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <PageShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/historial" element={<HistoryPage />} />
            <Route path="/estadisticas" element={<StatsPage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageShell>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
