import { useState, useEffect } from 'react';
import { borrowService } from '../../services/borrowService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

function BorrowHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { user } = useAuth();
  const { colors } = useTheme();

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const response = await borrowService.getBorrowHistory(user.id);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
    } finally {
      setLoading(false);
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
              My Borrow History
            </h2>
            <p style={{ color: colors.textMuted, fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
              {history.length} record{history.length !== 1 ? 's' : ''} total
            </p>
          </div>

          {history.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem',
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '16px',
                boxShadow: colors.shadow
              }}>
                <p style={{ color: colors.textMuted, fontFamily: 'Georgia, serif', fontSize: '1.2rem' }}>
                  No borrow history yet
                </p>
              </div>
          ) : (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {history.map((record) => {
                  const isHovered = hoveredCard === record.id;
                  const isReturned = record.status === 'RETURNED';

                  return (
                      <div
                          key={record.id}
                          onMouseEnter={() => setHoveredCard(record.id)}
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
                            margin: '0 0 0.75rem 0'
                          }}>
                            {record.bookTitle}
                          </h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '0.5rem 2rem', justifyContent: 'start' }}>
                                            <span style={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                                                Borrowed: {new Date(record.borrowDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                            <span style={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                                                Due: {new Date(record.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                            {record.returnDate && (
                                <span style={{ color: '#2ecc71', fontSize: '0.85rem' }}>
                                                    Returned: {new Date(record.returnDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                            )}
                          </div>
                        </div>

                        <span style={{
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          background: isReturned ? 'rgba(46,204,113,0.15)' : 'rgba(212,175,55,0.15)',
                          border: `1px solid ${isReturned ? 'rgba(46,204,113,0.4)' : 'rgba(212,175,55,0.4)'}`,
                          color: isReturned ? '#2ecc71' : colors.gold
                        }}>
                                        {record.status}
                                    </span>
                      </div>
                  );
                })}
              </div>
          )}
        </div>
      </div>
  );
}

export default BorrowHistory;