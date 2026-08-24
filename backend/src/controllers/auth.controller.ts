import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
} from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const { user, token } = await registerUser(
      name,
      email,
      password
    );

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(
      email,
      password
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};