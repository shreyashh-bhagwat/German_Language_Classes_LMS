import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        if (courseId) {
          await axios.post(
            'http://localhost:5000/api/cart',
            { course_id: courseId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [courseId, navigate]);

  const handleRemoveFromCart = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.id !== courseId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const response = await axios.post(
        'http://localhost:5000/api/payment',
        { amount: cartItems.reduce((total, item) => total + item.price * (1 - (item.discount || 0) / 100), 0) * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { order_id } = response.data;

      const options = {
        key: 'rzp_test_L26VIOCFHsgOjT', // Replace with your Razorpay key
        amount: response.data.amount,
        currency: 'INR',
        name: 'German Tuition',
        description: 'Course Purchase',
        order_id,
        handler: async (response) => {
          try {
            const formData = new FormData();
            formData.append('razorpay_payment_id', response.razorpay_payment_id);
            formData.append('razorpay_order_id', response.razorpay_order_id);
            formData.append('razorpay_signature', response.razorpay_signature);
            formData.append('user_id', decoded.id);
            await axios.post('http://localhost:5000/api/verify-payment', formData, {
              headers: { Authorization: `Bearer ${token}` },
            });
            await Promise.all(cartItems.map((item) =>
              axios.post('http://localhost:5000/api/enrollments', {
                user_id: decoded.id,
                course_id: item.id,
              }, {
                headers: { Authorization: `Bearer ${token}` },
              })
            ));

            // Generate PDF receipt
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('German Tuition Receipt', 20, 20);
            doc.setFontSize(12);
            doc.text(`User: ${decoded.name}`, 20, 30);
            doc.text(`Email: ${decoded.email}`, 20, 40);
            doc.text(`Mobile: ${decoded.mobile || 'Not provided'}`, 20, 50);
            doc.text('Purchased Courses:', 20, 60);
            cartItems.forEach((item, index) => {
              doc.text(`${index + 1}. ${item.title} - INR ${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}`, 20, 70 + index * 10);
            });
            doc.text(`Total: INR ${cartItems.reduce((total, item) => total + item.price * (1 - (item.discount || 0) / 100), 0).toFixed(2)}`, 20, 70 + cartItems.length * 10 + 10);
            doc.save('receipt.pdf');

            // Clear cart and redirect
            await axios.delete('http://localhost:5000/api/cart', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems([]);
            navigate('/profile');
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: decoded.name,
          email: decoded.email,
          contact: decoded.mobile || '',
        },
        theme: {
          color: '#4169E1',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError('Failed to initiate payment. Please try again.');
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
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        Your Cart
      </h2>
      {loading && (
        <p style={{ textAlign: 'center', color: '#1B263B', fontSize: '1rem' }}>
          Loading...
        </p>
      )}
      {error && (
        <p style={{ textAlign: 'center', color: '#EF4444', fontSize: '1rem', marginBottom: '1rem' }}>
          {error}
        </p>
      )}
      {cartItems.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#617689', fontSize: '1rem' }}>
          Your cart is empty.
        </p>
      )}
      {cartItems.length > 0 && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'grid',
          gap: '1.5rem',
        }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{
              backgroundColor: '#FFF',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <p style={{
                  color: '#1B263B',
                  fontSize: '1rem',
                  fontWeight: '700',
                }}>
                  {item.title}
                </p>
                <p style={{
                  color: '#617689',
                  fontSize: '0.875rem',
                }}>
                  {item.description}
                </p>
                <p style={{
                  color: '#1B263B',
                  fontSize: '1rem',
                  fontWeight: '700',
                }}>
                  INR {(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
                  {item.discount > 0 && (
                    <span style={{ color: '#EF4444', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                      ({item.discount}% off)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                style={{
                  backgroundColor: '#EF4444',
                  color: '#FFF',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  width: 'fit-content',
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
                Remove
              </button>
            </div>
          ))}
          <div style={{
            textAlign: 'right',
            marginTop: '1rem',
          }}>
            <p style={{
              color: '#1B263B',
              fontSize: '1.25rem',
              fontWeight: '700',
            }}>
              Total: INR {cartItems.reduce((total, item) => total + item.price * (1 - (item.discount || 0) / 100), 0).toFixed(2)}
            </p>
            <button
              onClick={handlePayment}
              style={{
                backgroundColor: '#4169E1',
                color: '#FFF',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1rem',
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
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;