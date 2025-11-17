# Blog API Backend

This is the backend API for the blog application.

## Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── comment.controller.ts
│   │   └── post.controller.ts
│   ├── middleware/      # Express middleware
│   │   └── auth.middleware.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── comment.routes.ts
│   │   └── post.routes.ts
│   ├── db.ts           # Prisma client instance
│   └── server.ts       # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── nodemon.json        # Nodemon configuration
└── prisma.config.ts    # Prisma configuration

```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
PORT=3000
```
