import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import axios from 'axios';
import '../styles/Profile.css';
import '../styles/Profile.css';


const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserVideos();
  }, [user, navigate]);

  const fetchUserVideos = async () => {
    try {
      const response = await axios.get(`/api/videos/user/${user._id}`);
      const videos = response.data;
      setUserVideos(videos);
      
      // Calculate stats
      const totalLikes = videos.reduce((sum, video) => sum + video.likes.length, 0);
      const totalComments = videos.reduce((sum, video) => sum + video.comments.length, 0);
      
      setStats({
        totalVideos: videos.length,
        totalLikes,
        totalComments
      });
    } catch (error) {
      console.error('Error fetching user videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (videoId, likes) => {
    setUserVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, likes } : video
      )
    );
    
    // Update stats
    const video = userVideos.find(v => v._id === videoId);
    if (video) {
      const likeDiff = likes.length - video.likes.length;
      setStats(prev => ({
        ...prev,
        totalLikes: prev.totalLikes + likeDiff
      }));
    }
  };

  const handleComment = (videoId, comments) => {
    setUserVideos(prevVideos =>
      prevVideos.map(video =>
        video._id === videoId ? { ...video, comments } : video
      )
    );
    
    // Update stats
    const video = userVideos.find(v => v._id === videoId);
    if (video) {
      const commentDiff = comments.length - video.comments.length;
      setStats(prev => ({
        ...prev,
        totalComments: prev.totalComments + commentDiff
      }));
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h1 className="profile-username">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.totalVideos}</div>
            <div className="stat-label">Videos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalLikes}</div>
            <div className="stat-label">Likes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalComments}</div>
            <div className="stat-label">Comments</div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section-header">
          <h2>My Videos</h2>
          <button 
            onClick={() => navigate('/upload')}
            className="upload-new-btn"
          >
            + Upload New Video
          </button>
        </div>

        <div className="profile-videos">
          {userVideos.length === 0 ? (
            <div className="no-videos">
              <div className="no-videos-icon">📹</div>
              <h3>No videos yet</h3>
              <p>Share your first video with the community!</p>
              <button 
                onClick={() => navigate('/upload')}
                className="upload-first-btn"
              >
                Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="videos-grid">
              {userVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
