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

app.get("/api/wakeup", (req, res) => res.status(200).json({ status: "awake" }));

app.post("/api/extract", async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || images.length === 0)
      return res.status(400).json({ error: "No images provided." });

    const extractedData = await extractionQueue.add(async () => {
      const imageParts = images.map((base64String) => ({
        inlineData: {
          data: base64String.includes(",")
            ? base64String.split(",")[1]
            : base64String,
          mimeType: "image/jpeg",
        },
      }));

      // Updated to gemini-3.5-flash-lite with JSON mode
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
        generationConfig: { responseMimeType: "application/json" },
      });
      const prompt = `
        You are a highly accurate data extraction AI for an enterprise security application. 
        Extract the following information from the provided document images and return ONLY a valid JSON object.
        1. name: Full Name.
        2. dob: Date of Birth (YYYY-MM-DD format).
        3. gender: Extract the gender (e.g., Male, Female).
        4. mobile: 10-digit mobile number.
        5. address: Full residential address.
        6. division: Extract the accurate Indian Postal Division name based on the PIN code and locality written in the address (for example, PIN 721423 or Balisai corresponds to Contai Division). Do not blindly default to Tamluk; map it to its correct postal division.
        7. qualification: Look for any school passing certificates (e.g., 10th Pass, B.A.). Leave blank if none.
        
        JSON Schema required:
        { "name": "", "dob": "", "gender": "", "mobile": "", "address": "", "division": "", "qualification": "" }
      `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const text = (await result.response).text();
      return JSON.parse(text);
    });

    res.json(extractedData);
  } catch (error) {
    console.error("AI Extraction Error:", error);
    res.status(500).json({ error: "Failed to extract data." });
  }
});

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
