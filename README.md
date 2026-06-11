A robust, RESTful Node.js application for managing blog posts. This API supports userauthentication, complete CRUD operations, pagination, search capabilities, and strictly enforcesownership restrictions for protected routes.

FEATURES:
Authentication & Security:  JWT-based authentication, password hashing (Bcrypt), and API• rate limiting.
CRUD Operations:  Create, Read, Update, and Delete blog posts.
• Ownership Restriction:  Users can only update or delete their own blog posts.
• Pagination & Search:  Efficiently fetch blog posts using page, limit, and search query•parameters.
•Data Validation:  Strict input validation using Zod schemas.
• Error Handling:  Centralized asynchronous error handling.
•  Tech Stack
Runtime:  Node.js
• Framework:  Express.js
• Database:  MongoDB & Mongoose
• Authentication:  JSON Web Tokens (JWT) & Bcrypt.js
• Validation:  Zod
• Security:  Helmet, CORS, Express-Rate-Limit
•  Installation & Setup
1. Install dependencies:npm install
2. Set up Environment Variables:
Create a .env  file in the root directory and add the following variables:
PORT=5000MONGO_URI=mongodb://127.0.0.1:27017/blog_api_dbJWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
CLIENT_URL=http://localhost:3000NODE_ENV=development
3. Start the Development Server:
npm run dev
# OR
node app.js 
Database Schemas
User Schema
Fields:
name,email,password,refreshToken
Type:
String,String,String,String
Constraints:
Required, min 2, max 50 chars,Required, Unique, lowercase,Required, min 6 chars (Hashed),Hidden by default (select: false)

Blog Schema:
Field:
title,content,author,tags,timestamps
Type:
String,String,ObjectId,Array,Date
Constraints:
Required, min 3, max 100 chars,Required, min 10 chars,Required, Ref: 'User',Array of Strings,Auto-generated createdAt , updatedAt
API Endpoints:
Authentication Routes ( /api/auth ):

Method    Endpoint    Description                 Auth Required
POST      /register   Register a new user         NO
POST      /login      Authenticate user&get token NO
Blog Routes ( /api/blogs )
Method        Endpoint        Description                       Auth Required
GET         /Get all blogs   (Supports Pagination & Search)     No
GET         /:id              Get a single blog by ID           No
POST        /                 Create a new blog                 Yes
PUT         /:id              Update a blog (Must be the author)Yes
DELETE      /:id              Delete a blog (Must be the author) Yes

Query Parameters for GET /api/blogspage :
 •Page number (default: 1)
 • limit : Number of results per page (default: 10)
 • search : Search query to filter blogs by title or content.
 • Example: GET /api/blogs?page=1&limit=5&search=node