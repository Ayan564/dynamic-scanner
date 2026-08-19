import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";

dotenv.config();
const app = express();

app.use(cors());
// Set limits high to easily handle the Base64 compressed images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Set up Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: "./google-credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// AI Extraction Endpoint
app.post("/api/extract", async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No document images provided." });
    }

    console.log(
      `Processing ${images.length} compressed images via Gemini 3.6 Flash...`,
    );

    const imageParts = images.map((base64String) => {
      const base64Data = base64String.includes(",")
        ? base64String.split(",")[1]
        : base64String;
      return {
        inlineData: { data: base64Data, mimeType: "image/jpeg" },
      };
    });

    // Explicitly targeting the latest working free-tier model
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `
      You are a highly accurate data extraction AI for an enterprise security application. 
      I am providing you with multiple images of a new employee's onboarding packet. This packet may contain an Aadhaar card, PAN card, office forms, and school certificates in no particular order.
      
      Extract the following information and return ONLY a valid JSON object. Do not include markdown blocks, greetings, or any other text.
      
      1. name: Full Name (Preferably from Aadhaar).
      2. dob: Date of Birth (YYYY-MM-DD format).
      3. mobile: 10-digit mobile number (Scan all forms/documents for this).
      4. address: Full residential address (From Aadhaar).
      5. division: Look at the PIN code in the Aadhaar address. Determine the specific Area/Division name that corresponds to that PIN code in India. If you cannot determine it with high confidence, leave it blank.
      6. qualification: Look for any school passing certificates (e.g., 10th Pass, 12th Pass, B.A.). If none exist, leave blank.
      
      JSON Format Required:
      {
        "name": "",
        "dob": "",
        "mobile": "",
        "address": "",
        "division": "",
        "qualification": ""
      }
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Clean markdown blocks to ensure flawless JSON parsing
    const cleanJson = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const extractedData = JSON.parse(cleanJson);

    console.log("Extraction successful.");
    res.json(extractedData);
  } catch (error) {
    console.error("AI Extraction Error:", error);
    res.status(500).json({ error: "Failed to extract data from documents." });
  }
});

// Google Sheets Database Endpoint
app.post("/api/save", async (req, res) => {
  try {
    const data = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Maps exactly to columns A through I in your Google Sheet
    const values = [
      [
        timestamp,
        data.name || "",
        data.dob || "",
        data.age || "",
        data.mobile || "",
        data.address || "",
        data.division || "",
        data.qualification || "",
        data.remarks || "",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    console.log("Saved to Google Sheets.");
    res.json({ success: true });
  } catch (error) {
    console.error("Google Sheets Error:", error);
    res.status(500).json({ error: "Failed to save data to database." });
  }
});

const PORT = process.env.PORT || 5000;
// Listening on 0.0.0.0 allows requests from other devices on your WiFi
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Dynamic Security Backend listening for network traffic on port ${PORT}`,
  );
});
