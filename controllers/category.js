const Category = require('../models/categoryModel');

exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOne({ name });
    if (category)
      return res.status(400).json({ msg: 'This category already exists.' });

    const newCategories = new Category({ name });
    await newCategories.save();
    res.json(newCategories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Category Deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { name }
    );
    res.json({ msg: 'Category Updated' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
