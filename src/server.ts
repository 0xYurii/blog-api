import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

dotenv.config();

//const place
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", route);
// Posts routes
app.use("/api/posts", postRoutes);

//test route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Blog API is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
