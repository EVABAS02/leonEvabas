import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';

// Regroupe tout ce qui dépend de Firebase Auth (AuthProvider, connexion, dashboard).
// Ce fichier n'est téléchargé par le navigateur QUE si un visiteur va sur /admin
// ou /admin/login — jamais pour un visiteur public. C'est ce qui retire le SDK
// Firebase Auth (et son iframe de persistance de session) du bundle initial.
export default function AdminArea() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}