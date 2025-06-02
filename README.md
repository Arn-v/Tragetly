# 🎯 Targetly CRM Platform

This project is a **MERN stack CRM platform** with integrated **AI-powered customer segmentation** and **multi-channel campaign execution**.

---

## 🚀 Local Setup Instructions

1️⃣ **Clone the repository:**
```bash
git clone https://github.com/your-username/targetly-crm.git
cd targetly-crm
````

2️⃣ **Install backend dependencies:**

```bash
cd backend
npm install
```

3️⃣ **Configure environment variables:**

* Create a `.env` file in the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
```

4️⃣ **Run backend:**

```bash
npm run dev
```

➡️ Backend runs on [http://localhost:5000](http://localhost:5000)

5️⃣ **Install frontend dependencies:**

```bash
cd ../frontend
npm install
```

6️⃣ **Run frontend:**

```bash
npm run dev
```

➡️ Frontend runs on [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Architecture Diagram

```
+-------------+           +---------------+           +------------------+
|  Frontend   |  <--API-->|   Backend     |  <--DB--->|  MongoDB Atlas   |
|  (React.js) |           | (Express.js)  |           | (Customer Data)  |
+-------------+           +---------------+           +------------------+

+----------------------------------+
|          AI Integration          |
|  Groq LLM API for segmentation   |
+----------------------------------+

+----------------------------------+
|      Google OAuth Authentication |
|    (Google login for users)      |
+----------------------------------+

+----------------------------------+
|   Vendor Delivery Simulation     |
| (Simulated API for message logs) |
+----------------------------------+
```

---

## 🤖 AI Tools & Technologies

✅ **Groq API** for natural language-to-MongoDB query conversion
✅ **OpenAI/Groq** for marketing message suggestions
✅ **Node.js & Express.js** for the backend API
✅ **React.js + TailwindCSS** for the frontend
✅ **MongoDB** for data storage (users, customers, campaigns, logs)
✅ **Google OAuth** for authentication

---

## ⚠️ Known Limitations & Assumptions

* 🟠 **Vendor Delivery API is simulated** with random delivery outcomes (\~90% SENT, \~10% FAILED).
* 🟠 **No real-time updates or WebSocket-based delivery receipts** — delivery status updates in batches.
* 🟠 **Segmentation queries rely on accurate Groq LLM responses**; edge cases may require manual rule building.
* 🟠 **Google OAuth** assumes the deployed backend is configured with proper callback URLs.

---

## 💡 Contributions & Improvements

Want to enhance this? Feel free to submit pull requests or raise issues!

---

📝 **Author:** \[Arnav]
📅 **Date:** June 2025

```
