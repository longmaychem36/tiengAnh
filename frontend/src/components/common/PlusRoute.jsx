import { Link, Navigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

function PlusRoute({ children, featureName = 'tính năng này' }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isPlus = Boolean(user?.isPlus || user?.plan === 'plus');

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  if (!isPlus) {
    return (
      <div className="plus-required-page">
        <div className="plus-required-card">
          <span className="plus-required-icon"><FiLock /></span>
          <h1>{featureName} là tính năng Plus</h1>
          <p>Nâng cấp Plus để mở khóa Listening, Speaking và bài luyện nói AI.</p>
          <div className="plus-required-actions">
            <Link className="btn btn-primary" to="/profile" state={{ from: location.pathname }}>Xem gói Plus</Link>
            <Link className="btn btn-secondary" to="/courses">Quay lại khóa học</Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default PlusRoute;
