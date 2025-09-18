const multer = require('multer');
const MentornshipAnnouncement = require('../../models/Mentor_Article/Article');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// =======================
// Add New Article
// =======================
const addArticle = async (req, res) => {
  try {
    const {
      article_title,
      article_description,
      article_category,
      article_author,
      artivle_duration
    } = req.body;

    if (!article_title || !article_description || !article_author || !artivle_duration) {
      return res.status(400).json({
        message: 'Title, description, author, and duration are required'
      });
    }

    const newArticle = new MentornshipAnnouncement({
      article_title,
      article_description,
      article_category,
      article_author,
      artivle_duration,
      article_image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        : undefined
    });

    await newArticle.save();

    res.status(201).json({
      message: 'Article added successfully',
      article: newArticle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding article',
      error: error.message
    });
  }
};

// =======================
// Get All Articles - FIXED VERSION
// =======================
const getAllArticles = async (req, res) => {
  try {
    const articles = await MentornshipAnnouncement.find().sort({ createdAt: -1 });
    
    // Process articles to include properly formatted image data
    const processedArticles = articles.map(article => {
      const articleObj = article.toObject();
      
      // Handle image data properly
      if (articleObj.article_image && articleObj.article_image.data) {
        // Convert Buffer to base64 string for frontend consumption
        articleObj.article_image.data = articleObj.article_image.data.toString('base64');
      }
      
      return articleObj;
    });

    res.status(200).json({
      message: 'Articles retrieved successfully',
      articles: processedArticles
    });
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    res.status(500).json({
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

// =======================
// Get Article By ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid article ID format' });
    }

    const article = await MentornshipAnnouncement.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    let imageBase64 = null;
    if (article.article_image && article.article_image.data) {
      imageBase64 = `data:${article.article_image.contentType};base64,${article.article_image.data.toString('base64')}`;
    }

    res.status(200).json({
      message: 'Article retrieved successfully',
      article: {
        _id: article._id,
        article_title: article.article_title,
        article_description: article.article_description,
        article_category: article.article_category,
        article_author: article.article_author,
        article_date: article.article_date,
        article_duration: article.artivle_duration,
        article_image: imageBase64,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }
    });
  } catch (error) {
    console.error("Error in getArticleById:", error);
    res.status(500).json({
      message: 'Error fetching article',
      error: error.message
    });
  }
};

// =======================
// Update Article
// =======================
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      article_title,
      article_description,
      article_category,
      article_author,
      artivle_duration
    } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid article ID format' });
    }

    const updateData = {
      article_title,
      article_description,
      article_category,
      article_author,
      artivle_duration
    };

    if (req.file) {
      updateData.article_image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedArticle = await MentornshipAnnouncement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({
      message: 'Article updated successfully',
      article: updatedArticle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating article',
      error: error.message
    });
  }
};

// =======================
// Delete Article
// =======================
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid article ID format' });
    }

    const article = await MentornshipAnnouncement.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({
      message: 'Article deleted successfully',
      article
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting article',
      error: error.message
    });
  }
};

// =======================
// Get Article Image by ID
// =======================
const getArticleImage = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await MentornshipAnnouncement.findById(id);

    if (!article || !article.article_image || !article.article_image.data) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', article.article_image.contentType);
    res.send(article.article_image.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
};

module.exports = {
  upload,
  addArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticleImage
};