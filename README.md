# AI-Powered Resume Builder

A full-stack **MERN Resume Builder** application with **real-time preview**, **multiple templates**, and **AI-assisted content generation** to help users create ATS-optimized professional resumes efficiently.

---

##  Features

-  Live resume editing with **real-time preview**
-  **Multiple resume templates**
-  **AI-powered professional summary** generation
-  **AI-enhanced job experience descriptions**
-  **User authentication**
-  **Visibility controls** (Public / Private resumes)
-  **Shareable resume links**
-  **Download resume as PDF**
-  Secure data storage with MongoDB

---

##  AI Integration

- Integrated **Google Gemini AI API**
- Used for:
  - Professional summary enhancement
  - Job experience optimization
- Focus on **clear, ATS-friendly wording**

---

##  Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI:** Google Gemini API

---
### 🔗 Live Demo: https://resume-builder-angana.vercel.app/
---

## ⚙️ Installation & Local Setup

> Optional — the project is already deployed, but can be run locally if required.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/resume-builder.git  
cd resume-builder
```
---

### 2️⃣ Backend Setup
```bash
cd server  
npm install
```
Create a `.env` file inside the `server` directory with the following variables:
```bash
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
GEMINI_API_KEY=your_google_gemini_api_key  
JWT_SECRET=your_jwt_secret  
```
Start the backend server:
```bah
npm run dev
```
---

### 3️⃣ Frontend Setup
```bash
cd client  
npm install  
npm run dev  
```
---

### 4️⃣ Access the Application

Frontend: http://localhost:5173  
Backend: http://localhost:5000
