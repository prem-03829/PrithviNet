import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import OfficialLayout from './layouts/OfficialLayout';
import IndustryLayout from './layouts/IndustryLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Components
import LocationPermissionModal from './components/LocationPermissionModal';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import PollutionMap from './pages/PollutionMap';
import Compliance from './pages/Compliance';
import PolicyInsights from './pages/PolicyInsights';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import SubmitReport from './pages/SubmitReport';
import AIAssistant from './pages/AIAssistant';
import MyComplaints from './pages/MyComplaints';
import FileComplaint from './pages/FileComplaint';
import InvestigationDetail from './pages/InvestigationDetail';
import ComplaintDetails from './pages/ComplaintDetails';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
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
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CitizenRegister />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<PollutionMap isAdmin={true} />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="policy" element={<PolicyInsights />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="reports" element={<Reports />} />
            <Route path="investigation/:id" element={<InvestigationDetail />} />
            <Route path="awareness" element={<DummyPage title="Awareness & Data" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<DummyPage title="Notifications" />} />
          </Route>

          {/* Official Routes */}
          <Route path="/official" element={<OfficialLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<PollutionMap isAdmin={true} />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="policy" element={<PolicyInsights />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="reports" element={<Reports />} />
            <Route path="investigation/:id" element={<InvestigationDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<DummyPage title="Notifications" />} />
          </Route>

          {/* Industry Routes */}
          <Route path="/industry" element={<IndustryLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<PollutionMap isAdmin={false} />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="policy" element={<PolicyInsights />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="submit-report" element={<SubmitReport />} />
            <Route path="investigation/:id" element={<InvestigationDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
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
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<DummyPage title="Notifications" />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <LocationPermissionModal />
    </ErrorBoundary>
  );
}

export default App;
