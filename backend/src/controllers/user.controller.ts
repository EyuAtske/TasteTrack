import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
    getProfile,
    updateProfile,
    updatePassword
} from "../services/user.service";

export const getUserProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const user = await getProfile(req.user!._id.toString());

        res.status(200).json(user);
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export const updateUserProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const updatedUser = await updateProfile(
            req.user!._id.toString(),
            req.body
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export const updateUserPassword = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { currentPassword, newPassword } = req.body;

        await updatePassword(req.user!._id.toString(), {
            currentPassword,
            newPassword,
        });

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};