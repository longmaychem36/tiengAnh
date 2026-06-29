import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import PlusRoute from './components/common/PlusRoute';
import { stopAllPlayback } from './utils/audioControl';
import { installSoundEffects } from './utils/soundEffects';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Dictionary from './pages/Dictionary';
import Collections from './pages/Collections';
import Games from './pages/Games';
import GamePlay from './pages/GamePlay';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Grammar from './pages/Grammar';
import CoursesHub from './pages/CoursesHub';
import SkillCourse from './pages/SkillCourse';
import DailyTasks from './pages/DailyTasks';
import Onboarding from './pages/Onboarding';
import Support from './pages/Support';

// New Speaking Module
import SpeakingList from './components/speaking/SpeakingList';
import SpeakingLesson from './components/speaking/SpeakingLesson';
import SpeakingOptions from './components/speaking/SpeakingOptions';
import SpeakingAiBuilder from './components/speaking/SpeakingAiBuilder';
import SpeakingConversation from './components/speaking/SpeakingConversation';
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
import AdminLearnerDetail from './pages/admin/AdminLearnerDetail';
import AdminSpeaking from './pages/admin/AdminSpeaking';
import AdminWriting from './pages/admin/AdminWriting';
import AdminGrammar from './pages/admin/AdminGrammar';
import AdminReceptive from './pages/admin/AdminReceptive';
import AdminVocabulary from './pages/admin/AdminVocabulary';
import AdminSupport from './pages/admin/AdminSupport';
import AdminNotifications from './pages/admin/AdminNotifications';

function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    stopAllPlayback();
  }, [pathname]);

  useEffect(() => installSoundEffects(), []);

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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to={user.onboardingCompleted === false ? '/onboarding' : '/dashboard'} />) : <Login />} />
      <Route path="/register" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to={user.onboardingCompleted === false ? '/onboarding' : '/dashboard'} />) : <Register />} />
      <Route path="/forgot-password" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to={user.onboardingCompleted === false ? '/onboarding' : '/dashboard'} />) : <ForgotPassword />} />

      <Route path="/onboarding" element={<ProtectedRoute learnerOnly><Onboarding /></ProtectedRoute>} />

      {/* Learning routes - regular learners only */}
      <Route element={<ProtectedRoute learnerOnly><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesHub />} />
        <Route path="/daily-tasks" element={<DailyTasks />} />
        <Route path="/skill/:type" element={<SkillCourse />} />
        
        {/* Speaking & Writing Module */}
        <Route path="/speaking/options" element={<PlusRoute featureName="Speaking"><SpeakingOptions /></PlusRoute>} />
        <Route path="/speaking/ai" element={<PlusRoute featureName="Speaking AI"><SpeakingAiBuilder /></PlusRoute>} />
        <Route path="/speaking/lessons" element={<PlusRoute featureName="Speaking"><SpeakingList /></PlusRoute>} />
        <Route path="/speaking/lessons/:id" element={<PlusRoute featureName="Speaking"><SpeakingLesson /></PlusRoute>} />
        <Route path="/speaking/personalized/:sessionId" element={<PlusRoute featureName="Speaking AI"><SpeakingConversation /></PlusRoute>} />
        <Route path="/writing/lessons" element={<WritingList />} />
        <Route path="/writing/lessons/:id" element={<WritingLesson />} />
        <Route path="/listening/lessons" element={<PlusRoute featureName="Listening"><ListeningList /></PlusRoute>} />
        <Route path="/listening/lessons/:id" element={<PlusRoute featureName="Listening"><ListeningLesson /></PlusRoute>} />
        <Route path="/reading/lessons" element={<ReadingList />} />
        <Route path="/reading/lessons/:id" element={<ReadingLesson />} />
        
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/vocabulary" element={<Collections />} />
        <Route path="/collections" element={<Navigate to="/vocabulary" replace />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/play/:levelId" element={<GamePlay />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/progress" element={<Navigate to="/profile" replace />} />
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
        <Route path="/admin/vocabulary" element={<AdminVocabulary />} />
        <Route path="/admin/games" element={<AdminGames />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:id" element={<AdminLearnerDetail />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/support" element={<AdminSupport />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

