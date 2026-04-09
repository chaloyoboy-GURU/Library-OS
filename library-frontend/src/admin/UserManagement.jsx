import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService.js';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    adminService.getAllUsers()
        .then(res => setUsers(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await adminService.updateUserRole(id, newRole);
      setMessage({ text: 'Role updated successfully', type: 'success' });
      fetchUsers();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to update role', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setMessage({ text: 'User deleted successfully', type: 'success' });
      fetchUsers();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to delete user', type: 'error' });
    }
  };

  const getRoleBadgeStyle = (role) => {
    const colors = {
      ADMIN: { bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.5)', color: '#d4af37' },
      LIBRARIAN: { bg: 'rgba(46,204,113,0.15)', border: 'rgba(46,204,113,0.5)', color: '#2ecc71' },
      STUDENT: { bg: 'rgba(52,152,219,0.15)', border: 'rgba(52,152,219,0.5)', color: '#3498db' }
    };
    return colors[role] || colors.STUDENT;
  };

  if (loading) return <div style={styles.container}><p style={styles.loading}>Loading...</p></div>;

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>👥 User Management</h2>
          <p style={styles.subtitle}>Manage roles and permissions</p>
        </div>

        {message.text && (
            <div style={message.type === 'success' ? styles.success : styles.error}>
              {message.text}
            </div>
        )}

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
            <tr>
              {['ID', 'Name', 'Email', 'Role', 'Change Role', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {users.map((user, i) => {
              const badge = getRoleBadgeStyle(user.role);
              return (
                  <tr key={user.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>{user.firstName} {user.lastName}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                    <span style={{ ...styles.badge, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                      {user.role}
                    </span>
                    </td>
                    <td style={styles.td}>
                      <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={styles.select}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="LIBRARIAN">LIBRARIAN</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(user.id)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
  );
}

const styles = {
  container: {
    padding: '2.5rem',
    maxWidth: '1100px',
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
  success: {
    background: 'rgba(46,204,113,0.15)',
    border: '1px solid rgba(46,204,113,0.4)',
    color: '#2ecc71',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem'
  },
  error: {
    background: 'rgba(220,53,69,0.15)',
    border: '1px solid rgba(220,53,69,0.4)',
    color: '#ff6b7a',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem'
  },
  tableWrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(212,175,55,0.2)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    background: 'linear-gradient(135deg, #b8962e, #d4af37)',
    color: '#1a1a2e',
    padding: '1rem',
    textAlign: 'left',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  rowEven: { background: 'rgba(255,255,255,0.03)' },
  rowOdd: { background: 'rgba(255,255,255,0.06)' },
  td: {
    padding: '0.9rem 1rem',
    color: '#e0e0e0',
    borderBottom: '1px solid rgba(212,175,55,0.08)',
    fontSize: '0.95rem'
  },
  badge: {
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  select: {
    padding: '0.4rem 0.75rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '6px',
    color: '#e0e0e0',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '0.4rem 0.9rem',
    background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    boxShadow: '0 2px 8px rgba(231,76,60,0.3)'
  }
};

export default UserManagement;