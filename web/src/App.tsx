import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import TimeTracking from './components/TimeTracking';
import UserManagement from './components/UserManagement';
import CreateUser from './components/CreateUser';
import { Auth } from './components/auth';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, login } = useApp();

  const handleAuthSuccess = (token: string) => {
    login(token);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/time-tracking" element={<TimeTracking />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/create" element={<CreateUser />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;