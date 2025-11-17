# Blog Platform

A full-stack blog platform with separate backend API, CMS, and reader applications.

## Project Structure

```
blog-api/
├── backend/        # Backend API (Express + TypeScript + Prisma)
├── blog-cms/       # Content Management System
├── blog-reader/    # Blog reader application
└── README.md
```

## Getting Started

### Backend API

```bash
cd backend
npm install
npm run dev
```

See [backend/README.md](./backend/README.md) for more details.

### CMS

```bash
cd blog-cms
npm install
npm run dev
```

### Blog Reader

```bash
cd blog-reader
npm install
npm run dev
```

## Development

Each application is independent and can be developed/deployed separately.

