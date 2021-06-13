const express = require('express');
const {
  registration,
  rf_token,
  login,
  logout,
  getUser,
  addToCart,
  getHistory,
} = require('../controllers/user');
const { auth, authAdmin } = require('../middleware/auth');
const userRouter = express.Router();

userRouter.post('/register', registration);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/refreshToken', rf_token);
userRouter.get('/info', auth, getUser);
userRouter.get('/refreshToken', rf_token);
userRouter.post('/addToCart', auth, addToCart);
userRouter.get('/history', auth, getHistory);

module.exports = userRouter;
