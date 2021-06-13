const {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/category');

const categoryRouter = require('express').Router();
const { auth, authAdmin } = require('../middleware/auth');

categoryRouter
  .route('/category')
  .get(getCategory)
  .post(auth, authAdmin, createCategory);

categoryRouter
  .route('/category/:id')
  .delete(auth, authAdmin, deleteCategory)
  .put(auth, authAdmin, updateCategory);

module.exports = categoryRouter;
