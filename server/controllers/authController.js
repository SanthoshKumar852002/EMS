// controllers/authController.js

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({ success: true, token: 'dummy-token', role: 'admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const verify = (req, res) => {
  res.status(200).json({ success: true, message: 'Token is valid' });
};
