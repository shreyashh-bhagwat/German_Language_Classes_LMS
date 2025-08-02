import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1B263B',
      color: '#FFF',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      marginTop: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      }}>
        {/* Quick Links */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/" style={{ color: '#FFD700', textDecoration: 'none' }}>Home</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/about" style={{ color: '#FFD700', textDecoration: 'none' }}>About Us</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/courses" style={{ color: '#FFD700', textDecoration: 'none' }}>Courses</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/contact" style={{ color: '#FFD700', textDecoration: 'none' }}>Contact Us</Link>
            </li>
            <li>
              <Link to="/admin" style={{ color: '#FFD700', textDecoration: 'none' }}>Admin Login</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', margin: '0 0.5rem', textDecoration: 'none' }}>
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', margin: '0 0.5rem', textDecoration: 'none' }}>
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', margin: '0 0.5rem', textDecoration: 'none' }}>
            Instagram
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} German Tuition. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;