require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});
app.use('/api', limiter);

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => res.json({ status: 'Blog API Ready' }));
app.get('/test', (req, res) => res.json({ test: 'Test route working' }));

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

const gracefulShutdown = async (signal) => {
  server.close(async () => {
    await require('mongoose').connection.close();
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;