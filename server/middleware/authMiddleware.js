// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
// We no longer need to import the models here

// This is the main "protect" middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from the header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token to get the user's ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach just the user's ID to the request object.
      // The controller will be responsible for fetching the full profile.
      req.user = { _id: decoded.id };

      next(); // Move to the next step (the controller function)
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// This is an optional middleware to check if the user is an admin.
// For this to work, it must run *after* the controller has fetched the full user profile.
// We will not use this for the /profile route.
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};