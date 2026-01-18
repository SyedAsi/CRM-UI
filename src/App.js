import logo from './logo.svg';
import './App.css';
import UserComponent from './components/UserComponent';
import HomeComponent from './components/HomeComponent';
import LoginComponent from './components/LoginComponent';
import {useState, useEffect} from 'react';
import { Routes, Route } from "react-router-dom";
import AdminDashboard from './components/AdminDashboard';
function App() {

  return (
    <div className="App">
      <Routes>
        {/* Default route shows login */}
        <Route path="/" element={<LoginComponent />} />
        {/* Dashboard route */}
        <Route path="/dashboard" element={<HomeComponent />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
