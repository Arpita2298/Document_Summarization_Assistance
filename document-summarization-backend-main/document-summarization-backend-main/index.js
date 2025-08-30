require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { extractText } = require('./services/textExtractor');
const { generateSummary } = require('./services/summarizer');

const app = express();
const PORT = process.env.PORT || 5000;

// We'll use memory storage instead of disk storage

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// No need to serve static files since we're not storing files

// Configure multer for file uploads with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    // Accept only pdf, jpg, and png files
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .jpg and .png files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`
    });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
  // No error occurred, continue
  next();
};

// Routes
app.post('/api/upload', upload.single('document'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    // Process the file in memory
    let extractionResult = null;
    
    try {
      // Extract text directly from the buffer
      extractionResult = await extractText(req.file.buffer, req.file.mimetype);
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      // Continue even if extraction fails
    }
    
    // Return file information and extraction result
    res.status(200).json({
      success: true,
      message: 'File processed successfully',
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      extraction: extractionResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Summarize text endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, length } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No text provided for summarization'
      });
    }
    
    // Validate length parameter
    const validLengths = ['short', 'medium', 'long'];
    const summaryLength = validLengths.includes(length) ? length : 'medium';
    
    // Generate summary
    const summaryResult = await generateSummary(text, summaryLength);
    
    res.status(200).json({
      success: true,
      summary: summaryResult
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
