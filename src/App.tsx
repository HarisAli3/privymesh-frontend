import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeTheme } from '@/hooks/use-appearance';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from '@/pages/landing';
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import Register from '@/pages/register';
import AuthCallback from '@/pages/auth-callback';
import SilentCallback from '@/pages/silent-callback';
import Peers from '@/pages/peers';
import AddPeer from '@/pages/add-peer';
import PeerDetail from '@/pages/peer-detail';
import EditPeer from '@/pages/edit-peer';
import Settings from '@/pages/settings';

// Initialize theme on app start
initializeTheme();

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/peers" element={
              <ProtectedRoute>
                <Peers />
              </ProtectedRoute>
            } />
            <Route path="/peers/add" element={
              <ProtectedRoute>
                <AddPeer />
              </ProtectedRoute>
            } />
            <Route path="/peers/:peerId" element={
              <ProtectedRoute>
                <PeerDetail />
              </ProtectedRoute>
            } />
            <Route path="/peers/:peerId/edit" element={
              <ProtectedRoute>
                <EditPeer />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pm-auth" element={<AuthCallback />} />
            <Route path="/pm-silent-auth" element={<SilentCallback />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
