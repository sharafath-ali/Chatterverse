import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'

const login = (req, res) => {
  res.send('Hello World!')
}

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

const logout = (req, res) => {
  res.send('Hello World!')
}

export { login, signup, logout }