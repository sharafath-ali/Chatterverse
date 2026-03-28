# 🌌 Chatterverse - Frontend

The frontend of Chatterverse is built with **React** and **Vite**, focusing on speed, responsiveness, and clean aesthetics.

## 🛠️ Key Technologies
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS & DaisyUI**: Utility-first CSS and component library for the sleek glassmorphism design.
- **Zustand**: Lightweight state management for auth, chat, and video call states.
- **Socket.IO-client**: Real-time event communication with the backend.
- **WebRTC**: Direct peer-to-peer browser communication for audio/video calling.

## 📂 Structure
- `/src/components`: Reusable UI elements (ChatHeader, Sidebar, VideoCall overlay).
- `/src/store`: Zustand stores managing global application state.
- `/src/pages`: Main application routes (Home, Profile, Login, Signup).
- `/src/lib`: Library configurations (Axios instances, etc).

## 📹 WebRTC Flow
- `useVideoCallStore.js`: Manages the `RTCPeerConnection` lifecycle.
- `VideoCall.jsx`: Handles the UI overlay for calls and renders local/remote media streams.
- `IncomingCallModal.jsx`: Global listener for incoming call events.
