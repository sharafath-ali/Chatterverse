import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.model.js'

dotenv.config()

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'unauthorized access' })
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
    if (!decoded) {
      return res.status(401).json({ message: 'unauthorized access' })
    }
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'unauthorized access' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not logged in' })
  }
}