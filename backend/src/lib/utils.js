import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  return token
}

export { generateToken }