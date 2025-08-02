import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Slider from '../components/Slider';
import CourseCard from '../components/CourseCard';
import { color } from 'framer-motion';

function HomePage() {
  const [courses, setCourses] = useState([]);
  <>
  <h2 style={{color:"black"}}>We offers this courses</h2>
  </>

  useEffect(() => {
    // Fetch courses from API or use static data for now
    async function fetchCourses() {
      try {
        // Example API call (replace with your endpoint)
        // const res = await axios.get('/api/courses');
        // setCourses(res.data);
        console.log("Fetching courses...");
        // Static data for demonstration
        setCourses([
          {
            id: 1,
            title: "Beginner German",
            description: "Start learning German from scratch.",
            price: 49,
            discount: 10,
            thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          },
          {
            id: 2,
            title: "Intermediate German",
            description: "Improve your German skills.",
            price: 69,
            discount: 15,
            thumbnail: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
          },
          {
            id: 3,
            title: "Advanced German",
            description: "Master advanced German topics.",
            price: 99,
            discount: 20,
            thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
          }
        ]);
      } catch (err) {
        // handle error
      }
    }
    fetchCourses();
  }, []);

  return (
    <>
      <div>
        <img
          src='https://smartslider3.com/wp-content/uploads/slider133/slider-with-lightbox-background4.jpeg'
          alt='Banner'
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '2rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>We Offer These Courses</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          {courses.map(course => (
            <div key={course.id} style={{ width: 300 }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          body {
            background-color: #ffffffff;
          }
          .homepage-banner {
            width: 100%;
            height: 500px;
            object-fit: cover;
            display: block;
            top-margin: 100px;
          }
        `}
      </style>
    </>
  );
}

export default HomePage;