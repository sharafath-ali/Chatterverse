import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
import morgan from 'morgan'
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import { app , server , io } from './lib/socket.js'

configDotenv()

const Port = process.env.PORT
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

server.listen(Port, () => {
  console.log(`Server is running on 'http://localhost:${Port}'`);
  connectDB()
});