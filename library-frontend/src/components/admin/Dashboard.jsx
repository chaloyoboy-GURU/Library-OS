import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService.js';
import { useTheme } from '../context/ThemeContext.jsx';

function Dashboard() {
    const { colors } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getStats()
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ ...styles.container, background: colors.bg }}>
            <p style={{ color: colors.gold, fontFamily: 'Georgia, serif' }}>Loading...</p>
        </div>
    );

    return (
        <div style={{ ...styles.container, background: colors.bg }}>
            <div style={styles.header}>
                <h2 style={{ color: colors.gold, fontFamily: 'Georgia, serif', fontSize: '2rem', margin: 0, textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
                    Admin Dashboard
                </h2>
                <p style={{ color: colors.textMuted, fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
                    System overview and management
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Total Users', value: stats?.totalUsers },
                    { label: 'Total Books', value: stats?.totalBooks },
                    { label: 'Total Borrows', value: stats?.totalBorrows },
                    { label: 'Available Books', value: stats?.availableBooks }
                ].map((item, i) => (
                    <div key={i} style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: colors.shadow
                    }}>
                        <h3 style={{ color: colors.gold, fontSize: '2rem', margin: '0 0 0.25rem 0', fontFamily: 'Georgia, serif' }}>
                            {item.value}
                        </h3>
                        <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: 0 }}>{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Role Grid */}
            <h3 style={{ color: colors.gold, fontFamily: 'Georgia, serif', marginBottom: '1rem', borderBottom: `1px solid ${colors.cardBorder}`, paddingBottom: '0.5rem' }}>
                Users by Role
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Students', value: stats?.students, color: '#3498db' },
                    { label: 'Librarians', value: stats?.librarians, color: '#2ecc71' },
                    { label: 'Admins', value: stats?.admins, color: '#d4af37' }
                ].map((item, i) => (
                    <div key={i} style={{
                        background: colors.cardBg,
                        border: `1px solid ${item.color}44`,
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textAlign: 'center',
                        boxShadow: colors.shadow
                    }}>
                        <h4 style={{ color: item.color, fontSize: '1.75rem', margin: '0 0 0.25rem 0', fontFamily: 'Georgia, serif' }}>
                            {item.value}
                        </h4>
                        <p style={{ color: colors.textMuted, fontSize: '0.85rem', margin: 0 }}>{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <h3 style={{ color: colors.gold, fontFamily: 'Georgia, serif', marginBottom: '1rem', borderBottom: `1px solid ${colors.cardBorder}`, paddingBottom: '0.5rem' }}>
                Management
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                    { label: 'Manage Users', to: '/admin/users', color: 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)' },
                    { label: 'Manage Books', to: '/books', color: 'linear-gradient(135deg, #1a6b3a, #2ecc71, #1a6b3a)' }
                ].map((btn, i) => (
                    <Link
                        key={i}
                        to={btn.to}
                        style={{
                            display: 'inline-block',
                            padding: '0.9rem 2rem',
                            background: btn.color,
                            color: '#1a1a2e',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontFamily: 'Georgia, serif',
                            letterSpacing: '0.5px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                    >
                        {btn.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' },
    header: { marginBottom: '2rem' }
};

export default Dashboard;