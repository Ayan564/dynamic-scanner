import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { images } = req.body;
    if (!images || images.length === 0)
      return res.status(400).json({ error: "No images provided." });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const imageParts = images.map((base64String) => ({
      inlineData: {
        data: base64String.includes(",")
          ? base64String.split(",")[1]
          : base64String,
        mimeType: "image/jpeg",
      },
    }));

    const prompt = `
      You are a highly accurate data extraction AI for an enterprise security application. 
      Extract the following information from the provided document images and return ONLY a valid JSON object.
      1. name: Full Name.
      2. dob: Date of Birth (YYYY-MM-DD format).
      3. gender: Extract the gender (e.g., Male, Female).
      4. mobile: 10-digit mobile number.
      5. address: Full residential address.
      6. division: Look at the PIN code in the address. Determine the specific Area/Division name that corresponds to that PIN code in India. Leave blank if unsure.
      7. qualification: Look for any school passing certificates (e.g., 10th Pass, B.A.). Leave blank if none.
      
      JSON Schema required:
      { "name": "", "dob": "", "gender": "", "mobile": "", "address": "", "division": "", "qualification": "" }
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = (await result.response).text();
    return res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("AI Extraction Error:", error);
    return res.status(500).json({ error: "Failed to extract data." });
  }
}
