import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import LibraryPage from './pages/LibraryPage';
import StrategyDetailPage from './pages/StrategyDetailPage';
import EdgesPage from './pages/EdgesPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<OnboardingPage />} />
        <Route path="/dashboard"           element={<DashboardPage />} />
        <Route path="/library"             element={<LibraryPage />} />
        <Route path="/strategy/:id"        element={<StrategyDetailPage />} />
        <Route path="/edges"               element={<EdgesPage />} />
        <Route path="/settings"            element={<SettingsPage />} />
        <Route path="*"                    element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
