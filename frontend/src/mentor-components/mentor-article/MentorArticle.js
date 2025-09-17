import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import './MentorArticle.css';
import Navbar from '../mentor-navbar/MentorNavbar';

const MentorArticle = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const fileInputRef = useRef(null);
  
  const API_BASE_URL = 'http://localhost:8070'; // Update if needed

  // Set today's date as default
  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Handle file preview
  const handleFilePreview = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFilePreview(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
      }
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build formData
    const formData = new FormData();
    formData.append('article_title', title);
    formData.append('article_description', description); // Now HTML from Quill
    formData.append('article_category', category);
    formData.append('article_author', author);
    formData.append('article_date', date);
    formData.append('artivle_duration', duration); // 👈 note spelling matches backend

    if (fileInputRef.current?.files[0]) {
      formData.append('article_image', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/mentor-article/add`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      const data = await response.json();
      console.log('Article created:', data);
      alert('Article created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setAuthor('');
      setDuration('');
      setDate(new Date().toISOString().split('T')[0]);
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article. Check console.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mar-full-contaner">
        <div className="background-pattern-mar"></div>
        <div className="floating-shapes-mar">
          <div className="shape-mar"></div>
          <div className="shape-mar"></div>
          <div className="shape-mar"></div>
        </div>
        <div className="container-mar">
          <div className="header-mar">
            <h1>Create Article</h1>
            <p>Share your knowledge with the world</p>
          </div>
          <div className="form-container-mar">
            <form id="articleForm" className="form-grid-mar" onSubmit={handleSubmit}>
              <div className="form-group-mar">
                <label htmlFor="title" className="form-label-mar">Article Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-input-mar"
                  placeholder="Enter an engaging title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group-mar">
                <label htmlFor="description" className="form-label-mar">Article Description</label>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Provide a compelling description of your article..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                      ['emoji'] // Requires quill-emoji module if not default; assume basic emoji typing
                    ],
                  }}
                  className="form-textarea-mar quill-editor-mar"
                  required
                />
              </div>
              <div className="two-column-mar">
                <div className="form-group-mar">
                  <label htmlFor="category" className="form-label-mar">Category</label>
                  <select 
                    id="category" 
                    className="form-select-mar" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Tech News">Tech News</option>
                    <option value="AI">AI</option>
                    <option value="Tools">Tools</option>
                    <option value="Web">Web</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div className="form-group-mar">
                  <label htmlFor="author" className="form-label-mar">Author Name</label>
                  <input
                    type="text"
                    id="author"
                    className="form-input-mar"
                    placeholder="Your name..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="two-column-mar">
                <div className="form-group-mar">
                  <label htmlFor="duration" className="form-label-mar">Reading Duration</label>
                  <input
                    type="text"
                    id="duration"
                    className="form-input-mar"
                    placeholder="e.g., 5 min read"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-mar">
                  <label htmlFor="date" className="form-label-mar">Publication Date</label>
                  <input
                    type="date"
                    id="date"
                    className="form-input-mar"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group-mar">
                <label htmlFor="image" className="form-label-mar">Article Image</label>
                <div
                  className={`file-upload-area-mar ${isDragging ? 'dragover-mar' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleImageClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleImageClick(); }}
                >
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    className="file-input-mar"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        handleFilePreview(e.target.files[0]);
                      }
                    }}
                  />
                  <svg className="upload-icon-mar" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <div className="upload-text-mar">Click to upload or drag and drop</div>
                  <div className="upload-subtext-mar">PNG, JPG, GIF up to 10MB</div>
                </div>
                <div className={`file-preview-mar ${previewImage ? 'show-mar' : ''}`}>
                  {previewImage && <img id="previewImage" className="preview-image-mar" src={previewImage} alt="Preview" />}
                </div>
              </div>
              <button type="submit" className="submit-button-mar">
                Create Article
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorArticle;