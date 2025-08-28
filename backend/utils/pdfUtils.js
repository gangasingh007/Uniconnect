import axios from 'axios';
import { extractText } from 'unpdf'; // Use the new library

/**
 * Extracts text from a PDF document hosted at a given URL using `unpdf`.
 *
 * @param {string} pdfUrl - The public, absolute URL of the PDF file.
 * @returns {Promise<string>} A promise that resolves to the extracted plain text.
 * @throws Will throw an error if the URL is invalid or the PDF cannot be processed.
 */
export const extractTextFromPdf = async (pdfUrl) => {
  if (!pdfUrl || !pdfUrl.toLowerCase().startsWith('http')) {
    throw new Error('Invalid PDF URL provided. The URL must be an absolute web address.');
  }

  try {
    // 1. Fetch the PDF as a binary buffer
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer'
    });
    
    const pdfBuffer = Buffer.from(response.data);

    // 2. Extract text using unpdf
    const { text } = await extractText(pdfBuffer);
    
    // 3. Clean and return the text
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted. The document might be image-only.');
    }
    
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    return cleanedText;

  } catch (error) {
    console.error(`PDF processing failed for URL: ${pdfUrl}`, error.message);
    
    if (error.isAxiosError) {
      throw new Error('Failed to download the PDF. Please check if the URL is correct and publicly accessible.');
    }
    
    throw new Error(`Failed to extract text from the PDF. ${error.message}`);
  }
};
