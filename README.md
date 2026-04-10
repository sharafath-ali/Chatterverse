<div align="center">
  <h1>🌌 Chatterverse</h1>
  <p><strong>A modern, full-stack real-time communication platform built for seamless messaging and high-quality video/audio calling.</strong></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" /></a>
    <a href="https://webrtc.org/"><img src="https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC" /></a>
    <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" /></a>
  </p>
</div>

<br />

**Chatterverse** utilizes **WebRTC** for peer-to-peer data streaming, ensuring a fast and private calling experience, alongside real-time chat powered by **Socket.IO**.

---

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based auth with HTTP-only cookies and bcrypt password hashing.
- 💬 **Real-Time Messaging**: Instant text messaging powered by **Socket.IO**.
- 📹 **P2P Video & Audio Calling**: High-performance calling using **WebRTC** (direct browser-to-browser).
- 🖼️ **Profile Customization**: Image uploads and profile management via **Cloudinary**.
- 🟢 **Live Status**: Real-time online/offline indicators for all users.
- 🌓 **Theming**: Dynamic theme switching with **DaisyUI** and **Tailwind CSS**.
- 📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- 🚀 **High Performance**: Built with **Vite** and **Zustand** for ultra-fast frontend performance.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & DaisyUI
- **State Management**: Zustand
- **Media**: WebRTC API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO
- **Cloud Storage**: Cloudinary
- **Security**: JWT & Bcryptjs

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed and configured before proceeding:
- **Node.js** (v18+ recommended)
- **MongoDB Atlas** account (or local MongoDB connection)
- **Cloudinary** account (for handling image uploads)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sharafath-ali/Chatterverse.git
   cd Chatterverse
   ```

2. **Backend Setup**:
   Open a new terminal and run:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the example provided in the codebase
   npm run dev
   ```

3. **Frontend Setup**:
   Open a new terminal and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📦 Deployment (Render)

The project is structured to be easily deployed on **Render** (or similar PaaS providers like Heroku or Railway).

1. **Root Build Command**: `npm run build` *(This runs build scripts for both backend and frontend)*.
2. **Start Command**: `npm run start` *(Starts the Node server which serves the static frontend)*.
3. **Environment Variables**: Add your `.env` keys to the Render web service settings.

---

## 🔧 WebRTC Implementation

The video calling feature uses a **Signaling + P2P** architecture to minimize latency and server load:
1. **Signaling**: `Socket.IO` handles the "handshake" process (exchanging Session Description Protocols (SDP) and ICE candidates).
2. **Connectivity**: Google STUN servers enable cross-network connections, bypassing NAT restrictions.
3. **Media Streaming**: `WebRTC` handles the actual direct audio/video streaming, bypassing the server entirely for maximum performance.

---

## ⚖️ License

Distributed under the **ISC License**. See `LICENSE` for more information.

<hr />

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/sharafath-ali">sharafath-ali</a></sub>
</div>
