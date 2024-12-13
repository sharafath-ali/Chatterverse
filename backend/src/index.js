import express from 'express'
import authRoutes from './routes/authRoutes.js'

const app = express()
const port = 3000

app.get('/api/auth', authRoutes)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})