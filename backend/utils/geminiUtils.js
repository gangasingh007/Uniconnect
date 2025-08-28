import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  // Store API key in .env

export async function geminiSummarize(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Summarize the following document text: \n${text}\n\nSummary:`;

  const result = await model.generateContent(prompt);

  // Use `.response?.candidates[0]?.content?.parts[0]?.text` to get summary, or adjust based on Gemini response shape
  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
