import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = (name) => ({
    color: hoveredLink === name ? '#f0d060' : 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    fontFamily: 'Georgia, serif',
    transform: hoveredLink === name ? 'translateY(-1px)' : 'translateY(0)',
    display: 'inline-block'
  });

  return (
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <Link to="/" style={styles.brandLink}>📚 LibraryOS</Link>
        </div>
        <div style={styles.menu}>
          {user ? (
              <>
                {['Books', 'My Borrows'].map(name => (
                    <Link
                        key={name}
                        to={name === 'Books' ? '/books' : '/my-borrows'}
                        style={linkStyle(name)}
                        onMouseEnter={() => setHoveredLink(name)}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                      {name}
                    </Link>
                ))}
                {user.role === 'ADMIN' && (
                    <Link
                        to="/admin/dashboard"
                        style={{
                          ...linkStyle('Admin'),
                          color: hoveredLink === 'Admin' ? '#f0d060' : '#d4af37',
                          border: '1px solid rgba(212,175,55,0.4)',
                        }}
                        onMouseEnter={() => setHoveredLink('Admin')}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                      ⚙ Admin
                    </Link>
                )}
                <span style={styles.username}>Hello, {user.firstName}</span>
                <button
                    onClick={toggleTheme}
                    style={styles.themeBtn}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <button
                    onClick={handleLogout}
                    style={styles.logoutBtn}
                    onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                >
                  Logout
                </button>
              </>
          ) : (
              <>
                {['Login', 'Register'].map(name => (
                    <Link
                        key={name}
                        to={`/${name.toLowerCase()}`}
                        style={linkStyle(name)}
                        onMouseEnter={() => setHoveredLink(name)}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                      {name}
                    </Link>
                ))}
                <button
                    onClick={toggleTheme}
                    style={styles.themeBtn}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
              </>
          )}
        </div>
      </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2.5rem',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    borderBottom: '1px solid rgba(212,175,55,0.3)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' },
  brandLink: {
    color: '#d4af37',
    textDecoration: 'none',
    fontFamily: 'Georgia, serif',
    textShadow: '0 0 10px rgba(212,175,55,0.4)',
    transition: 'all 0.2s'
  },
  menu: { display: 'flex', gap: '1rem', alignItems: 'center' },
  username: {
    color: '#d4af37',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif'
  },
  themeBtn: {
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  logoutBtn: {
    padding: '0.5rem 1.25rem',
    background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(231,76,60,0.3)',
    transition: 'all 0.2s'
  }
};

export default Navbar;