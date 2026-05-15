import { Routes, Route, Navigate } from 'react-router-dom';
import PageShell from './components/PageShell.jsx';
import { ConfirmProvider } from './components/ConfirmProvider.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';
import { MediaProvider } from './components/MediaProvider.jsx';
import HomePage from './pages/HomePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import AudioPage from './pages/AudioPage.jsx';
import TVPage from './tv/pages/TVPage.tsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <MediaProvider>
          <PageShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/historial" element={<HistoryPage />} />
              <Route path="/estadisticas" element={<StatsPage />} />
              <Route path="/audio" element={<AudioPage />} />
              <Route path="/tv" element={<TVPage />} />
              <Route path="/ajustes" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageShell>
        </MediaProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
