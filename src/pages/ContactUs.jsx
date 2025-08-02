import { useState } from 'react';
import axios from 'axios';

function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Failed to send message. Please try again.');
    }
  };

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
        Contact Us
      </h2>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '500px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4169E1')}
          onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4169E1')}
          onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '1rem',
            minHeight: '120px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4169E1')}
          onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#4169E1',
            color: '#FFF',
            padding: '0.75rem',
            borderRadius: '9999px',
            fontSize: '1rem',
            fontWeight: '700',
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
          Send Message
        </button>
      </form>
      {status && (
        <p style={{
          color: status.includes('successfully') ? '#10B981' : '#EF4444',
          marginTop: '1rem',
          fontSize: '1rem',
        }}>
          {status}
        </p>
      )}
    </div>
  );
}

export default ContactUs;