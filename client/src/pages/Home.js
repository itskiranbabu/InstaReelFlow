import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (videoId, likes) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, likes } : video
      )
    );
  };

  const handleComment = (videoId, comments) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, comments } : video
      )
    );
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchVideos} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="videos-feed">
        {videos.length === 0 ? (
          <div className="no-videos">
            <h2>No videos yet</h2>
            <p>Be the first to share a video!</p>
          </div>
        ) : (
          videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;