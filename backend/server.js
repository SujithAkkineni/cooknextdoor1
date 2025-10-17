const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from Angular build in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build directory
  const frontendBuildPath = path.join(__dirname, '../frontend/dist/cooknextdoor-frontend/browser');
  app.use(express.static(frontendBuildPath));

  // Handle Angular routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
}

// MongoDB connection with fallback
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cooknextdoor', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.log('⚠️ MongoDB connection failed, running in demo mode');
    console.log('To enable full functionality, please set up MongoDB Atlas or local MongoDB');
    console.log('Demo mode: Authentication and basic features will work with mock data');
  }
};

connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CookNextDoor API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CookNextDoor Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Demo Mode'}`);
});
