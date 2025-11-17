import Router from "express";
import { signup, login, getCurrentUser } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const route = Router();

route.post("/signup", signup);
route.post("/login", login);
route.get("/me", authenticateToken, getCurrentUser);

export default route;
