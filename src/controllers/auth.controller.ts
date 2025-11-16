import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const check_email = await prisma.user.findUnique({
      where: { email: email },
    });
    if (check_email) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
