import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
import morgan from 'morgan'
import { configDotenv } from "dotenv";
configDotenv()

const Port = process.env.PORT
const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(Port, () => {
  console.log(`Server is running on 'http://localhost:${Port}'`);
  connectDB()
});