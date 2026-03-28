# 🌌 Chatterverse - Backend

The backend of Chatterverse is a robust Node.js and Express server, specializing in real-time communication and secure user data management.

## 🛠️ Key Technologies
- **Express.js**: Lightweight web framework for building APIs.
- **Socket.IO**: Powering real-time messaging, online status tracking, and WebRTC signaling.
- **MongoDB & Mongoose**: Flexible NoSQL database with powerful schema modeling.
- **Cloudinary**: Cloud-based image management for profile pictures.
- **JWT (JSON Web Token)**: Secure, stateless authentication.
- **Bcrypt.js**: Industry-standard hashing for passwords.

## 📂 Structure
- `/src/controllers`: Logic for authentication, messaging, and profile updates.
- `/src/models`: Database schemas for Users and Messages.
- `/src/routes`: API endpoints definition.
- `/src/lib`: Database connections, Cloudinary setup, and Socket.IO initialization.
- `/src/middlewares`: Security and authentication layers.

## 📹 WebRTC Signaling
The backend acts as a **reliable signal man** for WebRTC.
1. `call:initiate`: Forwards call requests and metadata between users.
2. `call:accept / call:reject`: Signals the call negotiation status.
3. `call:offer / call:answer`: Forwards SDP descriptions (media capabilities).
4. `call:ice-candidate`: Exchanges network traversal information.

## 📦 Deployment
The server is production-ready with optimized production build serving for the frontend files.
```javascript
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
```
