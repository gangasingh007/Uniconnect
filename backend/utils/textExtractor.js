import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import Tesseract from 'tesseract.js';

/**
 * Converts a standard Google Drive sharing link into a direct download link.
 * @param {string} url The original Google Drive URL.
 * @returns {string} The direct download URL or the original URL.
 */
const getDirectGoogleDriveUrl = (url) => {
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
};

/**
 * Extracts text from a PDF, automatically using OCR for image-based documents.
 * This is the function your controllers will import and use.
 *
 * @param {string} pdfUrl - The public URL of the PDF file.
 * @returns {Promise<string>} A promise that resolves to the extracted text.
 */
export const extractTextFromPdf = async (pdfUrl) => {
  if (!pdfUrl || !pdfUrl.toLowerCase().startsWith('http')) {
    throw new Error('Invalid PDF URL provided. Must be an absolute web address.');
  }

  const directUrl = getDirectGoogleDriveUrl(pdfUrl);
  console.log(`Processing document from: ${directUrl}`);

  try {
    // Download the PDF data once. We'll use this buffer for both attempts.
    const response = await axios.get(directUrl, {
      responseType: 'arraybuffer'
    });
    const pdfData = new Uint8Array(response.data);

    // --- STEP 1: Attempt fast, standard text extraction first ---
    let fullText = '';
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Filter out any potential empty items and join
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
    } catch (pdfJsError) {
      console.warn('pdf.js failed, likely an image-based PDF. Proceeding with OCR.');
      fullText = ''; // Ensure fullText is empty to trigger the OCR fallback
    }

    // --- STEP 2: Check if standard extraction was successful ---
    // If we got a reasonable amount of text, we're done!
    if (fullText.trim().length > 50) { // Using a slightly higher threshold
      console.log('Successfully extracted text using standard pdf.js method.');
      return fullText.replace(/\s+/g, ' ').trim();
    }

    // --- STEP 3: If standard extraction fails, fall back to OCR with Tesseract.js ---
    console.log('Standard extraction yielded no text. Falling back to OCR...');

    // Tesseract.recognize can take the buffer directly.
    const { data: { text } } = await Tesseract.recognize(
      Buffer.from(pdfData), // Convert Uint8Array to a Buffer for Tesseract
      'eng', // Specify the language (e.g., 'eng' for English)
      { logger: m => console.log(m) } // Optional: log progress for debugging
    );

    if (!text.trim()) {
      throw new Error('OCR processing also failed. The document might be empty or unreadable.');
    }

    console.log('Successfully extracted text using Tesseract OCR.');
    return text.replace(/\s+/g, ' ').trim();

  } catch (error) {
    console.error(`Fatal error during PDF processing for URL: ${directUrl}`, error.message);
    if (error.isAxiosError) {
      throw new Error('Failed to download the PDF. Check if the URL is correct and publicly accessible.');
    }
    // Re-throw the error to be caught by the controller
    throw error;
  }
};