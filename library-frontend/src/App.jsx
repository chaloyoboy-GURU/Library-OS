import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import BookList from './components/books/BookList.jsx';
import CurrentBorrows from './components/borrow/CurrentBorrows.jsx';
import BorrowHistory from './components/borrow/BorrowHistory.jsx';
import Dashboard from './admin/Dashboard.jsx';
import UserManagement from './admin/UserManagement.jsx';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/books" element={
                            <ProtectedRoute><BookList /></ProtectedRoute>
                        } />
                        <Route path="/my-borrows" element={
                            <ProtectedRoute><CurrentBorrows /></ProtectedRoute>
                        } />
                        <Route path="/history" element={
                            <ProtectedRoute><BorrowHistory /></ProtectedRoute>
                        } />
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                            <ProtectedRoute adminOnly={true}><UserManagement /></ProtectedRoute>
                        } />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;