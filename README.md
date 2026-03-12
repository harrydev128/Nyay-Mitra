# ⚖️ NyayMitra — हर भारतीय का Pocket Vakeel

> Legal help is now in your pocket.

NyayMitra ek bilingual (Hindi + English) AI-powered legal assistant app hai — jo common Indians ko unke legal rights samjhane mein madad karta hai, bina kisi vakeel ke.

---

## 🚀 Features

- 🤖 **AI Lawyer Chat** — Hindi & English mein legal sawaalon ke jawab
- 📄 **Document Generator** — FIR, Bail Bond, Consumer Complaint, Rent Notice aur 8+ templates
- 📷 **Document Scanner** — Camera ya file se document scan karke AI analysis
- ⚖️ **Rights Guide** — Job rights, Police rights, 50+ situations
- 🆘 **Emergency Helplines** — 112, 181, 108, 1930, 1098 aur aur bhi
- 🔐 **User Auth** — Supabase se secure login/signup

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo) |
| Backend | FastAPI (Python) |
| AI | OpenRouter — LLaMA 3.1 8B |
| Auth | Supabase |
| Language | TypeScript + Python |

---

## 📱 Screens

- **Home** — Helplines + Quick Access
- **AI Lawyer** — Chat with AI
- **Rights** — Know your rights
- **More** — Tools & Scanner
- **Profile** — Login / Signup

---

## ⚙️ Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python3 server.py
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

---

## 🌐 Environment Variables

**backend/.env**
```
OPENROUTER_API_KEY=your_key_here
```

**frontend/.env**
```
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 👨‍💻 Built by

**Dhirendra Maurya** — Neo Jarvis Ecosystem  
*"Technology se har insaan ko uska haq dilana."*

---

## 📄 License

EPL-2.0
