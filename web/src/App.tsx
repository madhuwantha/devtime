import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import TimeTracking from './components/TimeTracking';
import UserManagement from './components/UserManagement';
import CreateUser from './components/CreateUser';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;