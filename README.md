<div align="center">

# ⚖️ NyayMitra
### भारत का AI कानूनी सहायक | India's AI Legal Assistant

[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

<br/>

> **NyayMitra** — एक AI-powered mobile application जो भारत के आम नागरिकों को उनके कानूनी अधिकारों की जानकारी देती है, legal documents बनाने में मदद करती है, और 24/7 AI वकील की सुविधा प्रदान करती है।

<br/>

![NyayMitra Banner](https://img.shields.io/badge/⚖️_NyayMitra-भारत_का_AI_वकील-E8610A?style=for-the-badge)

</div>

---

## 📱 Screenshots

<div align="center">

| Home Screen | AI Lawyer | Documents | Rights |
|:-----------:|:---------:|:---------:|:------:|
| ![Home](https://via.placeholder.com/150x280/141B3C/E8610A?text=Home) | ![Chat](https://via.placeholder.com/150x280/141B3C/E8610A?text=AI+Chat) | ![Docs](https://via.placeholder.com/150x280/141B3C/E8610A?text=Documents) | ![Rights](https://via.placeholder.com/150x280/141B3C/E8610A?text=Rights) |

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI कानूनी सहायक
- **24/7 AI Lawyer** — Hindi & English में
- Groq LLaMA 3.3 70B model powered
- Indian law के अनुसार सटीक जानकारी
- BNS, BNSS, RTI Act, Consumer Protection Act

</td>
<td width="50%">

### 📝 Document Generator
- **Police Complaint** — BNS sections के साथ
- **Rent Agreement** — Transfer of Property Act
- **RTI Application** — RTI Act 2005
- **Labour Complaint** — Industrial Disputes Act
- **Consumer Complaint** — Consumer Protection Act 2019

</td>
</tr>
<tr>
<td width="50%">

### 🔍 Document Scanner
- AI-powered document analysis
- Legal validity check
- Rights identification
- Immediate action steps

</td>
<td width="50%">

### 🏛️ More Features
- **40+ Legal Rights** — detailed information
- **Govt Schemes** — PM Kisan, Ayushman Bharat etc.
- **Emergency Helplines** — 112, 181, 15100 etc.
- **Court Tracker** — case status tracking
- **Property Guide** — property dispute guide
- **Salary Calculator** — labour law based
- **e-Challan Checker** — traffic violation

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|----------|-----------|
| **Frontend** | React Native + Expo SDK 54 |
| **Backend** | FastAPI (Python) |
| **AI Model** | Groq — LLaMA 3.3 70B + LLaMA 4 Scout (Vision) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email + OTP) |
| **Payment** | Razorpay |
| **Deployment** | Railway (Backend) |
| **State Management** | React Context API |
| **Navigation** | Expo Router (File-based) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- Expo Go app (for testing)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/dhirendram128-netizen/Nyay-Mitra.git
cd Nyay-Mitra
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

Start the app:
```bash
npx expo start
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:
```env
GROQ_API_KEY=your_groq_api_key
```

Start the server:
```bash
python server.py
```

---

## 📁 Project Structure

```
Nyay-Mitra/
├── frontend/                    # React Native App
│   ├── app/
│   │   ├── (tabs)/              # Main tab screens
│   │   │   ├── index.tsx        # Home screen
│   │   │   ├── chat.tsx         # AI Lawyer chat
│   │   │   ├── rights.tsx       # Legal rights
│   │   │   ├── documents.tsx    # Documents tab
│   │   │   └── profile.tsx      # User profile
│   │   ├── auth/                # Authentication
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── doc-generator.tsx    # Document generator
│   │   ├── doc-scanner.tsx      # AI Document scanner
│   │   ├── rti-writer.tsx       # RTI application writer
│   │   ├── rent-agreement.tsx   # Rent agreement
│   │   ├── property-guide.tsx   # Property guide
│   │   ├── govt-schemes.tsx     # Government schemes
│   │   ├── premium.tsx          # Premium plans
│   │   └── emergency.tsx        # Emergency helplines
│   ├── components/              # Reusable components
│   ├── context/                 # App context (state)
│   ├── services/                # API services
│   └── constants/               # Colors, config
│
├── backend/                     # FastAPI Backend
│   ├── server.py                # Main server file
│   └── requirements.txt
│
└── README.md
```

---

## 💰 Premium Plans

| Feature | Free | Silver ₹49/mo | Gold ₹149/mo | Pro ₹499/mo |
|---------|:----:|:-------------:|:------------:|:-----------:|
| AI Chat | 2/day | Unlimited | Unlimited | Unlimited |
| Legal Rights | 10 | 40+ | 40+ | 40+ |
| Documents | ❌ | ✅ | ✅ | ✅ |
| Document Scanner | ❌ | ✅ | ✅ | ✅ |
| PDF Download | ❌ | ❌ | ✅ | ✅ |
| Lawyer Review | ❌ | ❌ | ✅ | ✅ |
| 1:1 Consultation | ❌ | ❌ | ❌ | ✅ |
| 24/7 Support | ❌ | ❌ | ❌ | ✅ |

---

## 🔒 Security

- ✅ Email verification required for new accounts
- ✅ Supabase Row Level Security (RLS) enabled
- ✅ API keys stored in environment variables only
- ✅ No sensitive keys in source code
- ✅ Rate limiting on all API endpoints (50 req/day per IP)
- ✅ CORS protection enabled

---

## ⚖️ Legal Disclaimer

> NyayMitra provides **general legal awareness** only. It is **NOT** a substitute for professional legal advice. For serious legal matters, always consult a qualified lawyer. All information is based on Indian law and may vary by jurisdiction.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

<div align="center">

[![WhatsApp](https://img.shields.io/badge/WhatsApp_Support-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/918573821917)

**Mon-Sat | 10 AM - 6 PM**

</div>

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for भारत के आम नागरिक**

⚖️ **NyayMitra** — *न्याय सबके लिए*

![Footer](https://img.shields.io/badge/NyayMitra-Justice_for_All-E8610A?style=for-the-badge)

</div>
