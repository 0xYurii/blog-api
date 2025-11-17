# Blog API Project

A complete full-stack blog application with REST API backend and two React + TypeScript frontends.

## 📁 Project Structure

```
blog-api/
├── backend/        # Express + TypeScript + Prisma REST API
├── blog-reader/    # Public blog site (React + TypeScript)
├── blog-cms/       # Author dashboard (React + TypeScript)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Backend API

The backend provides RESTful APIs for authentication, posts, and comments.

```bash
cd backend
npm install
npm run dev
```

**Runs on:** http://localhost:3000

**Features:**
- User authentication (signup/login)
- CRUD operations for posts
- Comment system (anonymous and authenticated)
- JWT-based authorization

See [backend/README.md](./backend/README.md) for API documentation.

### 2. Blog Reader (Public Site)

Public-facing blog where readers can view posts and leave comments.

```bash
cd blog-reader
npm install
npm run dev
```

**Runs on:** http://localhost:5173/

**Features:**
- View all published posts
- Read individual posts
- User authentication (login/signup)
- User profile page
- Submit comments (anonymous or logged in)
- Responsive design

### 3. Blog CMS (Author Dashboard)

Content management system for authors to manage their posts.

```bash
cd blog-cms
npm install
npm run dev
```

**Runs on:** http://localhost:5174/ (or next available port)

**Features:**
- User signup and authentication
- User profile page with stats
- Login with authentication
- Create, edit, and delete posts
- Publish/unpublish posts
- View comment counts
- Protected routes

## 🛠️ Technology Stack

**Backend:**
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

**Frontends:**
- React 18
- TypeScript
- React Router
- Vite
- CSS (custom styling)

## 👥 Contributors

- [@0xYurii](https://github.com/0xYurii) - Backend & Project Lead
- [@AyoubGhezou](mailto:a.ghezou@esi-sba.dz) - Frontend Development

## 📝 License

This project is open source and available under the ISC License.

