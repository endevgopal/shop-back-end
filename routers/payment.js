const { getPayment, createPayment } = require('../controllers/payment');
const { auth, authAdmin } = require('../middleware/auth');

const paymentRouter = require('express').Router();

paymentRouter
  .route('/payment')
  .get(auth, authAdmin, getPayment)
  .post(auth, createPayment);

  module.exports = paymentRouter