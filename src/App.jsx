import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load non-critical routes to optimize initialization bundle size
const Predict = lazy(() => import('./pages/Predict'));
const Skills = lazy(() => import('./pages/Skills'));
const Tracker = lazy(() => import('./pages/Tracker'));
const Peers = lazy(() => import('./pages/Peers'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const VoiceInterview = lazy(() => import('./pages/VoiceInterview'));
const StudyPlan = lazy(() => import('./pages/StudyPlan'));

const Trending = lazy(() => import('./pages/Trending'));

const Referrals = lazy(() => import('./pages/Referrals'));
const SystemDesign = lazy(() => import('./pages/SystemDesign'));
const GitHubAuditor = lazy(() => import('./pages/GitHubAuditor'));
const AlgoVisualizer = lazy(() => import('./pages/AlgoVisualizer'));
const CareerQuest = lazy(() => import('./pages/CareerQuest'));

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const BlockchainLedger = lazy(() => import('./pages/BlockchainLedger'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center h-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

// Placeholder components for other pages
const Placeholder = ({ title }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-500">This feature is coming soon.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="predict" element={<Predict />} />
                <Route path="skills" element={<Skills />} />
                <Route path="tracker" element={<Tracker />} />
                <Route path="peers" element={<Peers />} />
                <Route path="resume" element={<ResumeBuilder />} />
                <Route path="interview" element={<VoiceInterview />} />
                <Route path="study-plan" element={<StudyPlan />} />

                <Route path="trending" element={<Trending />} />

                <Route path="referrals" element={<Referrals />} />
                <Route path="system-design" element={<SystemDesign />} />
                <Route path="github" element={<GitHubAuditor />} />
                <Route path="algo" element={<AlgoVisualizer />} />
                <Route path="career-quest" element={<CareerQuest />} />

                <Route path="ledger" element={<BlockchainLedger />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
