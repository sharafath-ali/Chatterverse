import mongoose from "mongoose";
import * as Sentry from '@sentry/node';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODBURL)
    console.log('Connected to MongoDB Atlas', connection.connection.host)
  } catch (error) {
    console.log('Failed to connect to MongoDB Atlas', error.message)
    Sentry.captureException(error, {
      tags: { critical: true, service: 'mongodb' },
      extra: { message: 'Database connection failed on startup' },
    });
    process.exit()
  }
}