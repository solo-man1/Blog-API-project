const { z } = require('zod');
const mongoose=require('mongoose');

const createBlogSchema = z.object({
  title:   z.string().min(3,  'Title min 3 chars').max(100),
  content: z.string().min(10, 'Content min 10 chars'),
  tags:    z.array(z.string()).optional()
});

const updateBlogSchema = z.object({
  title:   z.string().min(3).max(100).optional(),
  content: z.string().min(10).optional(),
  tags:    z.array(z.string()).optional()
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(e => ({
      field:   e.path[0],
      message: e.message
    }));
    return res.status(400).json({ success: false, errors });
  }
  req.body = result.data;
  next();
};

module.exports = ({validate,createBlogSchema,updateBlogSchema});