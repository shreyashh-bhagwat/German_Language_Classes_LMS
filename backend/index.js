const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const Razorpay = require('razorpay');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'german_tuition',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Razorpay instance
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password, mobile } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, mobile) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'user', mobile || null]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Update admin profile endpoint
app.put('/api/admin/update-profile', authenticateToken, isAdmin, async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'Email or password must be provided' });
  }

  try {
    if (email && email !== req.user.email) {
      const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length > 0) {
      const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(req.user.id);
      await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Get courses endpoint
app.get('/api/courses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

// Add course endpoint (admin)
app.post('/api/admin/courses', authenticateToken, isAdmin, async (req, res) => {
  const { title, description, price, discount, thumbnail } = req.body;

  if (!title || !description || !price || !thumbnail) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, price, discount, thumbnail) VALUES (?, ?, ?, ?, ?)',
      [title, description, price, discount || 0, thumbnail]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Failed to add course' });
  }
});

// Delete course endpoint (admin)
app.delete('/api/admin/courses/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
});

// Get cart endpoint
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.id, c.title, c.description, c.price, c.discount, c.thumbnail FROM cart ca JOIN courses c ON ca.course_id = c.id WHERE ca.user_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Add to cart endpoint
app.post('/api/cart', authenticateToken, async (req, res) => {
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  try {
    const [course] = await pool.query('SELECT * FROM courses WHERE id = ?', [course_id]);
    if (course.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const [existing] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND course_id = ?', [req.user.id, course_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Course already in cart' });
    }

    await pool.query('INSERT INTO cart (user_id, course_id) VALUES (?, ?)', [req.user.id, course_id]);
    res.status(201).json({ message: 'Course added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// Remove from cart endpoint
app.delete('/api/cart/:courseId', authenticateToken, async (req, res) => {
  const { courseId } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM cart WHERE user_id = ? AND course_id = ?', [req.user.id, courseId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not in cart' });
    }
    res.json({ message: 'Course removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
});

// Clear cart endpoint
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

// Create payment order endpoint
app.post('/api/payment', authenticateToken, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${req.user.id}_${Date.now()}`,
    });
    res.json({ order_id: order.id, amount });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// Verify payment endpoint
app.post('/api/verify-payment', authenticateToken, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Invalid payment details' });
  }

  try {
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

// Enrollments endpoint
app.post('/api/enrollments', authenticateToken, async (req, res) => {
  const { user_id, course_id } = req.body;

  if (!user_id || !course_id) {
    return res.status(400).json({ message: 'User ID and Course ID are required' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [user_id, course_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    await pool.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [user_id, course_id]);
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling:', error);
    res.status(500).json({ message: 'Failed to enroll' });
  }
});

// Profile endpoint
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, mobile FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [enrollments] = await pool.query(
      'SELECT c.id, c.title, c.description, c.price, c.discount, c.thumbnail FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ?',
      [req.user.id]
    );

    res.json({ user: users[0], enrollments });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await pool.query('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Admin get courses endpoint
app.get('/api/admin/courses', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});