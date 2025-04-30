require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/users.js');
const pcBuildModel = require('./models/pcbuilds.js');
const authRoutes = require('./routes/auth');
const componentRoutes = require('./routes/components');
const inventoryRoutes = require('./routes/inventory');
const userPcBuildRoutes = require('./routes/userPcBuilds');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  // Start server only after successful database connection
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/pcbuilds', userPcBuildRoutes);

app.get('/getusers', async (req, res) => {
    userModel.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err.message }))   
})

app.get('/getpcbuilds', async (req, res) => {
    pcBuildModel.find()
    .then(pcbuilds => res.json(pcbuilds))
    .catch(err => res.status(500).json({ message: err.message }))   
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});