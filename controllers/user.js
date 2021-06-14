const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Payment = require('../models/paymentModel');

exports.registration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await Users.findOne({ email });
    if (user) return res.status(400).json({ msg: 'The email already exists.' });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: 'Password is at least 6 characters long.' });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();

    const accessToken = await createAccessToken({ id: newUser._id });
    const refreshToken = await createRefreshToken({ id: newUser._id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/user/refreshToken',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    res.json({ token: accessToken });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'Please register Yourself.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Password is wrong' });

    const accessToken = await createAccessToken({ id: user._id });
    const refreshToken = await createRefreshToken({ id: user._id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/user/refreshToken',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    res.json({ token: accessToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', { path: '/user/refreshToken' });

    res.json({ msg: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.rf_token = (req, res) => {
  try {
    const rfToken = req.cookies.refreshToken;
    if (!rfToken) return res.status(400).json({ msg: 'Please Login again' });

    jwt.verify(rfToken, process.env.secret, async (err, user) => {
      if (err) return res.status(400).json({ msg: 'Please Login again' });
      const accessToken = await createAccessToken({ id: user.id });
      res.json({ user, token: accessToken });
    });
  } catch (error) {
    return res.status(500).json({ error: e.message });
  }
};

exports.getUser = async (req, res) => {
  const user = await Users.findById(req.user.id);

  res.json({ user });
};

exports.addToCart = async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(400).json({ msg: 'User Does not exist.' });

  await Users.findOneAndUpdate({ _id: req.user.id }, { cart: req.body.cart });
  return res.json({ msg: 'Added to cart.' });
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Payment.find({ user_id: req.user.id });
    res.json(history);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.secret, { expiresIn: '10m' });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.secret, { expiresIn: '1d' });
};
