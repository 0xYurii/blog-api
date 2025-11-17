// Header component for blog-reader
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>📖 My Blog</h1>
      </Link>
    </header>
  );
};

export default Header;
