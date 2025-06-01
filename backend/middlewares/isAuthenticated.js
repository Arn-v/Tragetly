

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.warn('Unauthorized access attempt'); // optional
  return res.status(401).json({ message: 'Unauthorized' });
};

