import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#F5F5F7',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        animation: 'fadeIn 0.5s ease-in',
      }}>
        <h2 style={{
          color: '#1B263B',
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          Log In to German Tuition
        </h2>
        {error && (
          <p style={{
            color: '#EF4444',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
            placeholder="Password"
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
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <p style={{
          color: '#617689',
          fontSize: '0.875rem',
          textAlign: 'center',
          marginTop: '1rem',
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#4169E1',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#3C5FD0')}
          onMouseLeave={(e) => (e.target.style.color = '#4169E1')}
          >
            Sign Up
          </Link>
        </p>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Login;