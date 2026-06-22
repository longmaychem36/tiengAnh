import { Outlet, Navigate } from 'react-router-dom';
import { FiChevronDown, FiSearch, FiStar } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import Loading from '../common/Loading';

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <nav className="admin-navbar">
          <div className="admin-navbar-heading">
            <span className="admin-navbar-title">Simple Dashboard</span>
          </div>

          <label className="admin-navbar-search">
            <FiSearch />
            <input aria-label="Search admin" placeholder="Search" />
          </label>

          <div className="admin-user-summary">
            <span className="admin-star-button">
              <FiStar />
              Star
              <b>1</b>
            </span>
            <button type="button" className="admin-user-button">
              Hello, {user?.username || 'Admin'}
              <FiChevronDown />
            </button>
          </div>
        </nav>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
