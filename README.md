# Vezore 🎓

**An Intelligent AI-Powered Video Learning Platform**

Vezore is a video-learning platform designed to make learning more interactive and efficient. It allows users to upload, manage, and watch educational videos, with plans to integrate AI-powered learning capabilities.It provides learning according to the video context not just same generated answers.

## 🚀 Project Overview

The goal of Vezore is to transform traditional video watching into an intelligent learning experience through AI-powered summaries, notes, and contextual question answering.

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Cloud Storage

- Cloudinary
- Multer
- Streamifier

### Planned AI Technologies

- Gemini API
- FFmpeg
- Embeddings
- Vector Search
- Retrieval-Augmented Generation (RAG)

## ✨ Implemented Features

- Upload videos through a React interface.
- Store video files using Cloudinary.
- Store video metadata in MongoDB.
- Fetch and display all uploaded videos.
- Retrieve individual videos using their IDs.
- Play videos directly in the application.
- Delete videos from Cloudinary and MongoDB.
- Update video titles and descriptions.
- Display video thumbnails.

## 📁 Project Structure

```text
Vezore/
│
├── client/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/prezure2006/Vezore-Smart-learning-Platform.git
cd Vezore
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside the server directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend using your configured npm development script.

### 3. Setup the frontend

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server using your configured npm script.

## 🛣️ Roadmap

- [x] Backend foundation and database connection
- [x] Cloudinary video upload integration
- [x] Video metadata persistence
- [x] Fetch all videos
- [x] Fetch individual videos
- [x] Video playback
- [x] Update video information API
- [x] Delete video API
- [x] Frontend video upload
- [x] Frontend video deletion
- [x] Frontend video editing
- [ ] ffmpeg for audio and video extraction
- [ ] AI-powered video transcription
- [ ] AI-generated summaries
- [ ] Intelligent note generation
- [ ] Video-based question answering using RAG
-
