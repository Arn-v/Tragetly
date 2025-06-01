const express = require('express');
const passport = require('passport');
const router = express.Router();
const { getCurrentUser, logoutUser } = require('../controllers/authController');

// Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: 'https://neuravolt.vercel.app/'
}));

// Get Logged-in User
router.get('/me', getCurrentUser);

// Logout
router.get('/logout', logoutUser);

module.exports = router;
