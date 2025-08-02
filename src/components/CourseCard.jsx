import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function CourseCard({ course }) {
  // Assuming course might have a progress property (0-100) for enrolled users
  const progress = course.progress || 0;

  return (
    <>
      <motion.div
        className="course-card"
        whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        role="article"
        aria-labelledby={`course-title-${course.id}`}
      >
        <div className="course-thumbnail">
          <img src={course.thumbnail} alt={course.title} />
          {course.discount > 0 && (
            <span className="discount-badge">{course.discount}% OFF</span>
          )}
        </div>
        <div className="course-content">
          <h3 id={`course-title-${course.id}`}>{course.title}</h3>
          <p className="course-description">{course.description}</p>
          <div className="course-price">
            <span className="price">${course.price}</span>
            {course.discount > 0 && (
              <span className="original-price">
                ${(course.price / (1 - course.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          {progress > 0 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          <Link
            to={`/cart/${course.id}`}
            className="enroll-button"
            aria-label={`Enroll in ${course.title}`}
          >
            {progress > 0 ? 'Continue Learning' : 'Enroll Now'}
          </Link>
        </div>
      </motion.div>

      <style>
        {`
          .course-card {
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: box-shadow 0.2s ease;
            max-width: 300px;
            margin: 0 auto;
          }

          .course-thumbnail {
            position: relative;
            width: 100%;
            height: 160px;
          }

          .course-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .discount-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #ef4444;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
          }

          .course-content {
            padding: 1.25rem;
          }

          .course-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1b263b;
            margin: 0 0 0.5rem;
          }

          .course-description {
            font-size: 0.875rem;
            color: #6b7280;
            line-height: 1.4;
            margin: 0 0 1rem;
            height: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .course-price {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .price {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1b263b;
          }

          .original-price {
            font-size: 0.875rem;
            color: #6b7280;
            text-decoration: line-through;
          }

          .progress-bar {
            height: 6px;
            background-color: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 1rem;
          }

          .progress-fill {
            height: 100%;
            background-color: #22c55e;
            transition: width 0.3s ease;
          }

          .enroll-button {
            display: inline-block;
            width: 100%;
            text-align: center;
            background-color: #ffd700;
            color: #1b263b;
            padding: 0.75rem;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .enroll-button:hover {
            background-color: #eab308;
            transform: translateY(-2px);
          }

          .enroll-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
          }

          @media (max-width: 480px) {
            .course-card {
              max-width: 100%;
            }

            .course-content h3 {
              font-size: 1.125rem;
            }

            .course-description {
              font-size: 0.8125rem;
            }

            .enroll-button {
              padding: 0.5rem;
              font-size: 0.8125rem;
            }
          }
        `}
      </style>
    </>
  );
}

export default CourseCard;
