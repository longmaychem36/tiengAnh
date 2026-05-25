import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { stopAllPlayback } from './utils/audioControl';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Dictionary from './pages/Dictionary';
import Collections from './pages/Collections';
import Games from './pages/Games';
import GamePlay from './pages/GamePlay';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import NotFound from './pages/NotFound';
import Grammar from './pages/Grammar';
import CoursesHub from './pages/CoursesHub';
import SkillCourse from './pages/SkillCourse';

// New Speaking Module
import SpeakingList from './components/speaking/SpeakingList';
import SpeakingLesson from './components/speaking/SpeakingLesson';
import SpeakingOptions from './components/speaking/SpeakingOptions';
import SpeakingAiBuilder from './components/speaking/SpeakingAiBuilder';
import WritingList from './components/writing/WritingList';
import WritingLesson from './components/writing/WritingLesson';
import ListeningList from './components/listening/ListeningList';
import ListeningLesson from './components/listening/ListeningLesson';
import ReadingList from './components/reading/ReadingList';
import ReadingLesson from './components/reading/ReadingLesson';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGames from './pages/admin/AdminGames';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSpeaking from './pages/admin/AdminSpeaking';
import AdminWriting from './pages/admin/AdminWriting';
import AdminGrammar from './pages/admin/AdminGrammar';
import AdminReceptive from './pages/admin/AdminReceptive';

function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  useEffect(() => {
    stopAllPlayback();
  }, [pathname]);

  useEffect(() => {
    const stopWhenHidden = () => {
      if (document.hidden) stopAllPlayback();
    };

    document.addEventListener('visibilitychange', stopWhenHidden);
    window.addEventListener('pagehide', stopAllPlayback);

    return () => {
      document.removeEventListener('visibilitychange', stopWhenHidden);
      window.removeEventListener('pagehide', stopAllPlayback);
      stopAllPlayback();
    };
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Login />} />
      <Route path="/register" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Register />} />

      {/* Learning routes - regular learners only */}
      <Route element={<ProtectedRoute learnerOnly><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesHub />} />
        <Route path="/skill/:type" element={<SkillCourse />} />
        
        {/* Speaking & Writing Module */}
        <Route path="/speaking/options" element={<SpeakingOptions />} />
        <Route path="/speaking/ai" element={<SpeakingAiBuilder />} />
        <Route path="/speaking/lessons" element={<SpeakingList />} />
        <Route path="/speaking/lessons/:id" element={<SpeakingLesson />} />
        <Route path="/speaking/personalized/:sessionId" element={<SpeakingLesson />} />
        <Route path="/writing/lessons" element={<WritingList />} />
        <Route path="/writing/lessons/:id" element={<WritingLesson />} />
        <Route path="/listening/lessons" element={<ListeningList />} />
        <Route path="/listening/lessons/:id" element={<ListeningLesson />} />
        <Route path="/reading/lessons" element={<ReadingList />} />
        <Route path="/reading/lessons/:id" element={<ReadingLesson />} />
        
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/play/:levelId" element={<GamePlay />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/grammar" element={<Grammar />} />
      </Route>

      {/* Admin routes — separate AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/speaking" element={<AdminSpeaking />} />
        <Route path="/admin/writing" element={<AdminWriting />} />
        <Route path="/admin/listening" element={<AdminReceptive skill="listening" />} />
        <Route path="/admin/reading" element={<AdminReceptive skill="reading" />} />
        <Route path="/admin/grammar" element={<AdminGrammar />} />
        <Route path="/admin/games" element={<AdminGames />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
