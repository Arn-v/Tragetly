
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

// Add this middleware before your other middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// Route Mounting 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', isAuthenticated ,  require('./routes/customerRoutes'));
app.use('/api/orders', isAuthenticated , require('./routes/orderRoutes'));
app.use('/api/campaigns', isAuthenticated ,require('./routes/campaignRoutes'));
app.use('/api/delivery',  require('./routes/deliveryRoutes'));  //removed autN to make vendor simulator aceess my delivery apis

//adding error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


app.listen(PORT, () => console.log(`\n\n Server running on port ${PORT} \nhttp://localhost:${PORT} \n\n` ));


const connectDB = require('./config/DBconnect');
connectDB();


