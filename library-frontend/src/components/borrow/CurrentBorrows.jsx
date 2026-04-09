import { useState, useEffect } from 'react';
import { borrowService } from '../../services/borrowService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

function CurrentBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { user } = useAuth();
  const { colors } = useTheme();

  useEffect(() => { fetchCurrentBorrows(); }, []);

  const fetchCurrentBorrows = async () => {
    try {
      const response = await borrowService.getCurrentBorrows(user.id);
      setBorrows(response.data);
    } catch (error) {
      console.error('Error fetching current borrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowRecordId) => {
    try {
      await borrowService.returnBook(borrowRecordId, 'Returned via app');
      alert('Book returned successfully!');
      fetchCurrentBorrows();
    } catch (error) {
      alert('Failed to return book');
    }
  };

  if (loading) return (
      <div style={{ background: colors.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: colors.gold, fontFamily: 'Georgia, serif', fontSize: '1.5rem' }}>Loading...</p>
      </div>
  );

  return (
      <div style={{ background: colors.bg, minHeight: '100vh', padding: '2.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.gold, fontFamily: 'Georgia, serif', fontSize: '2rem', margin: 0, textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
              Currently Borrowed Books
            </h2>
            <p style={{ color: colors.textMuted, fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
              {borrows.length} book{borrows.length !== 1 ? 's' : ''} currently borrowed
            </p>
          </div>

          {borrows.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '16px',
                boxShadow: colors.shadow
              }}>
                <p style={{ color: colors.textMuted, fontFamily: 'Georgia, serif', fontSize: '1.2rem' }}>
                  You have no currently borrowed books
                </p>
              </div>
          ) : (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {borrows.map((borrow) => {
                  const isHovered = hoveredCard === borrow.id;
                  const dueDate = new Date(borrow.dueDate);
                  const today = new Date();
                  const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

                  return (
                      <div
                          key={borrow.id}
                          onMouseEnter={() => setHoveredCard(borrow.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            background: colors.cardBg,
                            border: `1px solid ${isHovered ? colors.gold : colors.cardBorder}`,
                            borderRadius: '16px',
                            padding: '1.75rem',
                            boxShadow: isHovered ? `0 12px 30px rgba(0,0,0,0.3), 0 0 15px ${colors.goldDim}` : colors.shadow,
                            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            color: colors.gold,
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.2rem',
                            margin: '0 0 0.5rem 0'
                          }}>
                            {borrow.bookTitle}
                          </h3>
                          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                            <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>
                                                Due: {dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                            <span style={{
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              color: borrow.isOverdue ? '#e74c3c' : daysLeft <= 3 ? '#f39c12' : '#2ecc71'
                            }}>
                                                {borrow.isOverdue
                                                    ? 'OVERDUE'
                                                    : daysLeft === 0
                                                        ? 'Due today'
                                                        : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                                            </span>
                          </div>
                          {borrow.isOverdue && (
                              <div style={{
                                marginTop: '0.5rem',
                                padding: '0.3rem 0.75rem',
                                background: 'rgba(231,76,60,0.15)',
                                border: '1px solid rgba(231,76,60,0.4)',
                                borderRadius: '6px',
                                color: '#e74c3c',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                display: 'inline-block'
                              }}>
                                OVERDUE — Please return immediately
                              </div>
                          )}
                        </div>

                        <button
                            onClick={() => handleReturn(borrow.id)}
                            style={{
                              padding: '0.75rem 1.5rem',
                              background: 'linear-gradient(135deg, #1a6b3a, #2ecc71, #1a6b3a)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: 'bold',
                              fontFamily: 'Georgia, serif',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 4px 15px rgba(46,204,113,0.3)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(46,204,113,0.5)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(46,204,113,0.3)'; }}
                        >
                          Return Book
                        </button>
                      </div>
                  );
                })}
              </div>
          )}
        </div>
      </div>
  );
}

export default CurrentBorrows;