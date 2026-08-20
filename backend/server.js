import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const auth = new google.auth.GoogleAuth({
  keyFile: "./google-credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ==========================================
// 1. CONCURRENCY FIX: Async FIFO Request Queue
// Forces simultaneous requests to process one by one
// ==========================================
class RequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }
  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task());
        } catch (error) {
          reject(error);
        }
      });
      this.processNext();
    });
  }
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    const task = this.queue.shift();
    await task();
    this.isProcessing = false;
    this.processNext();
  }
}
const extractionQueue = new RequestQueue();

// Cold Start Wakeup Endpoint
app.get("/api/wakeup", (req, res) => res.status(200).json({ status: "awake" }));

// AI Extraction Endpoint
app.post("/api/extract", async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || images.length === 0)
      return res.status(400).json({ error: "No images provided." });

    // Send the request into the safety queue
    const extractedData = await extractionQueue.add(async () => {
      const imageParts = images.map((base64String) => ({
        inlineData: {
          data: base64String.includes(",")
            ? base64String.split(",")[1]
            : base64String,
          mimeType: "image/jpeg",
        },
      }));

      // ==========================================
      // 2. LIMITS & ACCURACY FIX: 3.6-Flash + JSON Mode
      // ==========================================
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
        You are a highly accurate data extraction AI for an enterprise security application. 
        I am providing you with multiple images of a new employee's onboarding packet (Aadhaar, PAN, forms).
        
        Extract the following information and return ONLY a valid JSON object.
        1. name: Full Name.
        2. dob: Date of Birth (YYYY-MM-DD format).
        3. gender: Extract the gender (e.g., Male, Female).
        4. mobile: 10-digit mobile number.
        5. address: Full residential address.
        6. division: Look at the PIN code in the address. Determine the specific Area/Division name that corresponds to that PIN code in India. Leave blank if unsure.
        7. qualification: Look for any school passing certificates (e.g., 10th Pass, B.A.). Leave blank if none.
        
        JSON Schema to strictly follow:
        { "name": "", "dob": "", "gender": "", "mobile": "", "address": "", "division": "", "qualification": "" }
      `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const text = (await result.response).text();

      // Parse and return the perfectly formatted JSON
      return JSON.parse(text);
    });

    res.json(extractedData);
  } catch (error) {
    console.error("AI Extraction Error:", error);
    res.status(500).json({ error: "Failed to extract data." });
  }
});

// Google Sheets Sync Endpoint
app.post("/api/save", async (req, res) => {
  try {
    const data = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const values = [
      [
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        data.name || "",
        data.dob || "",
        data.age || "",
        data.gender || "",
        data.mobile || "",
        data.address || "",
        data.division || "",
        data.qualification || "",
        data.remarks || "",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Google Sheets Error:", error);
    res.status(500).json({ error: "Failed to save data." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Backend running on port ${PORT}`),
);
