import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLayout from './layouts/AdminLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Components
import LocationPermissionModal from './components/LocationPermissionModal';

// Pages
import Dashboard from './pages/Dashboard';
import PollutionMap from './pages/PollutionMap';
import Compliance from './pages/Compliance';
import Alerts from './pages/Alerts';
import AIAssistant from './pages/AIAssistant';
import MyComplaints from './pages/MyComplaints';
import FileComplaint from './pages/FileComplaint';
import InvestigationDetail from './pages/InvestigationDetail';
import ComplaintDetails from './pages/ComplaintDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import CitizenRegister from './pages/CitizenRegister';
import DummyPage from './pages/DummyPage';

// Stores
import { usePollutionStore } from './store/usePollutionStore';
import { useComplaintStore } from './store/useComplaintStore';
import { useAppStore } from './store/useAppStore';

function App() {
  const simulatePollution = usePollutionStore(state => state.simulatePollution);
  const simulateStatusUpdates = useComplaintStore(state => state.simulateStatusUpdates);
  const initTheme = useAppStore(state => state.initTheme);

  useEffect(() => {
    initTheme();
    // Real-time Simulation Engine
    const pollutionInterval = setInterval(() => {
      simulatePollution();
    }, 10000); // 10s

    const complaintInterval = setInterval(() => {
      simulateStatusUpdates();
    }, 20000); // 20s

    return () => {
      clearInterval(pollutionInterval);
      clearInterval(complaintInterval);
    };
  }, [simulatePollution, simulateStatusUpdates]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CitizenRegister />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<PollutionMap isAdmin={true} />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="investigation/:id" element={<InvestigationDetail />} />
            <Route path="awareness" element={<DummyPage title="Awareness & Data" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<DummyPage title="Notifications" />} />
          </Route>

          {/* Citizen Routes */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route path="map" element={<PollutionMap />} />
            <Route path="file-complaint" element={<FileComplaint />} />
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="complaint/:id" element={<ComplaintDetails />} />
            <Route path="awareness" element={<DummyPage title="Awareness & Data" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<DummyPage title="Notifications" />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
          </Route>
        </Routes>
      </Router>
      <LocationPermissionModal />
    </>
  );
}

export default App;
