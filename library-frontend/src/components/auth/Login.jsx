import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/books');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>📚</div>
          <h2 style={styles.title}>LibraryOS</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={styles.text}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.linkText}>Register here</Link>
          </p>
        </div>
      </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
  },
  card: {
    background: 'linear-gradient(145deg, #1e1e3a, #16213e)',
    border: '1px solid rgba(212,175,55,0.3)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.1)',
    padding: '3rem 2.5rem',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center'
  },
  logo: {
    fontSize: '3rem',
    marginBottom: '0.5rem'
  },
  title: {
    color: '#d4af37',
    fontFamily: 'Georgia, serif',
    fontSize: '2rem',
    margin: '0 0 0.25rem 0',
    textShadow: '0 0 20px rgba(212,175,55,0.3)'
  },
  subtitle: {
    color: '#888',
    fontSize: '0.9rem',
    marginBottom: '2rem',
    fontStyle: 'italic'
  },
  error: {
    backgroundColor: 'rgba(220,53,69,0.15)',
    border: '1px solid rgba(220,53,69,0.4)',
    color: '#ff6b7a',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    textAlign: 'left'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    color: '#d4af37',
    fontSize: '0.85rem',
    letterSpacing: '0.5px',
    fontFamily: 'Georgia, serif'
  },
  input: {
    padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#e0e0e0',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '1px',
    fontFamily: 'Georgia, serif',
    boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
  },
  text: {
    marginTop: '1.5rem',
    color: '#888',
    fontSize: '0.9rem'
  },
  linkText: {
    color: '#d4af37',
    textDecoration: 'none'
  }
};

export default Login;