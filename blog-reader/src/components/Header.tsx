// Header component for blog-reader

import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>My Blog</h1>
        </Link>
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
