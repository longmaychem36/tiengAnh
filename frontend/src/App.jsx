import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import LessonPage from './pages/LessonPage';
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
import WritingList from './components/writing/WritingList';
import WritingLesson from './components/writing/WritingLesson';

// Admin pages
import AdminCourses from './pages/admin/AdminCourses';
import AdminLessons from './pages/admin/AdminLessons';
import AdminGames from './pages/admin/AdminGames';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const isSuperAdmin = user && user.role === 'superadmin';

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected routes — wrapped in Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesHub />} />
        <Route path="/skill/:type" element={<SkillCourse />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        
        {/* Speaking & Writing Module */}
        <Route path="/speaking/lessons" element={<SpeakingList />} />
        <Route path="/speaking/lessons/:id" element={<SpeakingLesson />} />
        <Route path="/writing/lessons" element={<WritingList />} />
        <Route path="/writing/lessons/:id" element={<WritingLesson />} />
        
        <Route path="/lessons/:id" element={<LessonPage />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/play/:levelId" element={<GamePlay />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/grammar" element={<Grammar />} />
        
        {/* Admin routes (admin + superadmin) */}
        {isAdmin && (
          <>
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/:courseId/lessons" element={<AdminLessons />} />
            <Route path="/admin/games" element={<AdminGames />} />
          </>
        )}

        {/* SuperAdmin routes */}
        {isSuperAdmin && (
          <>
            <Route path="/admin/users" element={<AdminUsers />} />
          </>
        )}
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
