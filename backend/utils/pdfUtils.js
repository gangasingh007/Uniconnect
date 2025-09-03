import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

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
 * Extracts text from a PDF document by using pdfjs-dist directly.
 *
 * @param {string} pdfUrl - The public URL of the PDF file.
 * @returns {Promise<string>} A promise that resolves to the extracted text.
 */
export const extractTextFromPdf = async (pdfUrl) => {
  if (!pdfUrl || !pdfUrl.toLowerCase().startsWith('http')) {
    throw new Error('Invalid PDF URL provided. Must be an absolute web address.');
  }

  const directUrl = getDirectGoogleDriveUrl(pdfUrl);

  try {
    const response = await axios.get(directUrl, {
      responseType: 'arraybuffer'
    });
    
    const pdfData = new Uint8Array(response.data);

    // Use pdfjs-dist to load and parse the document
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const numPages = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      throw new Error('Failed to extract readable text. The document might be empty or image-only.');
    }

    return fullText.replace(/\s+/g, ' ').trim();

  } catch (error) {
    console.error(`PDF processing failed for URL: ${directUrl}`, error.message);
    
    if (error.isAxiosError) {
      throw new Error('Failed to download the PDF. Check if the URL is correct and publicly accessible.');
    }
    
    throw new Error(`Failed to extract text from the PDF. ${error.message}`);
  }
};

