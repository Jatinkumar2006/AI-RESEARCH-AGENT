# 🤖 AI Research Agent

🎥 **Demo Video**  
https://drive.google.com/file/d/1WXnnROnBx4543YLaMSUunXlDMI12_N2O/view?usp=sharing

---

A full-stack AI-powered research assistant that delivers **real-time news, structured analysis, and intelligent insights** on any topic.

Built using React, Node.js, and Large Language Models (Groq / Gemini).

---

## 🚀 Features

- 🔎 Real-time news fetching (NewsAPI)
- 🧠 AI-generated structured analysis
- 📊 Multi-section executive reports
- 📰 Wikipedia contextual integration
- 💰 Finance data support (Gold price via Alpha Vantage)
- 💬 Multi-conversation chat interface
- 📈 Clean analytical UI
- 🔗 Source-linked research output

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Axios
- Modular component architecture
- Structured JSON rendering

### Backend
- Node.js
- Express
- Axios
- NewsAPI
- Wikipedia REST API
- Alpha Vantage API
- Groq LLM / Google Gemini

---

## 🧠 How It Works

1. User enters a research topic.
2. Backend:
   - Fetches latest news (last 7 days)
   - Fetches Wikipedia summary
   - Fetches finance data (if applicable)
3. Context is sent to LLM.
4. LLM returns structured JSON:
   - Multiple analytical sections
   - Key takeaways
   - Strategic recommendations
5. Frontend renders clean executive-style report.

---

## 📂 Project Structure

<pre>
AI-RESEARCH-AGENT
│
├── backend
│ ├── controllers
│ ├── services
│ ├── routes
│ └── server.js
│
├── frontend
│ ├── pages
│ ├── components
│ ├── services
│ └── styles.css
│
└── README.md
</pre>

---

## ⚙️ Environment Variables

Create a `.env` file in the backend folder:

<pre>
PORT=5000
NEWS_API_KEY=your_newsapi_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
LLM_PROVIDER=groq
</pre>
