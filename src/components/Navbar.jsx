import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', search);
    // Implement search logic
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItemVariants = {
    hover: { scale: 1.1, color: '#3B82F6', transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, backgroundColor: '#2563EB', transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <style>
        {`
          .navbar {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 50;
            padding: 16px 24px;
          }
          .navbar-container {
            max-width: 1280px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .navbar-logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1F2937;
          }
          .navbar-links {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          .navbar-links a {
            color: #111112ff;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          .navbar-links a:hover {
            color: #3B82F6;
          }
          .search-form {
            position: relative;
          }
          .search-input {
            padding: 8px 12px 8px 36px;
            border-radius: 9999px;
            border: none;
            background: rgba(243, 244, 246, 0.5);
            outline: none;
            transition: transform 0.2s ease;
          }
          .search-input:focus {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
            transform: scale(1.02);
          }
          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #6B7280;
          }
          .auth-buttons {
            display: flex;
            gap: 12px;
          }
          .auth-button {
            padding: 8px 16px;
            border-radius: 12px;
            background: #3B82F6;
            color: #ffffff !important;
            font-weight: 500;
            transition: box-shadow 0.3s ease;
          }
          .auth-button:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 9px;
          }
          .profile-icon {
            width: 24px;
            height: 24px;
            color: #ffffff;
          }
          @media (max-width: 768px) {
            .navbar-container {
              flex-direction: column;
              gap: 16px;
            }
            .navbar-links {
              flex-wrap: wrap;
              justify-content: center;
            }
            .auth-buttons {
              justify-content: center;
            }
          }
        `}
      </style>
      <nav className="navbar">
        <div className="navbar-container">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="navbar-logo"
          >
            German Tuition
          </motion.div>
          
          <div className="navbar-links">
            {['Home', 'About Us', 'Courses', 'Contact', 'Profile'].map((item) => (
              <motion.div
                key={item}
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                  className="nav-link"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <form onSubmit={handleSearch} className="search-form">
              <motion.input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="search-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <svg
                className="search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
            <div className="auth-buttons">
              {isLoggedIn ? (
                <>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link to="/profile" className="auth-button">
                      <svg
                        className="profile-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button
                      onClick={handleLogout}
                      className="auth-button"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                ['Login', 'Register'].map((item) => (
                  <motion.div
                    key={item}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="auth-button"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;