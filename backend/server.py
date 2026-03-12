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
    "You are NyayMitra, an expert AI legal assistant specialized in Indian law. Always respond in Hindi.\n"
    "Give structured answers:\n\n"
    "Explain the legal right clearly.\n\n"
    "Mention relevant Indian Act and section number if possible.\n\n"
    "Give practical steps the user should take.\n\n"
    "Warn about limitations.\n\n"
    "Always say: 'गंभीर मामलों में किसी योग्य वकील से सलाह अवश्य लें।'\n\n"
    "Keep answers practical and specific, not generic."
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
MAX_REQUESTS_PER_DAY = 3


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


class ChatResponse(BaseModel):
    response: str
    message_id: str


class TemplateType(str, Enum):
    fir = "fir"
    notice = "notice"
    complaint = "complaint"
    custom = "custom"


class DocumentRequest(BaseModel):
    template_type: TemplateType
    details: Dict[str, Any] = Field(default_factory=dict)


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
      { "message": "user text", "session_id": "optional" }

    Returns:
      { "response": "AI reply", "message_id": "id" }
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": body.message},
    ]

    reply_text = call_openrouter(messages)
    message_id = str(uuid.uuid4())

    return ChatResponse(response=reply_text, message_id=message_id)


def build_document_prompt(template_type: TemplateType, details: Dict[str, Any]) -> str:
    """Create a Hindi prompt for document generation based on template type and details."""
    base_intro = (
        "नीचे दिए गए विवरण के आधार पर एक विस्तृत लेकिन सरल हिंदी में कानूनी दस्तावेज़ तैयार करें। "
        "दस्तावेज़ औपचारिक भाषा में हो, पैराग्राफ़ साफ-साफ हों, और अंत में यह भी लिखें कि "
        "गंभीर मामलों में वास्तविक वकील से सलाह लेना ज़रूरी है।\n\n"
    )

    if template_type == TemplateType.fir:
        doc_type_line = "दस्तावेज़ प्रकार: एफआईआर (प्रथम सूचना रिपोर्ट)\n"
    elif template_type == TemplateType.notice:
        doc_type_line = "दस्तावेज़ प्रकार: कानूनी नोटिस\n"
    elif template_type == TemplateType.complaint:
        doc_type_line = "दस्तावेज़ प्रकार: कानूनी शिकायत (कम्प्लेंट)\n"
    else:
        doc_type_line = "दस्तावेज़ प्रकार: कस्टम कानूनी दस्तावेज़\n"

    details_text = json.dumps(details, ensure_ascii=False, indent=2)

    return (
        base_intro
        + doc_type_line
        + "विवरण (Details):\n"
        + details_text
        + "\n\nपूरी तरह तैयार हिंदी दस्तावेज़ लिखें। केवल दस्तावेज़ का पाठ लौटाएँ, कोई अतिरिक्त टिप्पणी न दें।"
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
      { "template_type": "fir/notice/complaint", "details": {} }

    Returns:
      { "document": "generated text" }
    """
    user_prompt = build_document_prompt(body.template_type, body.details)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )

