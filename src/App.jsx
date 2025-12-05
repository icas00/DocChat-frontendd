import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssistantJourneyPage from './pages/AssistantJourneyPage';
import TestClientPage from './pages/TestClientPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssistantJourneyPage />} />
        <Route path="/test-client" element={<TestClientPage />} />
      </Routes>
    </Router>
  );
}

export default App;
