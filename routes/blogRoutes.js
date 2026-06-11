const express = require('express');
const router  = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const protect = require('../middlewares/authMiddleware');
const { validate, createBlogSchema, updateBlogSchema }
  = require('../validators/blogValidator');

// Public routes
router.get('/',    getAllBlogs);
router.get('/:id', getBlog);

// Protected routes
router.post('/',      protect, validate(createBlogSchema), createBlog);
router.put('/:id',    protect, validate(updateBlogSchema), updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;