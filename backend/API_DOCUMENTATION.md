# Blog API - Complete Backend Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [API Endpoints](#api-endpoints)
7. [Controllers Explained](#controllers-explained)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Testing the API](#testing-the-api)

---

## Overview

The Blog API is a RESTful backend service built with **Express.js**, **TypeScript**, and **Prisma ORM**. It provides a complete blogging platform with:

- **User Authentication** (JWT-based)
- **Post Management** (Create, Read, Update, Delete, Publish)
- **Comment System** (Anonymous & Authenticated users)
- **Role-based Access Control**

**Tech Stack:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

---

## Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher
- **npm** or **yarn**
- **PostgreSQL** database (local or remote)

### Step 1: Clone the Repository

```bash
git clone https://github.com/0xYurii/blog-api.git
cd blog-api/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all necessary packages including:
- `express` - Web framework
- `@prisma/client` - Database client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- TypeScript and related dev dependencies

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following environment variables:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"

# JWT Secret (use a strong, random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port
PORT=3000
```

**Important Notes:**
- Replace `username`, `password`, and `blog_db` with your PostgreSQL credentials
- Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)
- Never commit `.env` to version control!

### Step 4: Set Up the Database

#### 4.1 Create PostgreSQL Database

Connect to PostgreSQL and create a database:

```bash
# Using psql
psql -U postgres
CREATE DATABASE blog_db;
\q
```

Or use a GUI tool like pgAdmin, DBeaver, or Postico.

#### 4.2 Run Prisma Migrations

Generate the Prisma Client and apply database migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create database tables
npx prisma migrate deploy
```

This will create the following tables:
- `User` - Stores user accounts
- `Post` - Stores blog posts
- `Comment` - Stores comments on posts
- `_prisma_migrations` - Tracks migration history

#### 4.3 (Optional) Seed the Database

If you want to add sample data for testing, you can create a seed file or use Prisma Studio:

```bash
# Open Prisma Studio to view/edit data
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can manually add test users and posts.

### Step 5: Run the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`. You should see:

```
🚀 Server running on http://localhost:3000
```

### Step 6: Verify Installation

Test the health check endpoint:

```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "message": "Blog API is running!"
}
```

### Step 7: Build for Production

To compile TypeScript to JavaScript:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

---

## Architecture

### Project Structure

```
backend/
├── src/
│   ├── controllers/          # Business logic for each feature
│   │   ├── auth.controller.ts      # Authentication logic
│   │   ├── post.controller.ts      # Post management logic
│   │   └── comment.controller.ts   # Comment management logic
│   ├── middleware/           # Express middleware
│   │   └── auth.middleware.ts      # JWT authentication
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.ts          # Auth endpoints
│   │   ├── post.routes.ts          # Post endpoints
│   │   └── comment.routes.ts       # Comment endpoints
│   ├── db.ts                 # Prisma client instance
│   └── server.ts             # Express app setup & entry point
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migration files
├── .env                      # Environment variables (gitignored)
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── nodemon.json              # Development server config
```

### Request Flow

1. **Client Request** → HTTP request sent to API endpoint
2. **Route Handler** → Express router matches the URL and HTTP method
3. **Middleware** → Authentication/validation middleware runs
4. **Controller** → Business logic processes the request
5. **Database** → Prisma executes queries on PostgreSQL
6. **Response** → JSON response sent back to client

Example Flow for Creating a Post:
```
POST /api/posts
  ↓
post.routes.ts (Router)
  ↓
authenticateToken (Middleware) - Verifies JWT
  ↓
createPost (Controller) - Creates post in database
  ↓
Prisma → PostgreSQL
  ↓
JSON Response with created post
```

---

## Database Schema

The application uses three main models:

### User Model

Stores user account information.

```prisma
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String    // Hashed with bcrypt
  email     String    @unique
  role      Role      @default(USER)
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
}
```

**Fields:**
- `id` - Auto-incrementing primary key
- `username` - Unique username
- `password` - Bcrypt-hashed password (never stored in plain text)
- `email` - Unique email address
- `role` - User role (USER, AUTHOR, ADMIN, SUPER_ADMIN)
- `posts` - Relation to user's posts
- `comments` - Relation to user's comments
- `createdAt` - Account creation timestamp

### Post Model

Stores blog posts.

```prisma
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?   @db.Text
  published Boolean   @default(false)
  authorId  Int
  user      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  createdAt DateTime  @default(now())
}
```

**Fields:**
- `id` - Auto-incrementing primary key
- `title` - Post title
- `content` - Post content (Text type for long content)
- `published` - Publication status (draft vs published)
- `authorId` - Foreign key to User
- `user` - Relation to post author
- `comments` - Relation to post comments
- `createdAt` - Post creation timestamp

**Cascade Delete:** When a user is deleted, all their posts are deleted.

### Comment Model

Stores comments on posts (supports both authenticated and anonymous users).

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  username  String?  // For anonymous users
  email     String?  // For anonymous users
  userId    Int?     // For authenticated users
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

**Fields:**
- `id` - Auto-incrementing primary key
- `content` - Comment text
- `username` - Username for anonymous commenters (nullable)
- `email` - Email for anonymous commenters (nullable)
- `userId` - Foreign key to User (nullable for anonymous)
- `user` - Relation to authenticated user
- `postId` - Foreign key to Post
- `post` - Relation to commented post
- `createdAt` - Comment creation timestamp

**Delete Behavior:**
- When a user is deleted, `userId` is set to NULL (comment remains)
- When a post is deleted, all its comments are deleted (cascade)

### Role Enum

User roles for access control:

```prisma
enum Role {
  USER          // Regular user (can comment, view)
  ADMIN         // Admin user
  AUTHOR        // Content author
  SUPER_ADMIN   // Super admin
}
```

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for stateless authentication.

### How It Works

1. **Sign Up/Login** → User provides credentials
2. **Token Generation** → Server creates JWT with user ID
3. **Token Storage** → Client stores token (localStorage/cookies)
4. **Authenticated Requests** → Client sends token in Authorization header
5. **Token Verification** → Server verifies and extracts user ID
6. **Access Control** → Server allows/denies based on user identity

### JWT Token Structure

```javascript
{
  "userId": 123,
  "iat": 1699876543,  // Issued at
  "exp": 1700481343   // Expires in 7 days
}
```

### Password Security

- Passwords are hashed using **bcryptjs** with salt rounds of 10
- Plain text passwords are never stored
- Comparison uses bcrypt's secure comparison function

### Authorization Header Format

```
Authorization: Bearer <jwt_token>
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/signup` | No | Create new user account |
| POST | `/auth/login` | No | Login and receive JWT |
| GET | `/auth/me` | Yes | Get current user profile |

### Post Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/posts` | Optional | Get all posts (published only if not authenticated) |
| GET | `/posts/:id` | No | Get single post with comments |
| POST | `/posts` | Yes | Create new post |
| PUT | `/posts/:id` | Yes | Update post (author only) |
| DELETE | `/posts/:id` | Yes | Delete post (author only) |
| PATCH | `/posts/:id/publish` | Yes | Toggle publish status (author only) |

### Comment Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/posts/:postId/comments` | No | Get all comments for a post |
| POST | `/posts/:postId/comments` | Optional | Create comment (anonymous or authenticated) |
| DELETE | `/comments/:id` | Yes | Delete comment (author or post owner) |

---

## Controllers Explained

Controllers contain the business logic for handling requests. Each controller exports functions that process specific operations.

### 1. Authentication Controller (`auth.controller.ts`)

Handles user registration, login, and profile retrieval.

#### **signup** - User Registration

```typescript
POST /api/auth/signup
```

**What it does:**
1. Extracts `username`, `email`, `password` from request body
2. Checks if email already exists in database
3. Hashes the password using bcrypt (10 salt rounds)
4. Creates new user in database
5. Generates JWT token (expires in 7 days)
6. Returns token and user data (without password)

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-11-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Email already exists
- `500 Internal Server Error` - Database or server error

**Security Features:**
- Password is hashed with bcrypt (salt rounds: 10)
- Email uniqueness enforced by database constraint
- JWT contains only user ID (no sensitive data)

---

#### **login** - User Authentication

```typescript
POST /api/auth/login
```

**What it does:**
1. Extracts `email` and `password` from request body
2. Searches for user by email in database
3. Compares provided password with stored hash using bcrypt
4. Generates JWT token if credentials are valid
5. Returns token and user data

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-11-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - User not found or invalid password
- `500 Internal Server Error` - Database or server error

**Security Features:**
- Bcrypt comparison (constant-time, prevents timing attacks)
- Generic error message (doesn't reveal if email exists)
- JWT expires in 7 days

---

#### **getCurrentUser** - Get User Profile

```typescript
GET /api/auth/me
Authorization: Bearer <token>
```

**What it does:**
1. Extracts `userId` from JWT (set by auth middleware)
2. Fetches user data from database (excluding password)
3. Returns user profile

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2024-11-17T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - No token provided
- `403 Forbidden` - Invalid or expired token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Database error

---

### 2. Post Controller (`post.controller.ts`)

Handles all post-related operations (CRUD + publish/unpublish).

#### **createPost** - Create New Post

```typescript
POST /api/posts
Authorization: Bearer <token>
```

**What it does:**
1. Extracts `title` and `content` from request body
2. Gets `authorId` from authenticated user (via JWT)
3. Creates post in database (default: unpublished)
4. Returns created post with author info and comment count

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post..."
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "published": false,
  "authorId": 1,
  "createdAt": "2024-11-17T10:30:00.000Z",
  "author": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "_count": {
    "comments": 0
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Invalid token
- `500 Internal Server Error` - Database error

**Business Rules:**
- Posts are created as drafts (`published: false`) by default
- Only authenticated users can create posts
- Author is automatically set to authenticated user

---

#### **getAllPosts** - Get All Posts

```typescript
GET /api/posts
Authorization: Bearer <token> (Optional)
```

**What it does:**
1. Checks if user is authenticated (optional)
2. If authenticated: Returns ALL posts (including drafts)
3. If not authenticated: Returns only published posts
4. Includes author info and comment count
5. Ordered by creation date (newest first)

**Request Headers (Optional):**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": 2,
    "title": "Second Post",
    "content": "Content here...",
    "published": true,
    "authorId": 1,
    "createdAt": "2024-11-17T11:00:00.000Z",
    "author": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "_count": {
      "comments": 5
    }
  },
  {
    "id": 1,
    "title": "First Post",
    "content": "Content here...",
    "published": false,
    "authorId": 1,
    "createdAt": "2024-11-17T10:30:00.000Z",
    "author": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "_count": {
      "comments": 0
    }
  }
]
```

**Error Responses:**
- `500 Internal Server Error` - Database error

**Business Rules:**
- Public access: Only published posts visible
- Authenticated users: See all posts (for CMS dashboard)
- Posts sorted newest first

---

#### **getSinglePost** - Get Post by ID

```typescript
GET /api/posts/:id
```

**What it does:**
1. Extracts post ID from URL parameter
2. Validates ID is a number
3. Fetches post with author info, all comments, and comment count
4. Returns 404 if post not found

**URL Parameters:**
- `id` - Post ID (integer)

**Example Request:**
```
GET /api/posts/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content...",
  "published": true,
  "authorId": 1,
  "createdAt": "2024-11-17T10:30:00.000Z",
  "author": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "comments": [
    {
      "id": 1,
      "content": "Great post!",
      "userId": 2,
      "username": null,
      "email": null,
      "postId": 1,
      "createdAt": "2024-11-17T11:00:00.000Z",
      "user": {
        "id": 2,
        "username": "janedoe"
      }
    },
    {
      "id": 2,
      "content": "Thanks for sharing!",
      "userId": null,
      "username": "Anonymous",
      "email": "anon@example.com",
      "postId": 1,
      "createdAt": "2024-11-17T11:05:00.000Z",
      "user": null
    }
  ],
  "_count": {
    "comments": 2
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid post ID (not a number)
- `404 Not Found` - Post doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Comments are included in the response
- Comments sorted newest first
- No authentication required (public endpoint)

---

#### **updatePost** - Update Post

```typescript
PUT /api/posts/:id
Authorization: Bearer <token>
```

**What it does:**
1. Extracts post ID from URL and validates it
2. Gets `title` and `content` from request body
3. Verifies user owns the post (authorization check)
4. Updates post in database
5. Returns updated post

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Post Title",
  "content": "Updated content..."
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Updated Post Title",
  "content": "Updated content...",
  "published": false,
  "authorId": 1,
  "createdAt": "2024-11-17T10:30:00.000Z",
  "author": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "_count": {
    "comments": 2
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid post ID
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - User doesn't own the post
- `404 Not Found` - Post doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Only post author can update
- Published status is NOT changed by this endpoint
- Use PATCH `/posts/:id/publish` to change publish status

---

#### **deletePost** - Delete Post

```typescript
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**What it does:**
1. Extracts and validates post ID
2. Verifies post exists
3. Checks user owns the post
4. Deletes post from database (cascades to delete comments)
5. Returns success message

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid post ID
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - User doesn't own the post
- `404 Not Found` - Post doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Only post author can delete
- Deleting a post also deletes all its comments (cascade)
- Permanent deletion (no soft delete)

---

#### **togglePublish** - Toggle Post Publication Status

```typescript
PATCH /api/posts/:id/publish
Authorization: Bearer <token>
```

**What it does:**
1. Extracts and validates post ID
2. Fetches current publish status
3. Verifies user owns the post
4. Toggles `published` field (true ↔ false)
5. Returns updated post

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content...",
  "published": true,  // Toggled from false to true
  "authorId": 1,
  "createdAt": "2024-11-17T10:30:00.000Z",
  "author": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "_count": {
    "comments": 2
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid post ID
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - User doesn't own the post
- `404 Not Found` - Post doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Only post author can toggle publish status
- Published posts appear on public blog
- Unpublished posts (drafts) only visible to authenticated users

---

### 3. Comment Controller (`comment.controller.ts`)

Handles comment creation, retrieval, and deletion. Supports both authenticated and anonymous users.

#### **getPostComments** - Get All Comments for a Post

```typescript
GET /api/posts/:postId/comments
```

**What it does:**
1. Extracts and validates post ID
2. Verifies post exists
3. Fetches all comments for the post
4. Returns comments with author usernames
5. Sorted newest first

**URL Parameters:**
- `postId` - Post ID (integer)

**Example Request:**
```
GET /api/posts/1/comments
```

**Success Response (200):**
```json
[
  {
    "id": 2,
    "content": "Thanks for sharing!",
    "userId": null,
    "username": "Anonymous",
    "email": "anon@example.com",
    "postId": 1,
    "createdAt": "2024-11-17T11:05:00.000Z",
    "user": null
  },
  {
    "id": 1,
    "content": "Great post!",
    "userId": 2,
    "username": null,
    "email": null,
    "postId": 1,
    "createdAt": "2024-11-17T11:00:00.000Z",
    "user": {
      "username": "janedoe"
    }
  }
]
```

**Error Responses:**
- `400 Bad Request` - Invalid post ID
- `404 Not Found` - Post doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Public endpoint (no authentication required)
- Returns both authenticated and anonymous comments
- Comments sorted newest first

---

#### **createComment** - Create Comment

```typescript
POST /api/posts/:postId/comments
Authorization: Bearer <token> (Optional)
```

**What it does:**
1. Extracts post ID and validates it
2. Checks if user is authenticated (optional)
3. If authenticated: Uses user ID, ignores username/email
4. If not authenticated: Requires username and email
5. Creates comment in database
6. Returns created comment

**Request Headers (Optional):**
```
Authorization: Bearer <token>
```

**Request Body (Authenticated User):**
```json
{
  "content": "Great post!"
}
```

**Request Body (Anonymous User):**
```json
{
  "content": "Thanks for sharing!",
  "username": "Anonymous Reader",
  "email": "reader@example.com"
}
```

**Alternative Field Names (also supported):**
```json
{
  "content": "Thanks for sharing!",
  "authorName": "Anonymous Reader",
  "authorEmail": "reader@example.com"
}
```

**Success Response (201):**
```json
{
  "id": 3,
  "content": "Great post!",
  "userId": 2,
  "username": null,
  "email": null,
  "postId": 1,
  "createdAt": "2024-11-17T12:00:00.000Z",
  "user": {
    "username": "janedoe"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid post ID or missing username/email (for anonymous)
- `404 Not Found` - Post doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Authenticated users: Only need to provide `content`
- Anonymous users: Must provide `content`, `username`, `email`
- Supports both field naming conventions:
  - `username`/`email`
  - `authorName`/`authorEmail`
- Post must exist to add comment

---

#### **deleteComment** - Delete Comment

```typescript
DELETE /api/comments/:id
Authorization: Bearer <token>
```

**What it does:**
1. Extracts and validates comment ID
2. Fetches comment with post author info
3. Checks authorization:
   - User owns the comment, OR
   - User owns the post the comment is on
4. Deletes comment from database
5. Returns success message

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Comment deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid comment ID
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - User doesn't own comment or post
- `404 Not Found` - Comment doesn't exist
- `500 Internal Server Error` - Database error

**Business Rules:**
- Comment author can delete their own comment
- Post author can delete any comment on their post
- Anonymous comments can only be deleted by post author
- Deleted comments are permanently removed

---

## Middleware

### Authentication Middleware (`auth.middleware.ts`)

Contains two middleware functions for JWT verification.

#### **authenticateToken** - Required Authentication

**What it does:**
1. Extracts JWT from `Authorization` header (`Bearer <token>`)
2. Verifies token signature using `JWT_SECRET`
3. Decodes token to get user ID
4. Attaches `userId` to request object
5. Calls `next()` to continue to controller
6. Returns 401/403 if token is missing/invalid

**Usage in Routes:**
```typescript
router.post("/posts", authenticateToken, createPost);
```

**Error Responses:**
- `401 Unauthorized` - No token provided
- `403 Forbidden` - Invalid or expired token

**TypeScript Type Extension:**
```typescript
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
```

---

#### **optionalAuth** - Optional Authentication

**What it does:**
1. Checks for JWT in `Authorization` header
2. If token exists: Verifies and attaches `userId` to request
3. If token invalid: Continues without `userId` (doesn't fail)
4. If no token: Continues without `userId`
5. Always calls `next()` (never blocks request)

**Usage in Routes:**
```typescript
router.get("/posts", optionalAuth, getAllPosts);
router.post("/posts/:postId/comments", optionalAuth, createComment);
```

**Use Cases:**
- Endpoints that behave differently for authenticated users
- Public endpoints that offer extra features to logged-in users
- Comments (anonymous users can comment, logged-in users auto-filled)

---

## Error Handling

### Error Response Format

All errors return JSON with consistent structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

Or:

```json
{
  "message": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | No authentication token provided |
| 403 | Forbidden | Invalid token or insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Database or server error |

### Common Error Scenarios

#### 1. Invalid Authentication Token
```json
{
  "error": "Invalid or expired token"
}
```
**Status:** 403 Forbidden

#### 2. Missing Authentication
```json
{
  "error": "Access token required"
}
```
**Status:** 401 Unauthorized

#### 3. Resource Not Found
```json
{
  "error": "Post not found"
}
```
**Status:** 404 Not Found

#### 4. Authorization Failure
```json
{
  "error": "Not authorized"
}
```
**Status:** 403 Forbidden

#### 5. Duplicate Email
```json
{
  "error": "User already exists"
}
```
**Status:** 400 Bad Request

#### 6. Invalid Credentials
```json
{
  "message": "Invalid credentials"
}
```
**Status:** 401 Unauthorized

---

## Testing the API

### Using cURL

#### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

#### 3. Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Create Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Test Post",
    "content": "This is test content"
  }'
```

#### 5. Get All Posts
```bash
curl -X GET http://localhost:3000/api/posts
```

#### 6. Publish Post
```bash
curl -X PATCH http://localhost:3000/api/posts/1/publish \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 7. Create Anonymous Comment
```bash
curl -X POST http://localhost:3000/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!",
    "username": "Anonymous",
    "email": "anon@example.com"
  }'
```

#### 8. Create Authenticated Comment
```bash
curl -X POST http://localhost:3000/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great post!"
  }'
```

### Using Postman

1. **Import Collection:**
   - Create a new Postman collection
   - Add environment variable: `baseUrl = http://localhost:3000`
   - Add environment variable: `token` (will be set after login)

2. **Set Up Requests:**
   - Auth > Sign Up: `POST {{baseUrl}}/api/auth/signup`
   - Auth > Login: `POST {{baseUrl}}/api/auth/login`
   - Auth > Get Me: `GET {{baseUrl}}/api/auth/me`
   - Posts > Create: `POST {{baseUrl}}/api/posts`
   - Posts > Get All: `GET {{baseUrl}}/api/posts`
   - Posts > Get One: `GET {{baseUrl}}/api/posts/:id`
   - Posts > Update: `PUT {{baseUrl}}/api/posts/:id`
   - Posts > Delete: `DELETE {{baseUrl}}/api/posts/:id`
   - Posts > Publish: `PATCH {{baseUrl}}/api/posts/:id/publish`
   - Comments > Get: `GET {{baseUrl}}/api/posts/:postId/comments`
   - Comments > Create: `POST {{baseUrl}}/api/posts/:postId/comments`
   - Comments > Delete: `DELETE {{baseUrl}}/api/comments/:id`

3. **Authorization Setup:**
   - For protected routes, add to Headers tab:
   ```
   Authorization: Bearer {{token}}
   ```

### Using REST Client (VS Code Extension)

Create a file `api-test.http`:

```http
### Sign Up
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Current User
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE

### Create Post
POST http://localhost:3000/api/posts
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "title": "Test Post",
  "content": "Test content"
}

### Get All Posts
GET http://localhost:3000/api/posts

### Get Single Post
GET http://localhost:3000/api/posts/1

### Update Post
PUT http://localhost:3000/api/posts/1
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "title": "Updated Title",
  "content": "Updated content"
}

### Toggle Publish
PATCH http://localhost:3000/api/posts/1/publish
Authorization: Bearer YOUR_TOKEN_HERE

### Delete Post
DELETE http://localhost:3000/api/posts/1
Authorization: Bearer YOUR_TOKEN_HERE

### Get Post Comments
GET http://localhost:3000/api/posts/1/comments

### Create Anonymous Comment
POST http://localhost:3000/api/posts/1/comments
Content-Type: application/json

{
  "content": "Great post!",
  "username": "Anonymous",
  "email": "anon@example.com"
}

### Create Authenticated Comment
POST http://localhost:3000/api/posts/1/comments
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "content": "Great post!"
}

### Delete Comment
DELETE http://localhost:3000/api/comments/1
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@production-host:5432/blog_db?schema=public"
JWT_SECRET="use-a-very-strong-random-secret-here"
PORT=3000
NODE_ENV=production
```

### Build and Run

```bash
# Install dependencies
npm install --production

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build TypeScript
npm run build

# Start server
npm start
```

### Security Considerations

1. **Use strong JWT_SECRET** (minimum 32 characters, random)
2. **Use HTTPS** in production (SSL/TLS)
3. **Set secure CORS policies** (whitelist specific origins)
4. **Rate limiting** (consider using `express-rate-limit`)
5. **Helmet.js** (already included - adds security headers)
6. **Environment variables** (never commit `.env` to Git)
7. **Database credentials** (use strong passwords, restrict access)
8. **Regular updates** (keep dependencies up to date)

### Recommended Hosting Platforms

- **Backend:** Railway, Render, Heroku, DigitalOcean, AWS
- **Database:** Supabase, Railway, Render, AWS RDS, DigitalOcean Managed PostgreSQL

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify `DATABASE_URL` in `.env`
- Ensure database exists: `psql -U postgres -l`

#### 2. JWT Secret Missing
```
Error: JWT_SECRET is not defined
```
**Solution:**
- Add `JWT_SECRET` to `.env` file
- Restart development server

#### 3. Prisma Client Not Generated
```
Error: Cannot find module '@prisma/client'
```
**Solution:**
```bash
npx prisma generate
```

#### 4. Migration Failed
```
Error: Migration failed to apply
```
**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix_migration
```

#### 5. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

---

## Additional Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **Express.js Guide:** https://expressjs.com/en/guide/routing.html
- **JWT Introduction:** https://jwt.io/introduction
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

## Support

For issues or questions:
- Create an issue on GitHub: https://github.com/0xYurii/blog-api/issues
- Contact: [@0xYurii](https://github.com/0xYurii)

---

## License

ISC License - see LICENSE file for details.

---

**Last Updated:** November 17, 2024
