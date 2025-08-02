import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const decoded = jwtDecode(token);
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setEnrollments(response.data.enrollments || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#F5F5F7',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
        textAlign: 'center',
        color: '#1B263B',
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#F5F5F7',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
        textAlign: 'center',
        color: '#EF4444',
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#F5F5F7',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
    }}>
      <h2 style={{
        color: '#1B263B',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        Your Profile
      </h2>
      {user && (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{
            color: '#1B263B',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}>
            Welcome, {user.name}!
          </h3>
          <p style={{
            color: '#617689',
            fontSize: '1rem',
            marginBottom: '0.5rem',
          }}>
            Email: {user.email}
          </p>
          <h4 style={{
            color: '#1B263B',
            fontSize: '1.125rem',
            fontWeight: '600',
            margin: '1.5rem 0 1rem',
          }}>
            Enrolled Courses
          </h4>
          {enrollments.length > 0 ? (
            <ul style={{
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gap: '1rem',
            }}>
              {enrollments.map((course) => (
                <li key={course.id} style={{
                  backgroundColor: '#FFF',
                  borderRadius: '8px',
                  padding: '1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                  <p style={{
                    color: '#1B263B',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}>
                    {course.title}
                  </p>
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    style={{
                      backgroundColor: '#4169E1',
                      color: '#FFF',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
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
                    View Course
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{
              color: '#617689',
              fontSize: '1rem',
            }}>
              You are not enrolled in any courses yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;