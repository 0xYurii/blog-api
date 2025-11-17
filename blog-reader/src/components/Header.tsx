// Header component for blog-reader

import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>My Blog</h1>
        </Link>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
