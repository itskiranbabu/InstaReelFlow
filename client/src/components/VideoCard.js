import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import '../styles/VideoCard.css';

const VideoCard = ({ video, onLike, onComment }) => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(video.comments || []);
  const [likes, setLikes] = useState(video.likes || []);
  const [isLiked, setIsLiked] = useState(
    user ? likes.some(like => like.user === user._id) : false
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play();
            setIsPlaying(true);
          } else {
            videoElement.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const response = await axios.post(`/api/videos/${video._id}/like`);
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
      onLike && onLike(video._id, response.data.likes);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    try {
      const response = await axios.post(`/api/videos/${video._id}/comment`, {
        text: comment
      });
      setComments(response.data.comments);
      setComment('');
      onComment && onComment(video._id, response.data.comments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="video-card">
      <div className="video-container">
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          muted
          playsInline
          onClick={handleVideoClick}
          className="video-player"
        />
        
        {!isPlaying && (
          <div className="play-overlay" onClick={handleVideoClick}>
            <div className="play-button">▶️</div>
          </div>
        )}
      </div>

      <div className="video-info">
        <div className="video-header">
          <div className="user-info">
            <div className="avatar">
              {video.user?.username?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div className="user-details">
              <h3 className="username">{video.user?.username || 'Unknown User'}</h3>
              <p className="upload-date">{formatDate(video.createdAt)}</p>
            </div>
          </div>
        </div>

        <p className="video-description">{video.description}</p>

        <div className="video-actions">
          <button 
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!user}
          >
            <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
            <span className="action-count">{likes.length}</span>
          </button>

          <button 
            className="action-btn comment-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="action-icon">💬</span>
            <span className="action-count">{comments.length}</span>
          </button>

          <button className="action-btn share-btn">
            <span className="action-icon">📤</span>
            Share
          </button>
        </div>

        {showComments && (
          <div className="comments-section">
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-avatar">
                    {comment.user?.username?.charAt(0).toUpperCase() || '👤'}
                  </div>
                  <div className="comment-content">
                    <span className="comment-username">{comment.user?.username}</span>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <form onSubmit={handleComment} className="comment-form">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                />
                <button type="submit" className="comment-submit">
                  Post
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;