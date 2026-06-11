const Blog = require('../models/Blog');
const asyncHandler = require('../middlewares/asyncHandler');

// POST /api/blogs — Create blog (protected)
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  const blog = await Blog.create({
    title,
    content,
    tags,
    author: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    blog
  });
});

// GET /api/blogs — Get all blogs (public)
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 ,search=' '} = req.query;
  const query = search
    ? {$or: [{ title: { $regex: search, $options: 'i' } },
       { content: { $regex: search, $options: 'i' } }]}
    : {};
    const skip=(parseInt(page) - 1) * parseInt(limit);
    const blogs = await Blog.find(query)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  const total = await Blog.countDocuments(query);
  res.json({
    success: true,
    count: blogs.length,
    total,
    currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    blogs
  });
});

// GET /api/blogs/:id — Get single blog (public)
exports.getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name email');

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  res.json({ success: true, blog });
});

// PUT /api/blogs/:id — Update blog (protected)
exports.updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not allowed to update this blog'
    });
  }

  blog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Blog updated successfully',
    blog
  });
});

// DELETE /api/blogs/:id — Delete blog (protected)
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not allowed to delete this blog'
    });
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Blog deleted successfully'
  });
});