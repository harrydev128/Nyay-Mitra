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

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "deepseek/deepseek-r1:free"
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

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY environment variable is not set")

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


def call_openrouter(messages: list) -> str:
    """Call OpenRouter and return the assistant message content."""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nyaymitra.app",
        "X-Title": "NyayMitra Backend",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
    }

    try:
        resp = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=60,
        )
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Error contacting OpenRouter: {exc}",
        ) from exc

    if not resp.ok:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"OpenRouter error: {resp.text}",
        )

    data = resp.json()
    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        raise HTTPException(
            status_code=500,
            detail="Invalid response structure from OpenRouter",
        )

    return content


@app.post(
    "/api/chat",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limiter)],
)
async def chat_endpoint(body: ChatRequest, request: Request) -> ChatResponse:
    """
    Chat endpoint.

    Accepts:
      { "message": "user text", "session_id": "optional", "language": "hindi|english" }

    Returns:
      { "response": "AI reply", "message_id": "id" }
    """
    language = body.language or "hi"

    if language == 'en':
        lang_instruction = "IMPORTANT: You must respond ONLY in English. Do not use Hindi at all."
    else:
        lang_instruction = "IMPORTANT: You must respond ONLY in Hindi. Do not use English at all."

    system_prompt = (
        f"You are NyayMitra, India's official AI legal awareness assistant for Indian citizens. {lang_instruction}\n"
        "Only answer questions related to Indian law, legal rights, court procedures, police matters, property, family law, labour law, consumer rights, RTI, and government schemes.\n"
        "For unrelated topics, politely say: 'मैं केवल भारतीय कानून से संबंधित सवालों का जवाब दे सकता हूं।'\n"
        "For SHORT questions: Give direct answer in 2-4 lines with relevant law name.\n"
        "For DETAILED questions use this format:\n"
        "📋 स्थिति: (1 line summary)\n"
        "⚖️ कानून क्या कहता है: (relevant Indian acts and sections)\n"
        "🔐 आपके अधिकार: (specific rights)\n"
        "✅ तुरंत करें: (numbered steps)\n"
        "📞 हेल्पलाइन: (relevant number)\n"
        "⚠️ अस्वीकरण: यह AI कानूनी जागरूकता है, कानूनी सलाह नहीं। अपने मामले के लिए किसी योग्य वकील से अवश्य परामर्श लें।\n"
        "Never fabricate law sections. If unsure, say 'इस विषय में किसी वकील से सलाह लें'."
    )
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": body.message},
    ]

    reply_text = call_openrouter(messages)
    message_id = str(uuid.uuid4())

    return ChatResponse(response=reply_text, message_id=message_id)


def build_document_prompt(template_type: TemplateType, fields: Dict[str, Any], user_situation: Optional[str]) -> str:
    """Create a Hindi prompt for document generation based on template type, fields and situation."""
    base_intro = (
        "नीचे दिए गए विवरण के आधार पर एक विस्तृत लेकिन सरल हिंदी में कानूनी दस्तावेज़ तैयार करें। "
        "दस्तावेज़ औपचारिक भाषा में हो, पैराग्राफ़ साफ-साफ हों, और अंत में यह भी लिखें कि "
        "गंभीर मामलों में वास्तविक वकील से सलाह लेना ज़रूरी है।\n\n"
    )

    template_names = {
        TemplateType.rent_notice: "किराया विवाद नोटिस",
        TemplateType.labor_complaint: "श्रम शिकायत (Labor Complaint)",
        TemplateType.police_complaint: "पुलिस शिकायत पत्र (Police Complaint)",
        TemplateType.consumer_complaint: "उपभोक्ता शिकायत (Consumer Complaint)",
        TemplateType.custom: "कस्टम कानूनी दस्तावेज़"
    }

    doc_type_line = f"दस्तावेज़ प्रकार: {template_names.get(template_type, 'कानूनी दस्तावेज़')}\n"
    
    fields_text = "दस्तावेज़ के लिए जानकारी:\n" + "\n".join([f"- {k}: {v}" for k, v in fields.items()])
    situation_text = f"\n\nउपयोगकर्ता की स्थिति: {user_situation}" if user_situation else ""

    return (
        f"{base_intro}"
        f"{doc_type_line}"
        f"{fields_text}"
        f"{situation_text}"
        f"\n\nपूरी तरह तैयार हिंदी दस्तावेज़ लिखें। यह एक वास्तविक दस्तावेज़ होना चाहिए, "
        f"केवल एक टेम्पलेट नहीं। सभी विवरणों को सही जगह पर भरें। केवल दस्तावेज़ का पाठ लौटाएँ, कोई अतिरिक्त टिप्पणी न दें।"
    )


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
    lang_instruction = "Generate this document in Hindi" if language == "hindi" else "Generate this document in English"
    
    document_system_prompt = (
        "Generate a formal Indian legal document in the user's language.\n"
        "IMPORTANT: Start the document with this exact header on first line:\n"
        "--- AI GENERATED DOCUMENT | NyayMitra ---\n"
        "--- यह दस्तावेज़ AI द्वारा तैयार किया गया है | NyayMitra ---\n"
        "Then leave one blank line, then start the actual document.\n"
        "Format must be:\n"
        "- Document title (centered)\n"
        "- सेवा में, / To, [recipient designation]\n"
        "- विषय: / Subject: [one line]\n"
        "- मान्यवर / Dear Sir/Madam,\n"
        "- Body paragraphs with proper formal legal language\n"
        "- Use correct Indian law acts and sections wherever applicable\n"
        "- अतः / Therefore, [request]\n"
        "- भवदीय / Yours faithfully,\n"
        "- [Name placeholder]\n"
        "- दिनांक / Date:\n"
        "- End with: ⚠️ यह दस्तावेज़ AI सहायता से तैयार है। कानूनी उपयोग से पहले किसी योग्य वकील से समीक्षा करवाएं।\n"
        "- Write in formal, legal Hindi or English based on user language\n"
        "- Do NOT use bullet points in the document body\n"
        "- No spelling mistakes in Hindi or English\n"
        "- Write like a real Indian lawyer wrote this document"
    )
    
    user_prompt = build_document_prompt(body.template_type, body.fields, body.user_situation)
    user_prompt = f"{lang_instruction}. {user_prompt}"

    messages = [
        {"role": "system", "content": document_system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    document_text = call_openrouter(messages)
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

    analysis_text = call_openrouter(fallback_messages)
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

    analysis_text = call_openrouter(fallback_messages)
    return AnalyzeDocumentResponse(analysis=analysis_text)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )

