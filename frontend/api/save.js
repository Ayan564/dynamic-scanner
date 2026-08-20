import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const data = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Google Sheets Error:", error);
    return res.status(500).json({ error: "Failed to save data." });
  }
}
