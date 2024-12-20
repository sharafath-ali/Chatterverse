import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
import morgan from 'morgan'
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from './routes/message.route.js'
import cors from 'cors'

configDotenv()

const Port = process.env.PORT
const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.listen(Port, () => {
  console.log(`Server is running on 'http://localhost:${Port}'`);
  connectDB()
});