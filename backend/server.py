import os
import uuid
import json
from datetime import datetime
from typing import Optional, Dict, Any

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import Enum

# Load environment variables from .env if present
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
OPENROUTER_VISION_MODEL = "meta-llama/llama-3.2-11b-vision-instruct:free"

SYSTEM_PROMPT = (
    "You are NyayMitra, India\'s official AI legal awareness assistant. "
    "You help common Indian citizens understand their legal rights and options under Indian law.\n\n"
    "CORE RULES:\n"
    "1. LANGUAGE: Reply in the same language as the user. If Hindi → Hindi. If English → English. Never mix unnecessarily.\n"
    "2. ACCURACY: Only provide information based on actual Indian laws (IPC, BNS 2023, CrPC, BNSS 2023, RTI Act 2005, Consumer Protection Act 2019, Hindu Marriage Act, Transfer of Property Act, Labour Laws, Constitution of India, etc.). Never guess or fabricate law sections.\n"
    "3. HONEST LIMITS: If you are not sure about a law, clearly say \'इस विषय में किसी वकील से सलाह लें\' or \'Please consult a lawyer for this matter.\' Never give wrong legal information.\n"
    "4. NO HARM: Never give any advice that could be illegal, harmful, or against Indian law. Never encourage violence, fraud, or breaking the law.\n"
    "5. SCOPE: Only answer questions related to Indian law, legal rights, government schemes, court procedures, police matters, property, family law, labour law, consumer rights, RTI, and related topics. For unrelated topics, politely redirect.\n\n"
    "RESPONSE FORMAT:\n"
    "For SHORT questions (1-2 line answer needed):\n"
    "- Give a direct, clear answer in 2-4 lines\n"
    "- Mention the relevant law/act name\n"
    "- End with: \'⚠️ अधिक जानकारी के लिए किसी वकील से अवश्य मिलें।\'\n\n"
    "For DETAILED questions:\n"
    "📋 स्थिति / Situation: (1 line summary)\n"
    "⚖️ कानून क्या कहता है / What Law Says: (relevant acts and sections)\n"
    "🔐 आपके अधिकार / Your Rights: (specific rights with law names)\n"
    "✅ तुरंत करें / Immediate Steps: (numbered practical steps)\n"
    "📞 हेल्पलाइन / Helpline: (relevant helpline number)\n"
    "⚠️ अस्वीकरण / Disclaimer: यह AI कानूनी जागरूकता है, कानूनी सलाह नहीं। अपने मामले के लिए किसी योग्य वकील से अवश्य परामर्श लें।\n\n"
    "EXAMPLE - If user says \'मकान मालिक ने घर से निकाल दिया\':\n"
    "- Mention Transfer of Property Act 1882, Rent Control Act\n"
    "- Tell them they cannot be evicted without court order\n"
    "- Steps: written complaint, District Court, Legal Aid\n"
    "- Helpline: 15100 (Legal Aid)\n\n"
    "Always be respectful, clear, and helpful. You are serving crores of Indians who cannot afford lawyers."
)

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable is not set")

app = FastAPI(title="NyayMitra Backend", version="1.0.0")

# CORS: allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory rate limiting: max 3 requests per IP per day
# Structure: { ip: {"date": "YYYY-MM-DD", "count": int} }
_rate_limit_store: Dict[str, Dict[str, Any]] = {}
MAX_REQUESTS_PER_DAY = 50


async def rate_limiter(request: Request) -> None:
    client_ip = request.client.host if request.client else "unknown"
    today = datetime.utcnow().date().isoformat()

    info = _rate_limit_store.get(client_ip)
    if info is None or info.get("date") != today:
        # New day or first request from this IP
        _rate_limit_store[client_ip] = {"date": today, "count": 1}
        return

    if info["count"] >= MAX_REQUESTS_PER_DAY:
        raise HTTPException(
            status_code=429,
            detail="Daily request limit reached for this IP. "
                   "Please try again tomorrow.",
        )

    info["count"] += 1


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[str] = None
    language: Optional[str] = "hindi"


class ChatResponse(BaseModel):
    response: str
    message_id: str


class TemplateType(str, Enum):
    rent_notice = "rent_notice"
    labor_complaint = "labor_complaint"
    police_complaint = "police_complaint"
    consumer_complaint = "consumer_complaint"
    custom = "custom"


class DocumentRequest(BaseModel):
    template_type: TemplateType
    fields: Dict[str, Any] = Field(default_factory=dict)
    user_situation: Optional[str] = None
    language: Optional[str] = "hindi"


class DocumentResponse(BaseModel):
    document: str


class ScanDocumentRequest(BaseModel):
    image_base64: str
    filename: str


class ScanDocumentResponse(BaseModel):
    analysis: str


def call_groq(messages: list, system_prompt: str = "") -> str:
    import requests
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    all_messages = []
    if system_prompt:
        all_messages.append({"role": "system", "content": system_prompt})
    all_messages.extend(messages)
    
    payload = {
        "model": GROQ_MODEL,
        "messages": all_messages,
        "max_tokens": 1024,
        "temperature": 0.7
    }
    response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Groq error: {response.text}")
    return response.json()["choices"][0]["message"]["content"]



@app.post("/api/chat", response_model=ChatResponse, dependencies=[Depends(rate_limiter)])
async def chat_endpoint(body: ChatRequest, request: Request) -> ChatResponse:
    language = body.language or "hi"
    if language == "en":
        lang_instruction = "IMPORTANT: Respond ONLY in English."
    else:
        lang_instruction = "IMPORTANT: Respond ONLY in Hindi."

    system_prompt = (
        f"You are NyayMitra, India's AI legal awareness assistant. {lang_instruction}\n"
        "Only answer questions related to Indian law, legal rights, court procedures, police, property, family law, labour law, consumer rights, RTI, government schemes.\n"
        "For SHORT questions: 2-4 lines with law name.\n"
        "For DETAILED questions:\n"
        "📋 स्थिति: (summary)\n"
        "⚖️ कानून: (relevant acts/sections)\n"
        "🔐 आपके अधिकार: (rights)\n"
        "✅ तुरंत करें: (steps)\n"
        "📞 हेल्पलाइन: (number)\n"
        "⚠️ अस्वीकरण: यह AI जागरूकता है, कानूनी सलाह नहीं। वकील से परामर्श लें।"
    )

    messages = [{"role": "user", "content": body.message}]
    try:
        reply = call_groq(messages, system_prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI error: {str(e)}")

    return ChatResponse(response=reply, message_id=str(uuid.uuid4()))


def build_document_prompt(template_type, fields: dict, user_situation=None) -> str:
    template_names = {
        "rent_notice": "किराया विवाद नोटिस",
        "labor_complaint": "श्रम शिकायत",
        "police_complaint": "पुलिस शिकायत पत्र",
        "consumer_complaint": "उपभोक्ता शिकायत",
        "custom": "कस्टम कानूनी दस्तावेज़"
    }
    type_str = str(template_type.value) if hasattr(template_type, 'value') else str(template_type)
    doc_type = template_names.get(type_str, "कानूनी दस्तावेज़")
    fields_text = "\n".join([f"- {k}: {v}" for k, v in fields.items()])
    situation = f"\n\nस्थिति: {user_situation}" if user_situation else ""
    return f"दस्तावेज़ प्रकार: {doc_type}\n\nजानकारी:\n{fields_text}{situation}\n\nपूरा दस्तावेज़ हिंदी में लिखें।"

@app.post(
    "/api/documents/generate",
    response_model=DocumentResponse,
    dependencies=[Depends(rate_limiter)],
)
async def generate_document_endpoint(body: DocumentRequest, request: Request) -> DocumentResponse:
    """
    Generate a Hindi legal document.

    Accepts:
      { "template_type": "...", "fields": {}, "user_situation": "...", "language": "hindi|english" }

    Returns:
      { "document": "generated text" }
    """
    language = body.language or "hindi"
    is_hindi = language in ("hindi", "hi")
    
    if is_hindi:
        lang_instruction = "यह दस्तावेज़ पूरी तरह हिंदी में लिखें। एक भी शब्द अंग्रेजी में नहीं होना चाहिए। पूरा दस्तावेज़ शुद्ध हिंदी में हो।"
        footer_text = "⚠️ यह दस्तावेज़ NyayMitra AI द्वारा तैयार किया गया है। कानूनी उपयोग से पहले किसी योग्य वकील से समीक्षा अवश्य करवाएं।"
        header_text = "AI जनरेटेड दस्तावेज़ | NyayMitra"
    else:
        lang_instruction = "Write this entire document in English only. No Hindi words at all."
        footer_text = "⚠️ This document is AI generated by NyayMitra. Please get it reviewed by a qualified lawyer before legal use."
        header_text = "AI GENERATED DOCUMENT | NyayMitra"
    
    document_system_prompt = (
        f"You are a senior Indian lawyer generating a formal legal document. {lang_instruction}\n\n"
        "STRICT RULES:\n"
        "1. Write ONLY the document — no explanations, no commentary\n"
        "2. Use correct Indian law sections (IPC/BNS, CrPC/BNSS, Constitution, etc.)\n"
        "3. Document must look like a real court/legal document\n"
        "4. No bullet points in body — use proper paragraphs\n"
        "5. Include all relevant law sections for the document type\n"
        "6. Write formally like a real Indian lawyer\n\n"
        f"START the document with this watermark line (light, subtle):\n"
        f"[{header_text}]\n\n"
        "Then write the actual document in this exact format:\n"
        "- Document Title (CAPITALS, centered)\n"
        "- सेवा में / To: [Recipient with full designation]\n"
        "- विषय / Subject: [One clear line]\n"
        "- महोदय / Dear Sir/Madam,\n"
        "- Opening paragraph (state the problem clearly)\n"
        "- Legal paragraph (cite exact law sections)\n"  
        "- Facts paragraph (detailed facts)\n"
        "- Relief/Request paragraph (what action is needed)\n"
        "- अतः / Therefore: [specific request]\n"
        "- भवदीय / Yours faithfully,\n"
        "- [Applicant Name]\n"
        "- दिनांक / Date: [Date]\n"
        "- पता / Address: [Address]\n\n"
        f"END the document with:\n{footer_text}\n"
        "                    — NyayMitra"
    )
    
    user_prompt = build_document_prompt(body.template_type, body.fields, body.user_situation)
    user_prompt = f"{lang_instruction}. {user_prompt}"

    messages = [
        {"role": "system", "content": document_system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    document_text = call_groq(messages, document_system_prompt)
    return DocumentResponse(document=document_text)


@app.post(
    "/api/scan-document",
    response_model=ScanDocumentResponse,
    dependencies=[Depends(rate_limiter)],
)
async def scan_document_endpoint(body: ScanDocumentRequest, request: Request) -> ScanDocumentResponse:
    """
    Analyze a legal document image using OpenRouter vision model.
    Accepts: { "image_base64": "...", "filename": "document.jpg" }
    """
    system_prompt = (
        "You are NyayMitra. Analyze this legal document image. Respond ONLY in Hindi. "
        "Tell: 1) यह दस्तावेज़ क्या है 2) इसका कानूनी उपयोग 3) संबंधित भारतीय कानून/धारा "
        "4) इस दस्तावेज़ से व्यक्ति के क्या अधिकार हैं"
    )

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyaymitra.app",
        "X-Title": "NyayMitra Backend",
    }

    image_url = f"data:image/jpeg;base64,{body.image_base64}"

    vision_payload = {
        "model": OPENROUTER_VISION_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"फ़ाइल का नाम: {body.filename}\nकृपया ऊपर दिए गए निर्देशों के अनुसार इस दस्तावेज़ का विश्लेषण करें।",
                    },
                    {
                        "type": "input_image",
                        "image_url": image_url,
                    },
                ],
            },
        ],
    }

    # First, try the vision model
    try:
        resp = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=vision_payload,
            timeout=60,
        )
        if resp.ok:
            data = resp.json()
            try:
                content = data["choices"][0]["message"]["content"]
            except (KeyError, IndexError, TypeError):
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response structure from OpenRouter vision model",
                )
            return ScanDocumentResponse(analysis=content)
    except requests.RequestException:
        # Fall through to text-only fallback
        pass

    # Fallback: use text model with filename/context only
    fallback_messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": (
                f"फ़ाइल का नाम: {body.filename}\n"
                "छवि को सीधे नहीं पढ़ा जा सका। केवल फ़ाइल नाम और संदर्भ के आधार पर, "
                "अनुमान लगाकर ऊपर दिए गए निर्देशों के अनुसार उत्तर दें।"
            ),
        },
    ]

    analysis_text = call_groq(fallback_messages, "")
    return ScanDocumentResponse(analysis=analysis_text)


class AnalyzeDocumentRequest(BaseModel):
    file_data: str
    file_type: str
    language: str


class AnalyzeDocumentResponse(BaseModel):
    analysis: str


@app.post(
    "/api/analyze-document",
    response_model=AnalyzeDocumentResponse,
    dependencies=[Depends(rate_limiter)],
)
async def analyze_document_endpoint(body: AnalyzeDocumentRequest, request: Request) -> AnalyzeDocumentResponse:
    """
    Analyze an Indian legal document using OpenRouter.
    Accepts: { "file_data": "base64", "file_type": "string", "language": "string" }
    Returns full Hindi text analysis.
    """
    lang = body.language or "hindi"
    system_prompt = f"""You are a legal document analyzer for India.
Analyze this document/image carefully and provide 
a complete analysis in {lang} language.

Provide analysis in this exact structure:

1. दस्तावेज़ का प्रकार / Document Type:
   (What is this document - legal notice, agreement, 
    government form, ID proof, bill, photo, etc.)

2. मुख्य सामग्री / Main Content:
   (What does it contain - key information, names, 
    dates, amounts, terms mentioned)

3. कानूनी स्थिति / Legal Status:
   - वैध है या नहीं (Valid or Invalid - explain why)
   - किसी stamp/signature की जरूरत है?
   - Registration जरूरी है?

4. महत्वपूर्ण बातें / Important Points:
   - क्या कोई खतरनाक clause है?
   - क्या कोई deadline miss हो रही है?
   - कोई गलत जानकारी?

5. आपके अधिकार / Your Rights:
   - इस document में आपके क्या अधिकार हैं?
   - क्या यह document legally binding है?

6. तुरंत क्या करें / Immediate Action:
   - Step 1, Step 2, Step 3

7. संबंधित helpline / Related Helpline:
   - Relevant government helpline number
   - Relevant law/act name

8. ⚠️ अस्वीकरण: यह AI विश्लेषण है, 
   कानूनी सलाह नहीं। गंभीर मामलों में 
   वकील से परामर्श लें।

Analyze whatever is in the image - 
legal document, photo, bill, ID, certificate, 
government form, or anything else.
Be specific and helpful."""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyaymitra.app",
        "X-Title": "NyayMitra Backend",
    }

    mime_type = body.file_type
    data_url = f"data:{mime_type};base64,{body.file_data}"

    # Use vision model if available for images
    if mime_type.startswith("image/"):
        vision_payload = {
            "model": OPENROUTER_VISION_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Language: {body.language}",
                        },
                        {
                            "type": "input_image",
                            "image_url": data_url,
                        },
                    ],
                },
            ],
        }

        try:
            resp = requests.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=vision_payload,
                timeout=90,
            )
            if resp.ok:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                return AnalyzeDocumentResponse(analysis=content)
        except requests.RequestException:
            pass

    # Fallback/Text-based for PDF or vision fail
    fallback_messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": f"Document content (base64) provided. Language: {body.language}. Please analyze according to instructions."
        },
    ]

    analysis_text = call_groq(fallback_messages, "")
    return AnalyzeDocumentResponse(analysis=analysis_text)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )

