import { Router } from "express";
import {
    getUserProfile,
    updateUserPassword,
    updateUserProfile,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.put("/password", protect, updateUserPassword);

export default router;