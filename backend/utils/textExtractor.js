import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createWorker } from 'tesseract.js';
import { createCanvas } from 'canvas';

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
 * Version 5: Adds versioned logging and handles encrypted PDFs.
 *
 * @param {string} pdfUrl - The public URL of the PDF file.
 * @returns {Promise<string>} A promise that resolves to the extracted text.
 */
export const extractTextFromPdf = async (pdfUrl) => {
  const EXTRACTOR_VERSION = 'v5'; // For debugging which version is running
  
  if (!pdfUrl || !pdfUrl.toLowerCase().startsWith('http')) {
    throw new Error(`[Extractor ${EXTRACTOR_VERSION}] Invalid PDF URL provided.`);
  }

  const directUrl = getDirectGoogleDriveUrl(pdfUrl);
  console.log(`[Extractor ${EXTRACTOR_VERSION}] Processing document from: ${directUrl}`);

  try {
    const response = await axios.get(directUrl, {
      responseType: 'arraybuffer'
    });
    const pdfData = new Uint8Array(response.data);

    // --- STEP 1: Attempt fast, standard text extraction ---
    let fullText = '';
    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfData.slice(0) }).promise;
      
      if (pdf.isEncrypted) {
        throw new Error('The PDF is encrypted and cannot be processed.');
      }

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
      }
    } catch (pdfJsError) {
      if (pdfJsError.message.includes('encrypted')) throw pdfJsError; // Re-throw encryption error
      console.warn(`[Extractor ${EXTRACTOR_VERSION}] pdf.js failed, likely an image-based PDF. Proceeding with OCR.`);
      fullText = '';
    }

    // --- STEP 2: Check if standard extraction was successful ---
    if (fullText.trim().length > 50) {
      console.log(`[Extractor ${EXTRACTOR_VERSION}] Successfully extracted text using standard pdf.js method.`);
      return fullText.replace(/\s+/g, ' ').trim();
    }

    // --- STEP 3: Fallback to OCR using a single Tesseract worker ---
    console.log(`[Extractor ${EXTRACTOR_VERSION}] Standard extraction failed. Falling back to robust OCR...`);
    let ocrText = '';
    const worker = await createWorker({
        logger: m => console.log(`[Tesseract] ${m.status} (${(m.progress * 100).toFixed(0)}%)`)
    });

    try {
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const pdf = await pdfjsLib.getDocument({ data: pdfData.slice(0) }).promise;
        if (pdf.isEncrypted) {
            throw new Error('The PDF is encrypted and cannot be processed by the OCR engine.');
        }

        console.log(`[OCR] PDF has ${pdf.numPages} page(s). Starting render and recognition.`);

        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`[OCR] Processing page ${i}...`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');
            
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            const imageBuffer = canvas.toBuffer('image/png');
            
            const { data: { text } } = await worker.recognize(imageBuffer);
            ocrText += text + '\n';
        }
    } catch (ocrError) {
        console.error('[OCR Process Error]', ocrError);
        throw new Error(`[Extractor ${EXTRACTOR_VERSION}] The OCR process failed internally. Reason: ${ocrError.message}`);
    } finally {
        await worker.terminate();
        console.log('[Tesseract] Worker terminated.');
    }
    
    if (!ocrText.trim()) {
        throw new Error(`[Extractor ${EXTRACTOR_VERSION}] OCR processing completed, but no readable text was found.`);
    }

    console.log(`[Extractor ${EXTRACTOR_VERSION}] Successfully extracted text using Tesseract OCR.`);
    return ocrText.replace(/\s+/g, ' ').trim();

  } catch (error) {
    console.error(`[Extractor ${EXTRACTOR_VERSION}] Fatal error during PDF processing for URL: ${directUrl}`);
    console.error(error); 
    
    let userMessage = error.message;
    if (error.isAxiosError) {
      userMessage = `[Extractor ${EXTRACTOR_VERSION}] Failed to download the PDF. Check if the URL is correct and publicly accessible.`;
    }
    
    throw new Error(userMessage);
  }
};

