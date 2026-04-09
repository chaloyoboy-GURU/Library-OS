import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { useTheme } from '../../context/ThemeContext.jsx';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const navigate = useNavigate();
    const { colors } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.register(formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data || err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const inputFields = [
        { name: 'firstName', placeholder: 'First Name', type: 'text' },
        { name: 'lastName', placeholder: 'Last Name', type: 'text' },
        { name: 'email', placeholder: 'Email', type: 'email' },
        { name: 'password', placeholder: 'Password', type: 'password' }
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}>
            <div style={{
                background: 'linear-gradient(145deg, #1e1e3a, #16213e)',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.1)',
                padding: '3rem 2.5rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📚</div>
                <h2 style={{
                    color: '#d4af37',
                    fontFamily: 'Georgia, serif',
                    fontSize: '2rem',
                    margin: '0 0 0.25rem 0',
                    textShadow: '0 0 20px rgba(212,175,55,0.3)'
                }}>
                    LibraryOS
                </h2>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem', fontStyle: 'italic' }}>
                    Create your account
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(220,53,69,0.15)',
                        border: '1px solid rgba(220,53,69,0.4)',
                        color: '#ff6b7a',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    {inputFields.map(field => (
                        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ color: '#d4af37', fontSize: '0.85rem', letterSpacing: '0.5px', fontFamily: 'Georgia, serif' }}>
                                {field.placeholder}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={handleChange}
                                onFocus={() => setFocusedField(field.name)}
                                onBlur={() => setFocusedField(null)}
                                required
                                style={{
                                    padding: '0.85rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${focusedField === field.name ? '#d4af37' : 'rgba(212,175,55,0.2)'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    color: '#e0e0e0',
                                    outline: 'none',
                                    boxShadow: focusedField === field.name ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            />
                        </div>
                    ))}

                    {/* Role Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ color: '#d4af37', fontSize: '0.85rem', letterSpacing: '0.5px', fontFamily: 'Georgia, serif' }}>
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{
                                padding: '0.85rem 1rem',
                                background: '#1e1e3a',
                                border: '1px solid rgba(212,175,55,0.2)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                color: '#e0e0e0',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="LIBRARIAN">Librarian</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.9rem',
                            background: loading
                                ? 'rgba(212,175,55,0.3)'
                                : 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
                            color: loading ? '#d4af37' : '#1a1a2e',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            letterSpacing: '1px',
                            fontFamily: 'Georgia, serif',
                            boxShadow: loading ? 'none' : '0 4px 15px rgba(212,175,55,0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', color: '#888', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;