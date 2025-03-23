import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import JobList from "./components/JobList";
import Interview from "./components/Interview";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/interview/:jobId" element={<Interview />} />
      </Routes>
    </Router>
  );
};

export default App;
