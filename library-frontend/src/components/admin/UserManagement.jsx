import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService.js';
import { useTheme } from '../context/ThemeContext.jsx';

function UserManagement() {
    const { colors } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: '', lastName: '', email: '', password: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = () => {
        adminService.getAllUsers()
            .then(res => setUsers(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await adminService.updateUserRole(id, newRole);
            showMessage('Role updated successfully');
            fetchUsers();
        } catch (err) {
            showMessage('Failed to update role', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminService.deleteUser(id);
            showMessage('User deleted successfully');
            fetchUsers();
        } catch (err) {
            showMessage('Failed to delete user', 'error');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await adminService.addUser(newUser);
            showMessage('User added successfully');
            setShowAddForm(false);
            setNewUser({ firstName: '', lastName: '', email: '', password: '' });
            fetchUsers();
        } catch (err) {
            showMessage(err.response?.data || 'Failed to add user', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            ADMIN: { bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.5)', color: '#d4af37' },
            LIBRARIAN: { bg: 'rgba(46,204,113,0.15)', border: 'rgba(46,204,113,0.5)', color: '#2ecc71' },
            STUDENT: { bg: 'rgba(52,152,219,0.15)', border: 'rgba(52,152,219,0.5)', color: '#3498db' }
        };
        return colors[role] || colors.STUDENT;
    };

    if (loading) return (
        <div style={{ ...styles.container, background: colors.bg }}>
            <p style={{ color: colors.gold, fontFamily: 'Georgia, serif' }}>Loading...</p>
        </div>
    );

    return (
        <div style={{ ...styles.container, background: colors.bg }}>
            <div style={styles.header}>
                <div>
                    <h2 style={{ color: colors.gold, fontFamily: 'Georgia, serif', fontSize: '2rem', margin: 0 }}>
                        User Management
                    </h2>
                    <p style={{ color: colors.textMuted, fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
                        {users.length} users registered
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: showAddForm
                            ? 'rgba(231,76,60,0.2)'
                            : 'linear-gradient(135deg, #b8962e, #d4af37)',
                        color: showAddForm ? '#e74c3c' : '#1a1a2e',
                        border: showAddForm ? '1px solid rgba(231,76,60,0.4)' : 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontFamily: 'Georgia, serif',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                    }}
                >
                    {showAddForm ? 'Cancel' : '+ Add User'}
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    background: message.type === 'success' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                    border: `1px solid ${message.type === 'success' ? 'rgba(46,204,113,0.4)' : 'rgba(231,76,60,0.4)'}`,
                    color: message.type === 'success' ? '#2ecc71' : '#e74c3c'
                }}>
                    {message.text}
                </div>
            )}

            {/* Add User Form */}
            {showAddForm && (
                <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: colors.shadow
                }}>
                    <h3 style={{ color: colors.gold, fontFamily: 'Georgia, serif', marginBottom: '1.5rem', marginTop: 0 }}>
                        Add New User
                    </h3>
                    <form onSubmit={handleAddUser}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            {[
                                { key: 'firstName', placeholder: 'First Name *', required: true },
                                { key: 'lastName', placeholder: 'Last Name *', required: true },
                                { key: 'email', placeholder: 'Email *', type: 'email', required: true },
                                { key: 'password', placeholder: 'Password *', type: 'password', required: true }
                            ].map(field => (
                                <input
                                    key={field.key}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    value={newUser[field.key]}
                                    onChange={e => setNewUser(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    required={field.required}
                                    style={{
                                        padding: '0.85rem 1rem',
                                        background: colors.inputBg,
                                        border: `1px solid ${colors.inputBorder}`,
                                        borderRadius: '8px',
                                        color: colors.text,
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <p style={{ color: colors.textMuted, fontSize: '0.85rem', marginBottom: '1rem' }}>
                            New users are registered as STUDENT by default. You can change their role after adding.
                        </p>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '0.85rem 2rem',
                                background: 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
                                color: '#1a1a2e',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontFamily: 'Georgia, serif',
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
                            }}
                        >
                            {submitting ? 'Adding...' : 'Add User'}
                        </button>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${colors.cardBorder}`, boxShadow: colors.shadow }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        {['ID', 'Name', 'Email', 'Current Role', 'Change Role', 'Actions'].map(h => (
                            <th key={h} style={{
                                background: 'linear-gradient(135deg, #b8962e, #d4af37)',
                                color: '#1a1a2e',
                                padding: '1rem',
                                textAlign: 'left',
                                fontFamily: 'Georgia, serif',
                                fontWeight: 'bold',
                                letterSpacing: '0.5px'
                            }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, i) => {
                        const badge = getRoleBadge(user.role);
                        return (
                            <tr
                                key={user.id}
                                style={{
                                    background: i % 2 === 0 ? colors.rowEven : colors.rowOdd,
                                    transition: 'background 0.2s'
                                }}
                            >
                                <td style={{ padding: '0.9rem 1rem', color: colors.textMuted, borderBottom: `1px solid ${colors.cardBorder}` }}>
                                    {user.id}
                                </td>
                                <td style={{ padding: '0.9rem 1rem', color: colors.text, borderBottom: `1px solid ${colors.cardBorder}`, fontWeight: '500' }}>
                                    {user.firstName} {user.lastName}
                                </td>
                                <td style={{ padding: '0.9rem 1rem', color: colors.textMuted, borderBottom: `1px solid ${colors.cardBorder}` }}>
                                    {user.email}
                                </td>
                                <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${colors.cardBorder}` }}>
                                        <span style={{
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            background: badge.bg,
                                            border: `1px solid ${badge.border}`,
                                            color: badge.color
                                        }}>
                                            {user.role}
                                        </span>
                                </td>
                                <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${colors.cardBorder}` }}>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        style={{
                                            padding: '0.4rem 0.75rem',
                                            background: colors.inputBg,
                                            border: `1px solid ${colors.inputBorder}`,
                                            borderRadius: '6px',
                                            color: colors.text,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="STUDENT">STUDENT</option>
                                        <option value="LIBRARIAN">LIBRARIAN</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${colors.cardBorder}` }}>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{
                                            padding: '0.4rem 0.9rem',
                                            background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 2px 8px rgba(231,76,60,0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                                        onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                                    >
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
    container: { padding: '2.5rem', maxWidth: '1100px', margin: '0 auto', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }
};

export default UserManagement;