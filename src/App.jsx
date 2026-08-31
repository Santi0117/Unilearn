import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import Layout from './components/layout/Layout';
import StudentDashboard from './components/dashboard/StudentDashboard';
import ProfessorDashboard from './components/dashboard/ProfessorDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import CourseView from './components/courses/CourseView';
import CourseCard from './components/courses/CourseCard';
import NotificationsPanel from './components/notifications/NotificationsPanel';
import ProfilePage from './components/profile/ProfilePage';
import CalendarPage from './components/calendar/CalendarPage';
import UserManagement from './components/admin/UserManagement';
import CourseManagement from './components/admin/CourseManagement';
import Reports from './components/admin/Reports';
import { BookOpen } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'professor') return <ProfessorDashboard />;
  return <StudentDashboard />;
}

function CoursesListPage() {
  const { user } = useAuth();
  const { getMyCourses } = useApp();
  const courses = getMyCourses(user.id, user.role);

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 data-testid="courses-title" className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
        <span data-testid="courses-count" className="text-sm text-gray-400">{courses.length} cursos activos</span>
      </div>
      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="font-semibold text-gray-500">Sin cursos asignados</h3>
        </div>
      ) : (
        <div data-testid="courses-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}

function InnerApp() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppProvider userId={user.id} userRole={user.role}>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CoursesListPage />} />
          <Route path="/courses/:courseId" element={<CourseView />} />
          <Route path="/notifications" element={<NotificationsPanel />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/admin/users" element={user.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/courses" element={user.role === 'admin' ? <CourseManagement /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/reports" element={user.role === 'admin' ? <Reports /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </BrowserRouter>
  );
}
