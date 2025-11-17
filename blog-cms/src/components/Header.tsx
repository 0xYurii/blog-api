// Header component for CMS

import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/dashboard" className="logo">
          <h1>Blog CMS</h1>
        </Link>
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/posts/new">New Post</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
