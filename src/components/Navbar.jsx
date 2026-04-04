import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth.js';

const CATEGORIES = ['All', 'Tools', 'Funding', 'Open Source', 'AI', 'Community', 'SaaS'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/feed" className="navbar__logo">
          The <span>Commit</span>
        </Link>

        <div className="navbar__cats">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={cat === 'All' ? '/feed' : `/feed?category=${cat}`}
              className={`navbar__cat ${activeCategory === cat ? 'navbar__cat--active' : ''}`}
            >
              {cat}
            </Link>
          ))}
          <Link
            to="/digest"
            className="navbar__cat"
            style={{ color: 'var(--accent)', fontWeight: 600 }}
          >
            ⚡ Daily Digest
          </Link>
        </div>

        <div className="navbar__actions">
          {user && (
            <span className="navbar__user">
              {user.email?.split('@')[0]}
            </span>
          )}
          <button className="btn-text" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
