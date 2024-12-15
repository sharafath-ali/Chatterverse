import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'

import { configDotenv } from "dotenv";
configDotenv()

const Port = process.env.PORT
const app = express()

app.get('/api/auth', authRoutes)

app.listen(Port, () => {
  console.log(`Server is running on 'http://localhost:${Port}'`);
  connectDB()
});