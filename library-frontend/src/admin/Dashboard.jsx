import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService.js';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
        .then(res => setStats(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.container}><p style={styles.loading}>Loading...</p></div>;

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>⚙ Admin Dashboard</h2>
          <p style={styles.subtitle}>System overview and management</p>
        </div>

        <div style={styles.grid}>
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: '👥' },
            { label: 'Total Books', value: stats?.totalBooks, icon: '📚' },
            { label: 'Total Borrows', value: stats?.totalBorrows, icon: '📋' },
            { label: 'Available Books', value: stats?.availableBooks, icon: '✅' }
          ].map((item, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.cardIcon}>{item.icon}</div>
                <h3 style={styles.cardValue}>{item.value}</h3>
                <p style={styles.cardLabel}>{item.label}</p>
              </div>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>Users by Role</h3>
        <div style={styles.roleGrid}>
          {[
            { label: 'Students', value: stats?.students, color: '#3498db' },
            { label: 'Librarians', value: stats?.librarians, color: '#2ecc71' },
            { label: 'Admins', value: stats?.admins, color: '#d4af37' }
          ].map((item, i) => (
              <div key={i} style={{ ...styles.roleCard, borderColor: item.color }}>
                <h4 style={{ ...styles.roleValue, color: item.color }}>{item.value}</h4>
                <p style={styles.roleLabel}>{item.label}</p>
              </div>
          ))}
        </div>

        <Link to="/admin/users" style={styles.button}>Manage Users →</Link>
      </div>
  );
}

const styles = {
  container: {
    padding: '2.5rem',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
  },
  loading: { color: '#d4af37', fontFamily: 'Georgia, serif' },
  header: { marginBottom: '2rem' },
  title: {
    color: '#d4af37',
    fontFamily: 'Georgia, serif',
    fontSize: '2rem',
    margin: 0,
    textShadow: '0 0 20px rgba(212,175,55,0.3)'
  },
  subtitle: { color: '#888', fontStyle: 'italic', margin: '0.5rem 0 0 0' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',
    marginBottom: '2.5rem'
  },
  card: {
    background: 'linear-gradient(145deg, #1e1e3a, #16213e)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
  },
  cardIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  cardValue: { color: '#d4af37', fontSize: '2rem', margin: '0 0 0.25rem 0', fontFamily: 'Georgia, serif' },
  cardLabel: { color: '#888', fontSize: '0.85rem', margin: 0 },
  sectionTitle: {
    color: '#d4af37',
    fontFamily: 'Georgia, serif',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(212,175,55,0.2)',
    paddingBottom: '0.5rem'
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.25rem',
    marginBottom: '2.5rem'
  },
  roleCard: {
    background: 'linear-gradient(145deg, #1e1e3a, #16213e)',
    border: '1px solid',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
  },
  roleValue: { fontSize: '1.75rem', margin: '0 0 0.25rem 0', fontFamily: 'Georgia, serif' },
  roleLabel: { color: '#888', fontSize: '0.85rem', margin: 0 },
  button: {
    display: 'inline-block',
    padding: '0.9rem 2rem',
    background: 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
    color: '#1a1a2e',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
  }
};

export default Dashboard;