import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import VideoPlayer from '../components/VideoPlayer';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedCourses = response.data;
        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);
        setError(null);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
    );
    setFilteredCourses(filtered);
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
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        Our Courses
      </h2>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          height: '40px',
        }}>
          <div style={{
            padding: '0 0.75rem 0 1rem',
            color: '#617689',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '0 12px 12px 0',
              border: 'none',
              background: 'transparent',
              color: '#1B263B',
              fontSize: '1rem',
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 0 8px rgba(65, 105, 225, 0.3)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          />
        </div>
      </div>
      <VideoPlayer
        src="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with actual course preview video
        poster="/placeholder.jpg"
      />
      {loading && (
        <p style={{ textAlign: 'center', color: '#1B263B', fontSize: '1rem', marginTop: '1rem' }}>
          Loading courses...
        </p>
      )}
      {error && (
        <p style={{ textAlign: 'center', color: '#EF4444', fontSize: '1rem', marginTop: '1rem' }}>
          {error}
        </p>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
        animation: 'fadeIn 0.5s ease-in',
      }}>
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
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

export default Courses;