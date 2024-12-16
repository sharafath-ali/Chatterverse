import express from 'express'
import { login, signup, logout, updateProfile, checkAuth } from '../controllers/authController.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.put("/update-profile", protectRoute, updateProfile);
router.get("/checkAuth", protectRoute, checkAuth);

export default router