import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    const userexists = await User.findOne({ email });
    if (userexists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)
    const user = new User({ fullName, email, password: hashedpassword })
    if (user) {
      const token = generateToken(user._id, res)
      await user.save()
      return res.status(200).send(user)
    }
    else {
      return res.status(400).send("User cannot be created")
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" })
    }
    const user = await User.findOne({ email })
    if (user) {
      const isMatch = bcrypt.compare(password, user.password)
      if (isMatch) {
        const token = generateToken(user._id, res)
        return res.status(200).json(user)
      }
      else {
        return res.status(400).json({ message: "Invalid credentials" })
      }
    }
    else {
      return res.status(400).json({ message: "Invalid credentials" })
    }
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

const logout = (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 })
    return res.status(200).json({ message: "Logged out successfully" })
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" })
    }
    const result = await cloudinary.uploader.upload(profilePic, { folder: "profilePic" });

    const userUpdated = await User.findByIdAndUpdate(req.user._id, { profilePic: result.secure_url }, { new: true })
    return res.status(200).json(userUpdated)
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user)
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message })
  }
}

export { login, signup, logout, updateProfile, checkAuth }