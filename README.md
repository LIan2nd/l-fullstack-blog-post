# L's Blog Post

A fullstack blog application built with the MERN stack (MongoDB, Express, React, Node.js). Features include user authentication, blog post management, commenting system, user profiles with image upload, search, and pagination.

## 📋 Table of Contents

- [Project Setup](#project-setup)
- [Backend API Structure](#backend-api-structure)
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## 🚀 Project Setup

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LIan2nd/l-fullstack-blog-post.git
   cd l-fullstack-blog-post
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/blog
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Running Locally

1. **Start the Backend** (runs on port 3000 by default)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend** (runs on port 5173 by default)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

---

## 📡 Backend API Structure

The backend is a RESTful API built with Express.js and MongoDB.

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and get JWT token |

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "username": "john",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 📝 Post Routes (`/api/posts`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all posts (with search & pagination) |
| GET | `/:id` | Public | Get single post with comments |
| POST | `/` | Private | Create new post |
| PUT | `/:id` | Private | Update post (author only) |
| DELETE | `/:id` | Private | Delete post (author only) |

#### Get All Posts (with search & pagination)
```http
GET /api/posts?search=keyword&page=1&limit=6
```

**Query Parameters:**
- `search` - Filter posts by title or content (optional)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 6)

**Response:**
```json
{
  "posts": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalPosts": 30
}
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my post..."
}
```

---

### 💬 Comment Routes (`/api`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/posts/:postId/comments` | Private | Create comment on a post |
| DELETE | `/comments/:id` | Private | Delete comment (author only) |

#### Create Comment
```http
POST /api/posts/:postId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!"
}
```

---

### 👤 User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/profile` | Private | Get current user profile |
| PUT | `/profile` | Private | Update profile (name & photo) |
| GET | `/:id` | Public | Get public user profile |
| GET | `/:id/posts` | Public | Get all posts by a user |

#### Update Profile (with image upload)
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "New Name"
profilePic: <image_file>
```

**Supported image types:** JPEG, PNG, GIF, WebP (max 5MB)

---

## 🎨 Design Decisions & Assumptions

### Architecture

1. **Monorepo Structure**: The project uses a simple monorepo with separate `frontend` and `backend` directories. This allows for easy development while keeping concerns separated.

2. **RESTful API**: The backend follows REST conventions for predictable and standard API interactions.

3. **JWT Authentication**: Stateless authentication using JSON Web Tokens stored on the client side. Tokens are sent via the Authorization header.

### Backend

1. **MongoDB + Mongoose**: Chosen for flexible schema design and easy integration with Node.js. Mongoose provides schema validation and middleware hooks.

2. **Password Hashing**: User passwords are hashed using bcrypt before storage. The hashing occurs in a Mongoose pre-save middleware.

3. **File Uploads with Multer**: Profile pictures are uploaded to the `/uploads` directory on the server. Old profile pictures are automatically deleted when a new one is uploaded.

4. **Username Generation**: Usernames are automatically derived from the email address (part before @) during registration.

5. **Authorization**: Post and comment modifications are restricted to their respective authors. This is validated at the controller level.

### Frontend

1. **React + TypeScript + Vite**: Modern frontend stack for type safety and fast development experience.

2. **Zustand**: Lightweight state management for authentication state.

3. **React Hook Form + Zod**: Form handling with schema-based validation for robust user input handling.

4. **Shadcn/ui Components**: Pre-built, accessible UI components for consistent design.

5. **React Markdown**: Blog post content supports Markdown formatting for rich text display.

6. **Axios with Interceptors**: Centralized API client with automatic token injection for authenticated requests.

### Assumptions

1. **Single Author per Post/Comment**: Each post and comment has exactly one author. There is no collaborative editing.

2. **No Email Verification**: Users can register and immediately use the platform without email verification.

3. **Local File Storage**: Uploaded images are stored locally. For production, consider using cloud storage (S3, Cloudinary, etc.).

4. **No Rate Limiting**: The API does not implement rate limiting. Consider adding this for production.

5. **Cascading Deletes**: When a post is deleted, all its associated comments are also deleted.

---

## 📁 Project Structure

```
fullstack-blog-post/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & upload middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Helper functions
│   │   └── app.js          # Express app entry point
│   ├── uploads/            # Uploaded profile pictures
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── posts/      # Blog posts
│   │   │   └── profile/    # User profiles
│   │   ├── lib/            # Utilities & axios config
│   │   └── store/          # Zustand stores
│   └── package.json
│
└── README.md
```