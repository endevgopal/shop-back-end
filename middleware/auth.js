const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
   
    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' });

    jwt.verify(token, process.env.secret, (err, user) => {
      if (err) return res.status(400).json({ msg: 'Invalid Authenticatiosn.' });

      req.user = user;
      
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id);
    if (user.role === 0) {
      return res.status(400).json({ msg: 'Admin resource access denied' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
