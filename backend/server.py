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
OPENROUTER_MODEL = "openai/gpt-3.5-turbo"
OPENROUTER_VISION_MODEL = "meta-llama/llama-3.2-11b-vision-instruct:free"

SYSTEM_PROMPT = (
    "You are NyayMitra, India's AI legal assistant. \n"
    "Rules:\n"
    "- Always respond in simple Hindi (or English if user writes in English)\n"
    "- Give practical, actionable advice\n"
    "- Structure every response as:\n"
    "  📋 स्थिति: (1 line summary of their problem)\n"
    "  ⚖️ आपके अधिकार: (bullet points of applicable rights)\n"
    "  ✅ तुरंत करें: (numbered action steps)\n"
    "  📞 हेल्पलाइन: (relevant number)\n"
    "  ⚠️ अस्वीकरण: यह AI मार्गदर्शन है, कानूनी सलाह नहीं। गंभीर मामलों में वकील से परामर्श लें।\n"
    "- Keep responses concise, max 300 words\n"
    "- Always end with the disclaimer"
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

    system_prompt = f"You are NyayMitra, an AI legal assistant for Indian law. {lang_instruction} Structure every response as: situation summary, rights, actions, helpline, disclaimer."
    
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
        "Format must be:\n"
        "- Start with document title (bold, centered)\n"
        "- Then: सेवा में, / To, [recipient designation]\n"
        "- Then: विषय: / Subject: [one line]\n"
        "- Then: मान्यवर/Dear Sir/Madam,\n"
        "- Then: Body paragraphs with proper legal language\n"
        "- Then: अतः / Therefore, [request]\n"
        "- Then: भवदीय/Yours faithfully,\n"
        "- Then: [Name placeholder]\n"
        "- Then: दिनांक/Date: \n"
        "- Write in formal, legal Hindi or English based on user language\n"
        "- Do NOT use bullet points in the document body\n"
        "- Write like a real lawyer wrote this letter"
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
    system_prompt = (
        "Analyze this Indian legal document and explain in simple Hindi:\n"
        "1. यह दस्तावेज़ क्या है?\n"
        "2. इसमें क्या लिखा है? (संक्षिप्त सारांश)\n"
        "3. महत्वपूर्ण बातें क्या हैं?\n"
        "4. क्या कोई खतरनाक clause है?\n"
        "5. आगे क्या करना चाहिए?\n"
        "6. संबंधित helpline: कौन सा नंबर call करें?"
    )

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

