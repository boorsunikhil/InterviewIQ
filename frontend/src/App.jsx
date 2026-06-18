import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useAuthStore from "./store/AuthStore";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import InterviewSessionInner from "./pages/InterviewSessionInner";
import PastSession from "./components/PastSession";
import History from "./pages/HistoryPage";
import AboutUs from "./pages/AboutUs";


export default function App() {

  const { checkAuth, isAuthenticated, isLoading,user } = useAuthStore();

  // On first load — check if user has a valid session
  useEffect(() => {
    checkAuth();
  }, []); // runs once when app starts

  // Show full-page spinner while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-ring loading-lg text-primary" />
          <p className="text-base-content/40 text-sm font-mono">
            Checking session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public — Auth page */}
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <AuthPage />} />

      {/* Protected routes — need login */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session/:sessionId"
        element={
          <ProtectedRoute>
            <InterviewSessionInner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
       <Route
        path="/history/:id"
        element={
          <ProtectedRoute>
            <PastSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aboutUs"
        element={
          <ProtectedRoute>
            <AboutUs   />
          </ProtectedRoute>
        }
      />

      {/* Fallback — redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

}