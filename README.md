<div align="center">

# 🎓 QU Smart Assistant

### AI-Powered Bilingual Chatbot for Qassim University Students

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-brightgreen?style=for-the-badge)](https://qu-smart-assistant.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-Workflow-EA4B71?logo=n8n)](https://n8n.io/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-00C896)](https://www.pinecone.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://qu-smart-assistant.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A graduation project from Qassim University - College of Computer**

### 🚀 [Try the Live Demo →](https://qu-smart-assistant.vercel.app)

</div>

---

## 🌟 Overview

QU Smart Assistant is an intelligent AI-powered chatbot designed specifically for Qassim University students. It leverages **Retrieval-Augmented Generation (RAG)** to answer questions about admissions, colleges, medical city services, research, and university administration in both **Arabic and English**.

**Built with modern technologies and a knowledge base of 8,577+ vectorized documents from official university sources.**

🔗 **Live Demo:** [https://qu-smart-assistant.vercel.app](https://qu-smart-assistant.vercel.app)

---

## ✨ Features

- 🌍 **Bilingual Support** — Seamless Arabic & English with RTL layout
- 🧠 **RAG Architecture** — Grounded answers from 8,577 university documents
- ⚡ **Real-time Responses** — Under 3 seconds average response time
- 🎨 **Modern UI** — Built with Next.js 16, Tailwind CSS, and shadcn/ui
- 🌗 **Dark/Light Themes** — User preference with system detection
- 👍 **Message Ratings** — Thumbs up/down feedback per response
- 💬 **Smart Suggestions** — Quick chips and action cards
- 🔗 **Quick Links** — Direct access to MyQU, LMS, and university services
- 📱 **Mobile Responsive** — Works on all device sizes
- 💾 **Persistent History** — Chat history saved locally

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| 📁 Documents Indexed | **423** |
| 🔢 Vector Embeddings | **8,577** |
| 🏛️ Colleges Covered | **17** |
| 📚 Service Categories | **6** |
| 🌍 Languages | **2** (AR/EN) |
| ⚡ Avg Response Time | **< 3s** |

---

## 🏗️ Architecture

```
Next.js UI ──▶ n8n Webhook ──▶ AI Agent (GPT-4o-mini)
                                    │
                          ┌─────────┴─────────┐
                          ▼                    ▼
                   Pinecone Vector       OpenAI Embeddings
                   (8,577 vectors)       (text-3-small)
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Modern UI components
- **Framer Motion** — Smooth animations
- **Lucide React** — Icon library

### Backend
- **n8n** — Workflow automation platform
- **OpenAI GPT-4o-mini** — Language model
- **OpenAI text-embedding-3-small** — Embeddings

### Database
- **Pinecone** — Vector database (Serverless, 1536 dimensions)

### Data Pipeline
- **Python** — Bulk data uploader script
- **OpenAI SDK** — Embedding generation

### Deployment
- **Vercel** — Frontend hosting & CDN
- **n8n Cloud** — Backend workflows

---

## 📂 Project Structure

```
qu-smart-assistant/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & services
│   └── public/           # Static assets
│
├── backend/              # n8n workflows
│   ├── qu-chat-agent.json
│   └── qu-indexer.json
│
├── data-pipeline/        # Python scripts
│   ├── pinecone_uploader.py
│   ├── fix_json.py
│   └── fix_json_advanced.py
│
└── docs/                 # Documentation & screenshots
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- n8n account ([n8n.io](https://n8n.io))
- Pinecone account
- OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/9llmy/qu-smart-assistant.git
cd qu-smart-assistant
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Data Pipeline
```bash
cd data-pipeline
pip install pinecone openai python-dotenv tqdm
# Edit pinecone_uploader.py CONFIG section
python pinecone_uploader.py
```

### 4. Import n8n Workflows
- Open n8n
- Import `backend/qu-chat-agent.json`
- Import `backend/qu-indexer.json`
- Configure credentials

---

## 👥 Project Team

| Name | ID | Role |
|------|------|------|
| **Suliman Al-Ghofaili** ⭐ | 421109766 | **Team Lead** — Backend/AI |
| Rayan Al-Harbi | 421109529 | Frontend/UI |
| Khalifah Al-Khalifah | 431109692 | Data Pipeline |
| Faris Al-Awaji | 431109338 | Data Pipeline |
| Sultan Al-Mutairi | 421109632 | Data Pipeline |
| Abdulrahman Al-Resheed | 421107788 | Frontend/UI |

**Supervisor:** Dr. Abdulgader Al-Maymuni

---

## 🎯 Vision 2030 Alignment

This project supports Saudi Arabia's Vision 2030 in three key programs:

- 🌐 **Digital Transformation** — Modernizing university services with AI
- 👨‍🎓 **Human Capacity Development** — Empowering students with 24/7 support
- 💚 **Quality of Life** — Reducing stress and improving student experience

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Academic Information

- **Institution:** Qassim University
- **College:** College of Computer
- **Department:** Computer Science
- **Course:** CS498 - Graduation Project
- **Academic Year:** 1447/1448 (2025/2026)

---

<div align="center">

**Made with ❤️ by the QU Smart Assistant Team**

[🌐 Live Demo](https://qu-smart-assistant.vercel.app) • [📦 GitHub](https://github.com/9llmy/qu-smart-assistant) • [🏛️ Qassim University](https://www.qu.edu.sa)

</div>
