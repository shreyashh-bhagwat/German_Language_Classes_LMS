import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/');
      } else {
        setFormData((prev) => ({ ...prev, email: decoded.email }));
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:5000/api/admin/update-profile',
        { email: formData.email, password: formData.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile updated successfully. Please log in again.');
      setFormData({ email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  const decoded = jwtDecode(token);
  if (decoded.role !== 'admin') return null;

  return (
    <div style={{
      backgroundColor: '#F5F5F7',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      textAlign: 'center',
    }}>
      <h2 style={{
        color: '#1B263B',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
      }}>
        Admin Dashboard
      </h2>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}>
        <p style={{
          color: '#617689',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}>
          Welcome to the Admin Panel. Manage courses or update your profile below.
        </p>
        <button
          onClick={() => navigate('/admin/courses')}
          style={{
            backgroundColor: '#4169E1',
            color: '#FFF',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '2rem',
            transition: 'background-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#3C5FD0';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4169E1';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Manage Courses
        </button>
        <h3 style={{
          color: '#1B263B',
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
        }}>
          Update Profile
        </h3>
        {error && (
          <p style={{
            color: '#EF4444',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{
            color: '#10B981',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}>
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="New Email"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '1rem',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.5)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4169E1')}
            onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '1rem',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.5)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4169E1')}
            onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '1rem',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.5)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4169E1')}
            onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#4169E1',
              color: '#FFF',
              padding: '0.75rem',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: '700',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#3C5FD0';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#4169E1';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;