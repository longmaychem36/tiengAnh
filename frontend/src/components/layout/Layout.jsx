import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout() {
  const { pathname } = useLocation();
  const isFocusRoute = useMemo(
    () => /^\/(speaking|writing|listening|reading)\/(?:lessons|personalized)\/[^/]+/.test(pathname)
      || /^\/games\/play\/[^/]+/.test(pathname),
    [pathname]
  );

  useEffect(() => {
    document.body.classList.toggle('lesson-focus-mode', isFocusRoute);
    return () => document.body.classList.remove('lesson-focus-mode');
  }, [isFocusRoute]);

  return (
    <div className={`app-layout ${isFocusRoute ? 'is-focus-mode' : ''}`}>
      {!isFocusRoute && <Sidebar />}
      <div className="app-main">
        {!isFocusRoute && <Navbar />}
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
