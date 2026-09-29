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
        const { name, bio, profileImage } = req.body;

        if (
            name !== undefined &&
            (typeof name !== "string" || !name.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must be a non-empty string",
            });
        }

        if (
            bio !== undefined &&
            typeof bio !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Bio must be a string",
            });
        }

        if (
            profileImage !== undefined &&
            typeof profileImage !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Profile image must be a string",
            });
        }

        const updatedUser = await updateProfile(
            req.user!._id.toString(),
            {
                name: name?.trim(),
                bio,
                profileImage,
            }
        );

        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
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

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string" ||
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

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