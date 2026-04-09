import { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import BookCard from './BookCard.jsx';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '', author: '', isbn: '', publisher: '',
        publicationYear: '', category: '', totalCopies: '', imageUrl: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { colors } = useTheme();
    const { user } = useAuth();

    useEffect(() => { fetchBooks(); }, []);

    const fetchBooks = async () => {
        try {
            const response = await bookService.getAllBooks();
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) { fetchBooks(); return; }
        try {
            const response = await bookService.searchBooks(searchTerm);
            setBooks(response.data);
        } catch (error) {
            console.error('Error searching books:', error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setNewBook(prev => ({ ...prev, imageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await bookService.createBook({
                ...newBook,
                publicationYear: parseInt(newBook.publicationYear),
                totalCopies: parseInt(newBook.totalCopies)
            });
            setShowAddForm(false);
            setNewBook({ title: '', author: '', isbn: '', publisher: '', publicationYear: '', category: '', totalCopies: '', imageUrl: '' });
            setImagePreview(null);
            fetchBooks();
        } catch (error) {
            alert(error.response?.data || 'Failed to add book');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={{ ...styles.container, background: colors.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ color: colors.gold, fontFamily: 'Georgia, serif', fontSize: '1.5rem' }}>Loading books...</div>
        </div>
    );

    return (
        <div style={{ ...styles.container, background: colors.bg }}>

            {/* Header */}
            <div style={styles.header}>
                <h2 style={{ color: colors.gold, fontFamily: 'Georgia, serif', fontSize: '2.5rem', margin: 0, textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
                    Library Books
                </h2>
                <p style={{ color: colors.textMuted, fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
                    Discover your next great read
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    style={{
                        flex: 1,
                        padding: '1rem 1.25rem',
                        background: colors.inputBg,
                        border: `1px solid ${searchFocused ? colors.gold : colors.inputBorder}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        color: colors.text,
                        outline: 'none',
                        boxShadow: searchFocused ? `0 0 0 3px ${colors.goldDim}, 0 4px 15px rgba(0,0,0,0.2)` : 'none',
                        transition: 'all 0.3s ease'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
                        color: '#1a1a2e',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        fontFamily: 'Georgia, serif',
                        boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(212,175,55,0.5)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(212,175,55,0.3)'; }}
                >
                    Search
                </button>
                {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
                    <button
                        type="button"
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{
                            padding: '1rem 1.5rem',
                            background: showAddForm ? 'rgba(231,76,60,0.2)' : 'rgba(212,175,55,0.1)',
                            color: showAddForm ? '#e74c3c' : colors.gold,
                            border: `1px solid ${showAddForm ? 'rgba(231,76,60,0.4)' : colors.inputBorder}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {showAddForm ? 'Cancel' : '+ Add Book'}
                    </button>
                )}
            </form>

            {/* Add Book Form */}
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
                        Add New Book
                    </h3>
                    <form onSubmit={handleAddBook}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            {[
                                { key: 'title', placeholder: 'Book Title *', required: true },
                                { key: 'author', placeholder: 'Author *', required: true },
                                { key: 'isbn', placeholder: 'ISBN *', required: true },
                                { key: 'publisher', placeholder: 'Publisher' },
                                { key: 'publicationYear', placeholder: 'Publication Year', type: 'number' },
                                { key: 'category', placeholder: 'Category' },
                                { key: 'totalCopies', placeholder: 'Total Copies *', type: 'number', required: true },
                            ].map(field => (
                                <input
                                    key={field.key}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    value={newBook[field.key]}
                                    onChange={e => setNewBook(prev => ({ ...prev, [field.key]: e.target.value }))}
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

                        {/* Image Upload */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: colors.gold, fontSize: '0.9rem', fontFamily: 'Georgia, serif', display: 'block', marginBottom: '0.5rem' }}>
                                Book Cover Image
                            </label>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center',
                                padding: '1rem',
                                background: colors.inputBg,
                                border: `2px dashed ${colors.inputBorder}`,
                                borderRadius: '12px'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ color: colors.text }}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: `1px solid ${colors.gold}` }}
                                    />
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '0.9rem 2.5rem',
                                background: 'linear-gradient(135deg, #b8962e, #d4af37, #b8962e)',
                                color: '#1a1a2e',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                fontFamily: 'Georgia, serif',
                                boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
                            }}
                        >
                            {submitting ? 'Adding...' : 'Add Book'}
                        </button>
                    </form>
                </div>
            )}

            {/* Books Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {books.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: colors.textMuted }}>
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem' }}>No books found</p>
                    </div>
                ) : (
                    books.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onBorrow={fetchBooks}
                            onDelete={fetchBooks}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2.5rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' },
    header: { marginBottom: '2rem' },
    searchForm: { display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }
};

export default BookList;