import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourses(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching admin courses:', error);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourses(courses.filter((course) => course.id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course.');
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#F5F5F7',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
    }}>
      <h2 style={{
        color: '#1B263B',
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        Admin Dashboard
      </h2>
      <button
        onClick={() => navigate('/admin/add-course')}
        style={{
          backgroundColor: '#4169E1',
          color: '#FFF',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '700',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1rem',
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
        Add New Course
      </button>
      {loading && <p style={{ textAlign: 'center', color: '#1B263B' }}>Loading...</p>}
      {error && <p style={{ textAlign: 'center', color: '#EF4444' }}>{error}</p>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}>
        {courses.map((course) => (
          <div key={course.id} style={{
            backgroundColor: '#FFF',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h3 style={{ color: '#1B263B', fontSize: '1rem', fontWeight: '700' }}>{course.title}</h3>
            <p style={{ color: '#617689', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                style={{
                  backgroundColor: '#4169E1',
                  color: '#FFF',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
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
                Edit
              </button>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                style={{
                  backgroundColor: '#EF4444',
                  color: '#FFF',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#DC2626';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#EF4444';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;