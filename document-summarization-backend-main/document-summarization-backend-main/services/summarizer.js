require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a summary of text using Google Gemini API
 * @param {string} text - The text to summarize
 * @param {string} length - Summary length (short, medium, long)
 * @returns {Promise<object>} - Summary result with summary text and metadata
 */
async function generateSummary(text, length = 'medium') {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for summarization');
    }

    // Determine word count based on length option
    let wordCount;
    switch (length) {
      case 'short':
        wordCount = 100;
        break;
      case 'medium':
        wordCount = 250;
        break;
      case 'long':
        wordCount = 500;
        break;
      default:
        wordCount = 250; // Default to medium
    }

    const prompt = `Please summarize the following text in approximately ${wordCount} words. Format your response using Markdown syntax:

- Use **bold text** for important concepts or key terms
- Use backticks for code snippets or technical terms like \`function()\` or \`API\`
- Use triple backticks for code blocks with appropriate language specification
- Use bullet points for lists where appropriate
- Use headers (##) for section titles if needed

Here's the text to summarize:

${text}`;

    // For Gemini, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return {
      summary: summary.trim(),
      length,
      originalLength: text.length,
      summaryLength: summary.length,
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

module.exports = {
  generateSummary
};
