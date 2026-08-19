# Dynamic Employee Scanner 🛡️

An AI-powered, mobile-first Progressive Web App (PWA) designed to completely automate and streamline the onboarding process for security personnel.

The application utilizes Google's Gemini Vision AI to instantly extract structured data (Name, DOB, Mobile, Address, Division, etc.) from raw photographs of physical onboarding documents like Aadhaar cards, PAN cards, and school certificates. The verified data is then seamlessly synchronized to a live cloud database (Google Sheets) via a custom Node.js/Express backend.

## ✨ Key Features

- **Mobile-First PWA:** Behaves exactly like a native iOS/Android application, complete with a custom install button, offline-capable service workers, and standalone viewport locks.
- **Intelligent Data Extraction:** Uses the `gemini-3.6-flash` AI model to perform complex OCR and data structuring across multiple disorganized documents simultaneously.
- **On-Device Image Compression:** Utilizes the HTML5 Canvas API to shrink 5MB+ camera images down to ~300KB _before_ network transmission, drastically reducing cloud processing time and bandwidth.
- **Real-Time Cloud Sync:** Connects to a master Google Sheet via a secure Google Cloud Service Account, acting as a lightweight, instantly accessible CRM.
- **Auto-Calculation Logic:** Dynamically calculates an applicant's exact age in real-time based on the AI-extracted Date of Birth.

## 🛠️ Tech Stack

**Frontend**

- React.js (Vite)
- Tailwind CSS (Styling & UI)
- Lucide React (Icons)
- HTML5 Canvas API (Image Processing)

**Backend**

- Node.js & Express.js
- `@google/generative-ai` (Gemini SDK)
- `googleapis` (Google Sheets API v4)
- CORS & Dotenv

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/dynamic-scanner.git](https://github.com/YOUR_USERNAME/dynamic-scanner.git)
cd dynamic-scanner
```

### 2. Backend Configuration

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
GEMINI_API_KEY=your_google_ai_studio_key
SPREADSHEET_ID=your_google_sheet_id
```

_Note: You must also place your Google Cloud Service Account `google-credentials.json` file in the root of the `backend` folder and share your target Google Sheet with the bot's email address._

Start the backend server:

```bash
npm start
```

### 3. Frontend Configuration

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev -- --host
```

_(The `--host` flag exposes the app to your local Wi-Fi network, allowing you to test the camera and PWA features directly on your smartphone)._

## ☁️ Deployment Architecture

This application is built to be deployed seamlessly across modern cloud infrastructure:

- **Frontend:** Deployed via [Vercel](https://vercel.com/) for optimized global edge delivery and secure HTTPS connections (required for PWA installation).
- **Backend:** Hosted on [Render](https://render.com/) as a Node Web Service to handle heavy AI payload parsing securely.
- **Database:** Google Sheets acting as a serverless database accessible directly by the client's administrative team.

## 👨‍💻 Author

**Ayan Maity**

- Developed for Dynamic Security And Manpower Services Private Limited.
