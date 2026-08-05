import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { UpdateProfileDto } from "../types/user";
import { UpdatePasswordDto } from "../types/user";

export const getProfile = async (userId: string) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


export const updateProfile = async (
    userId: string,
    data: UpdateProfileDto
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (data.name !== undefined) {
        user.name = data.name;
    }

    if (data.bio !== undefined) {
        user.bio = data.bio;
    }

    if (data.profileImage !== undefined) {
        user.profileImage = data.profileImage;
    }

    await user.save();

    return await User.findById(user._id).select("-password");
};

export const updatePassword = async (
  userId: string,
  data: UpdatePasswordDto
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const samePassword = await bcrypt.compare(
    data.newPassword,
    user.password
  );

  if (samePassword) {
    throw new Error("New password must be different from the current password");
  }

  const isMatch = await bcrypt.compare(
    data.currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(data.newPassword, salt);

  await user.save();
};