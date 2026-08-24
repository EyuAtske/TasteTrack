import { Router } from 'express';
import { 
    getFavorites, 
    addFavorite, 
    removeFavorite 
} from '../controllers/favorite.controller';
import { protect } from '../middleware/auth.middleware'; // Adjust path to your auth middleware

const router = Router();

// All favorite routes require the user to be logged in
router.use(protect);

// GET /api/favorites
router.get('/', getFavorites);

// POST /api/favorites
router.post('/', addFavorite);

// DELETE /api/favorites/:id
router.delete('/:id', removeFavorite);

export default router;