import { useState } from 'react';
import { borrowService } from '../../services/borrowService.js';
import { bookService } from '../../services/bookService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

function BookCard({ book, onBorrow, onDelete }) {
    const { user } = useAuth();
    const { colors } = useTheme();
    const [borrowing, setBorrowing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const isAdmin = user?.role === 'ADMIN';
    const isLibrarian = user?.role === 'LIBRARIAN';

    const handleBorrow = async () => {
        if (!user) { alert('Please login to borrow books'); return; }
        setBorrowing(true);
        try {
            await borrowService.borrowBook(user.id, book.id, 14);
            alert('Book borrowed successfully!');
            onBorrow();
        } catch (error) {
            alert(error.response?.data || 'Failed to borrow book');
        } finally {
            setBorrowing(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;
        setDeleting(true);
        try {
            await bookService.deleteBook(book.id);
            if (onDelete) onDelete();
        } catch (error) {
            alert(error.response?.data || 'Failed to delete book');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            {/* Book Card */}
            <div
                onClick={() => setShowModal(true)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    background: colors.cardBg,
                    border: `1px solid ${hovered ? colors.gold : colors.cardBorder}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${colors.goldDim}` : colors.shadow,
                    transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative'
                }}
            >
                {/* Book Image with Hover Zoom */}
                <div style={{
                    height: hovered ? '280px' : '200px',
                    background: book.imageUrl
                        ? `url(${book.imageUrl}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${colors.goldDim}, rgba(212,175,55,0.05))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${colors.cardBorder}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease',
                    backgroundSize: hovered ? '110%' : 'cover',
                    backgroundPosition: 'center'
                }}>
                    {!book.imageUrl && (
                        <div style={{ textAlign: 'center', opacity: hovered ? 0.7 : 1, transition: 'opacity 0.3s' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📖</div>
                            <div style={{ color: colors.gold, fontSize: '0.75rem', letterSpacing: '2px', fontFamily: 'Georgia, serif' }}>
                                NO COVER
                            </div>
                        </div>
                    )}

                    {/* Category badge */}
                    {book.category && (
                        <div style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            background: 'rgba(212,175,55,0.2)',
                            border: '1px solid rgba(212,175,55,0.4)',
                            color: colors.gold,
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontFamily: 'Georgia, serif',
                            backdropFilter: 'blur(4px)'
                        }}>
                            {book.category}
                        </div>
                    )}

                    {/* Admin Delete Button */}
                    {isAdmin && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                position: 'absolute',
                                top: '0.75rem',
                                left: '0.75rem',
                                padding: '0.3rem 0.75rem',
                                background: deleting ? 'rgba(231,76,60,0.3)' : 'linear-gradient(135deg, #c0392b, #e74c3c)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(231,76,60,0.4)',
                                transition: 'all 0.2s',
                                opacity: hovered ? 1 : 0,
                                zIndex: 10
                            }}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    )}

                    {/* Hover Overlay */}
                    {hovered && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            padding: '2rem 1rem 1rem 1rem',
                            color: 'white',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            fontFamily: 'Georgia, serif'
                        }}>
                            Click for full details
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                        color: colors.gold,
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.15rem',
                        marginBottom: '0.4rem',
                        lineHeight: '1.3'
                    }}>
                        {book.title}
                    </h3>
                    <p style={{ color: colors.textMuted, fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                        by {book.author}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        color: colors.textMuted,
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        background: colors.inputBg,
                        borderRadius: '8px',
                        border: `1px solid ${colors.cardBorder}`
                    }}>
                        <span>{book.isbn}</span>
                        <span>{book.publisher}</span>
                        <span>{book.publicationYear}</span>
                        <span>{book.availableCopies}/{book.totalCopies} left</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: colors.textMuted, fontSize: '0.85rem' }}>
                            {book.availableCopies} / {book.totalCopies} available
                        </span>
                        <span style={{
                            padding: '0.3rem 0.9rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            background: book.isAvailable ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                            border: `1px solid ${book.isAvailable ? 'rgba(46,204,113,0.4)' : 'rgba(231,76,60,0.4)'}`,
                            color: book.isAvailable ? '#2ecc71' : '#e74c3c'
                        }}>
                            {book.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Full View Modal */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        padding: '2rem',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: colors.cardBg,
                            border: `1px solid ${colors.gold}`,
                            borderRadius: '20px',
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.goldDim}`,
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'rgba(231,76,60,0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                zIndex: 10,
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                        >
                            ×
                        </button>

                        {/* Book Cover */}
                        <div style={{
                            flex: '0 0 350px',
                            background: book.imageUrl
                                ? `url(${book.imageUrl}) center/cover no-repeat`
                                : `linear-gradient(135deg, ${colors.goldDim}, rgba(212,175,55,0.05))`,
                            borderRadius: '20px 0 0 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '500px'
                        }}>
                            {!book.imageUrl && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>📖</div>
                                    <div style={{ color: colors.gold, fontSize: '1rem', letterSpacing: '2px', fontFamily: 'Georgia, serif' }}>
                                        NO COVER
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Book Details */}
                        <div style={{ flex: 1, padding: '3rem 2.5rem', overflowY: 'auto' }}>
                            {book.category && (
                                <span style={{
                                    display: 'inline-block',
                                    background: 'rgba(212,175,55,0.2)',
                                    border: '1px solid rgba(212,175,55,0.4)',
                                    color: colors.gold,
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontFamily: 'Georgia, serif',
                                    marginBottom: '1rem'
                                }}>
                                    {book.category}
                                </span>
                            )}

                            <h2 style={{
                                color: colors.gold,
                                fontFamily: 'Georgia, serif',
                                fontSize: '2rem',
                                margin: '0 0 0.5rem 0',
                                lineHeight: '1.2'
                            }}>
                                {book.title}
                            </h2>

                            <p style={{
                                color: colors.textMuted,
                                fontSize: '1.1rem',
                                fontStyle: 'italic',
                                marginBottom: '2rem'
                            }}>
                                by {book.author}
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                background: colors.inputBg,
                                borderRadius: '12px',
                                border: `1px solid ${colors.cardBorder}`
                            }}>
                                <div>
                                    <div style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '0.25rem' }}>ISBN</div>
                                    <div style={{ color: colors.text, fontWeight: '500' }}>{book.isbn}</div>
                                </div>
                                <div>
                                    <div style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '0.25rem' }}>Publisher</div>
                                    <div style={{ color: colors.text, fontWeight: '500' }}>{book.publisher}</div>
                                </div>
                                <div>
                                    <div style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '0.25rem' }}>Year</div>
                                    <div style={{ color: colors.text, fontWeight: '500' }}>{book.publicationYear}</div>
                                </div>
                                <div>
                                    <div style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '0.25rem' }}>Availability</div>
                                    <div style={{ color: colors.text, fontWeight: '500' }}>{book.availableCopies} / {book.totalCopies} copies</div>
                                </div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: book.isAvailable ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                                border: `1px solid ${book.isAvailable ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                                borderRadius: '8px',
                                marginBottom: '2rem'
                            }}>
                                <span style={{
                                    color: book.isAvailable ? '#2ecc71' : '#e74c3c',
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}>
                                    {book.isAvailable ? '✓ Available for borrowing' : '✗ Currently unavailable'}
                                </span>
                            </div>

                            {/* Borrow Button */}
                            {book.isAvailable && user && !isAdmin && !isLibrarian && (
                                <button
                                    onClick={handleBorrow}
                                    disabled={borrowing}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: borrowing
                                            ? 'rgba(212,175,55,0.3)'
                                            : 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
                                        color: borrowing ? colors.gold : '#1a1a2e',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: borrowing ? 'not-allowed' : 'pointer',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        fontFamily: 'Georgia, serif',
                                        letterSpacing: '0.5px',
                                        boxShadow: borrowing ? 'none' : '0 4px 15px rgba(212,175,55,0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {borrowing ? 'Borrowing...' : 'Borrow This Book'}
                                </button>
                            )}

                            {(isAdmin || isLibrarian) && (
                                <div style={{
                                    textAlign: 'center',
                                    color: colors.textMuted,
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic',
                                    padding: '1rem',
                                    borderTop: `1px solid ${colors.cardBorder}`
                                }}>
                                    {isAdmin ? 'Admin view' : 'Librarian view'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BookCard;