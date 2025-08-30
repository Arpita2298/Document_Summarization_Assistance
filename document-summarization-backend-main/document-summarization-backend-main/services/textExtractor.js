const pdfParse = require('pdf-parse');
const { extractTextFromImage } = require('./ocrService');

/**
 * Extract text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<object>} - Extracted text and metadata
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extract text from a file buffer based on its mimetype
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - MIME type of the file
 * @returns {Promise<object>} - Extracted text and metadata
 */
async function extractText(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      return await extractTextFromPDF(buffer);
    } else if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      // Use OCR to extract text from images
      const extractedText = await extractTextFromImage(buffer, mimetype);
      return {
        text: extractedText,
        mimetype: mimetype
      };
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    console.error('Error in text extraction:', error);
    throw error;
  }
}

module.exports = {
  extractText,
  extractTextFromPDF
};
