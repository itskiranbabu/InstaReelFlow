# InstaReelFlow 🎬

A modern Instagram Reels-style video sharing platform built with React, Node.js, and MongoDB.

## Features

- 📱 Mobile-first responsive design
- 🎥 Video upload and streaming
- 👤 User authentication and profiles
- ❤️ Like and comment system
- 🔄 Infinite scroll feed
- 📊 Real-time analytics
- 🎨 Modern UI with smooth animations

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- CSS3 with modern animations

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env in server directory
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

```
InstaReelFlow/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── styles/        # CSS files
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── uploads/          # File uploads
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `POST /api/videos/:id/like` - Like/unlike video
- `POST /api/videos/:id/comment` - Add comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.