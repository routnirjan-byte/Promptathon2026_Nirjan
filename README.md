# 🚦 Smart Nagpur Municipal Control

> **AI-Native Urban Command Center & Real-Time Traffic Orchestration Platform**

Smart Nagpur Municipal Control transforms traditional, reactive municipal traffic monitoring into an autonomous, real-time traffic management grid. Powered by high-speed AI agents and Groq-accelerated LLM inference, the platform continuously monitors urban traffic telemetry, detects congestion bottlenecks, and provides instant decision support for city operators.

---

##  Key Features

* ** Ultra-Low Latency Inference:** Powered by Groq LPU hardware running Llama 3.3 for sub-300ms decision support.
* ** Dual AI Agent Architecture:**
  * **Nemo AI Copilot:** Interactive decision-support assistant for city commanders to generate signal timing plans, reroute strategies, and incident logs using natural language.
  * **Autonomous Telemetry Auditor:** Background agent that continuously monitors 11 key corridors, detecting speed drops and delay anomalies in real-time.
* **Live Telemetry Dashboard:** Interactive map and heatmaps tracking traffic velocity, queue lengths, and congestion levels across major Nagpur corridors (e.g., Variety Square, Wardha Road).
* ** Serverless & Edge Ready:** Built for instantaneous UI rendering and lightweight microservice deployment.

---

##  System Architecture

[ Sensor Nodes / Camera Telemetry ]
│
▼
[ Real-Time Data Stream ]
│
┌───────┴────────────────────────┐
▼                                ▼
[ Autonomous Telemetry Auditor ]  [ Live Dashboard UI ]
(Anomaly & Bottleneck Detection)       │
│                                ▼
└──────────────────► [ Nemo AI Copilot (Groq / Llama 3.3) ]
│
▼
[ Dynamic Signal Offsets & ]
[ Actionable Policy Plans  ]

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Styling & UI:** Responsive Dashboard, Custom CSS Systems
* **AI Engine:** Llama 3.3 via Groq API (Sub-second inference)
* **Deployment:** [Vercel](https://vercel.com) (Serverless Edge Network)

---

## 📁 Repository Structure

.
├── index.html          # Main Municipal Command Dashboard
├── traffic.html        # Live Traffic & Corridor Analytics
├── zones.html          # Ward & Zone Management View
├── alerts.html         # Real-time Telemetry Anomalies & Logs
├── nemo-chatbot.js     # Nemo AI Copilot & Groq API Integration
├── vercel.json         # Vercel Configuration (Clean URLs enabled)
└── README.md           # Project Documentation

## 🚀 Getting Started

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/smart-nagpur.git](https://github.com/your-username/smart-nagpur.git)
   cd smart-nagpur
