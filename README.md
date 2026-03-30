<div align="center">

<img src="https://img.shields.io/badge/⚖️_NyayMitra-भारत_का_AI_वकील-FF6B00?style=for-the-badge" />

# ⚖️ NyayMitra
## भारत का AI Legal Assistant

> *"न्याय सबका अधिकार है — अब Hindi में, AI से, ₹49 में"*

[![Live Demo](https://img.shields.io/badge/🌐_Live_App-Visit_Now-FF6B00?style=for-the-badge)](https://nyay-mitra-wfqb.vercel.app)
[![Backend](https://img.shields.io/badge/🚂_API-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Made in India](https://img.shields.io/badge/Made_with_❤️-India-FF9933?style=for-the-badge)](https://github.com/harrydev128/Nyay-Mitra)
[![License](https://img.shields.io/badge/License-MIT-1a237e?style=for-the-badge)](LICENSE)

</div>

---

## 🇮🇳 The Problem — Bharat Ka Asli Dard

India mein **1.4 billion** log hain.  
Par **kanoon** sirf unke liye hai jinke paas:

| ❌ Aam Aadmi | ✅ Elite |
|:---:|:---:|
| Vakeel afford nahi kar sakta | ₹5000/hr vakeel hire karta hai |
| English nahi aati | English mein documents padhta hai |
| Rights pata nahi | Apne rights jaanta hai |
| Police se darta hai | Law use karta hai apne liye |

**NyayMitra** is gap ko bharta hai. 🔥

---

## ✨ Features

### 🤖 AI Vakeel — 24/7 Kanuni Sahayak
```
Koi bhi kanuni sawaal → Hindi mein jawab → Turant
```
- Groq LLaMA3-70B powered — Lightning fast
- Hindi + English dono supported  
- FIR guidance, consumer rights, property disputes

### ⚖️ 40+ Kanuni Adhikar — Apna Haq Jaano
- 🏠 Kiraaydaar Adhikar
- 👮 Police Girftari ke Rights
- 👩 Mahila Adhikar  
- 🛒 Upbhokta Adhikar
- 👷 Karmchaari Adhikar
- 👶 Bal Adhikar
- ...aur bahut kuch

### 📄 AI Document Generator
| Document | Description |
|----------|-------------|
| 📝 Kiraya Samjhauta | Complete rent agreement |
| 🚨 FIR Draft | Auto-formatted complaint |
| ⚠️ Legal Notice | Ready to send |
| 💰 Salary Calculator | Take-home calculate karo |
| 🚦 e-Challan Checker | Traffic fine status |

### 🏛️ Sarkari Yojnaayein
- PM Kisan Samman Nidhi — ₹6000/saal
- Ayushman Bharat — ₹5 lakh muft ilaaj
- 10+ schemes with eligibility info

### 🔐 Secure Auth System
- ✅ Email OTP Verification
- ✅ Magic Link Login
- ✅ Referral System (7 din Silver FREE)
- ✅ Supabase powered security

---

## 💎 Plans
```
FREE        → ₹0/mo    → Basic AI chat
SILVER  ⭐  → ₹49/mo   → 40+ rights + unlimited docs + AI scanner
GOLD    🥇  → ₹149/mo  → Silver + PDF + Lawyer review
PRO     👑  → ₹499/mo  → Gold + 1:1 Vakeel + 24/7 Priority
```

---

## 🏗️ Tech Stack
```
📱 Frontend    →  Expo React Native (Web + Android + iOS)
⚙️  Backend    →  FastAPI (Python) on Railway
🗄️  Database   →  Supabase (PostgreSQL)
🔐 Auth        →  Supabase Auth (OTP + Magic Link)
🤖 AI Model    →  Groq LLaMA3-70B-8192
💳 Payments    →  Razorpay
🌐 Deploy      →  Vercel (Frontend) + Railway (Backend)
```

---

## 🚀 Local Setup

### Frontend
```bash
git clone https://github.com/harrydev128/Nyay-Mitra.git
cd Nyay-Mitra/frontend
npm install

# .env file
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key

npx expo start          # Mobile
npx expo start --web    # Browser
```

### Backend
```bash
cd Nyay-Mitra/backend
pip install -r requirements.txt

# .env file
GROQ_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key

python server.py
```

---

## 📁 Structure
```
Nyay-Mitra/
├── 📱 frontend/
│   ├── app/
│   │   ├── (tabs)/           # Home, AI Chat, Rights, Docs, Profile
│   │   ├── auth/             # Login, Signup, OTP Verify
│   │   ├── rent-agreement.tsx
│   │   ├── salary-calculator.tsx
│   │   └── challan-checker.tsx
│   ├── context/AppContext.tsx # Global State
│   ├── services/supabase.ts  # DB Client
│   └── utils/showAlert.ts    # Cross-platform alerts
│
├── ⚙️  backend/
│   ├── server.py             # FastAPI Server
│   └── requirements.txt
│
└── 📖 README.md
```

---

## 🌐 Links

| | Link |
|--|------|
| 🌐 Web App | [nyay-mitra-wfqb.vercel.app](https://nyay-mitra-wfqb.vercel.app) |
| 🐙 GitHub | [harrydev128/Nyay-Mitra](https://github.com/harrydev128/Nyay-Mitra) |

---

## 🤝 Contributing
```bash
git checkout -b feature/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
# Open a Pull Request
```

---

<div align="center">

## ⭐ Star this repo if it helped you!

*भारत के हर नागरिक को उसका अधिकार मिलना चाहिए*

**⚖️ NyayMitra — न्याय सबका अधिकार है**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=harrydev128.Nyay-Mitra)

</div>
