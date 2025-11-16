import Router from "express";
import { signup, login } from "../controllers/auth.controller";

const route = Router();

route.post("/signup", signup);
route.post("/login", login);

export default route;
