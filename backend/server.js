
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const isAuthenticated = require('./middlewares/isAuthenticated');
require('./config/passport'); // 👈 Initialize strategy



require('dotenv').config();

const PORT = process.env.PORT || 8000;


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Route Mounting 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', isAuthenticated ,  require('./routes/customerRoutes'));
app.use('/api/orders', isAuthenticated , require('./routes/orderRoutes'));
app.use('/api/campaigns', isAuthenticated ,require('./routes/campaignRoutes'));
app.use('/api/delivery', isAuthenticated , require('./routes/deliveryRoutes')); 




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const connectDB = require('./config/DBconnect');
connectDB();


