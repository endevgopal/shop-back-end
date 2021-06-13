const Payment = require('../models/paymentModel');
const Users = require('../models/userModel');
const Product = require('../models/productModel');

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.find();
    res.json(payment);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
exports.createPayment = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('name email');
    if (!user) return res.status(400).json({ msg: 'User does not exist.' });

    const { cart, paymentID, address } = req.body;
    const { _id, name, email } = user;
    const newPayment = new Payment({
      user_id: _id,
      name,
      email,
      cart,
      paymentID,
      address,
    });

    cart.filter((item) => {
      return sold(item._id, item.quantity, item.sold);
    });
    await newPayment.save();
    res.json({ newPayment });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const sold = async (id, quantity, oldSold) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};
