// ============================================
// Layout Component — Main App Shell
// ============================================
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
