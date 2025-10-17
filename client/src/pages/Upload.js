import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import '../styles/Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setError('');
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
      } else {
        setError('Please select a video file');
        setFile(null);
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a video file');
      return;
    }

    if (!description.trim()) {
      setError('Please add a description');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('description', description);

    try {
      await axios.post('/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDescription('');
    setPreview(null);
    setError('');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <h2>Share Your Video</h2>
          <p>Upload a video to share with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="file-upload-section">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="video-file"
                accept="video/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="video-file" className="file-input-label">
                <div className="upload-icon">📹</div>
                <div className="upload-text">
                  <strong>Choose a video file</strong>
                  <p>MP4, MOV, AVI up to 100MB</p>
                </div>
              </label>
            </div>

            {preview && (
              <div className="video-preview">
                <video
                  src={preview}
                  controls
                  className="preview-video"
                  onLoadedMetadata={(e) => {
                    // Limit video duration if needed
                    if (e.target.duration > 60) {
                      setError('Video must be less than 60 seconds');
                      setFile(null);
                      setPreview(null);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCancel}
                  className="remove-video-btn"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a caption for your video..."
              rows="4"
              maxLength="500"
              required
            />
            <div className="character-count">
              {description.length}/500
            </div>
          </div>

          <div className="upload-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="upload-btn"
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <div className="upload-spinner"></div>
                  Uploading...
                </>
              ) : (
                'Share Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;