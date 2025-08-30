const { createWorker } = require('tesseract.js');

/**
 * Extract text from an image using Tesseract OCR
 * @param {Buffer} imageBuffer - The image buffer to process
 * @param {string} imageType - The image MIME type (e.g., 'image/jpeg', 'image/png')
 * @returns {Promise<string>} - Extracted text from the image
 */
async function extractTextFromImage(imageBuffer, imageType) {
  try {
    if (!imageBuffer) {
      throw new Error('No image provided for OCR processing');
    }

    // Initialize worker with English language
    const worker = await createWorker();
    
    // Recognize text from image buffer
    const { data: { text } } = await worker.recognize(imageBuffer);
    
    // Terminate worker to free resources
    await worker.terminate();
    
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

module.exports = {
  extractTextFromImage
};
