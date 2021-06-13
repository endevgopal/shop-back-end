const productRouter = require('express').Router();
const {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../controllers/product');
const { auth, authAdmin } = require('../middleware/auth');

productRouter
  .route('/products')
  .get(getProduct)
  .post(auth, authAdmin, createProduct);

productRouter
  .route('/products/:id')
  .delete(auth, authAdmin, deleteProduct)
  .put(auth, authAdmin, updateProduct);

module.exports = productRouter;
