import "./instrument.js";
import * as Sentry from "@sentry/node";
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
import morgan from 'morgan'
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import { app, server, io } from './lib/socket.js'

import path from "path";

configDotenv()

const Port = process.env.PORT
const __dirname = path.resolve();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.get("/debug-sentry", function mainHandler(req, res) {
  // Send a log before throwing the error
  Sentry.logger.info('User triggered test error', {
    action: 'test_error_endpoint',
  });
  // Send a test metric before throwing the error
  Sentry.metrics.count('test_counter', 1);
  throw new Error("My first Sentry error!");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

server.listen(Port, () => {
  console.log(`Server is running on 'http://localhost:${Port}'`);
  connectDB()
});