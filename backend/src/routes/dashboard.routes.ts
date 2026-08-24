import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware'; // Adjust path to your auth middleware

const router = Router();

// GET /api/dashboard
// Protected so we can show user-specific stats if they are logged in
router.get('/', protect, getDashboardStats);

export default router;