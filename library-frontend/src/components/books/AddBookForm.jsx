import { useState } from 'react';
import { bookService } from '../../services/bookService.js';

function AddBookForm({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    category: '',
    totalCopies: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookService.createBook({
        ...formData,
        publicationYear: parseInt(formData.publicationYear),
        totalCopies: parseInt(formData.totalCopies)
      });
      alert('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publicationYear: '',
        category: '',
        totalCopies: '',
        imageUrl: ''
      });
      setImagePreview(null);
      onBookAdded();
    } catch (error) {
      console.error('Full error:', error);
      alert(`Failed to add book: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Add New Book</h3>

      <input type="text" name="title" placeholder="Title"
        value={formData.title} onChange={handleChange} required style={styles.input} />

      <input type="text" name="author" placeholder="Author"
        value={formData.author} onChange={handleChange} required style={styles.input} />

      <input type="text" name="isbn" placeholder="ISBN"
        value={formData.isbn} onChange={handleChange} required style={styles.input} />

      <input type="text" name="publisher" placeholder="Publisher"
        value={formData.publisher} onChange={handleChange} style={styles.input} />

      <input type="number" name="publicationYear" placeholder="Publication Year"
        value={formData.publicationYear} onChange={handleChange} style={styles.input} />

      <input type="text" name="category" placeholder="Category"
        value={formData.category} onChange={handleChange} style={styles.input} />

      <input type="number" name="totalCopies" placeholder="Total Copies"
        value={formData.totalCopies} onChange={handleChange} required style={styles.input} />

      {/* Image Upload */}
      <label style={styles.label}>Book Cover Image</label>
      <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />

      {imagePreview && (
        <img src={imagePreview} alt="Preview"
          style={{ width: '100px', height: '140px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '4px' }} />
      )}

      <button type="submit" disabled={loading} style={{
        ...styles.button,
        backgroundColor: loading ? '#ccc' : '#007bff',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {loading ? 'Adding...' : 'Add Book'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  }
};

export default AddBookForm;