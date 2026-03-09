from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== Models ==============

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    language: str = "hindi"  # "hindi" or "english"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "hindi"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    message_id: str

class RightsCategory(BaseModel):
    id: str
    name_hindi: str
    name_english: str
    icon: str
    description_hindi: str
    description_english: str
    color: str

class RightsDetail(BaseModel):
    id: str
    category_id: str
    title_hindi: str
    title_english: str
    content_hindi: str
    content_english: str
    steps_hindi: List[str]
    steps_english: List[str]
    emergency_contacts: List[dict] = []
    legal_sections: List[str] = []

# ============== Rights Data ==============

RIGHTS_CATEGORIES = [
    {
        "id": "employment",
        "name_hindi": "नौकरी से निकाला",
        "name_english": "Job Termination",
        "icon": "briefcase",
        "description_hindi": "अगर आपको नौकरी से निकाला गया है तो जानें अपने अधिकार",
        "description_english": "Know your rights if you've been fired from your job",
        "color": "#FF9933"
    },
    {
        "id": "police",
        "name_hindi": "पुलिस द्वारा गिरफ्तारी",
        "name_english": "Police Arrest",
        "icon": "shield",
        "description_hindi": "अगर पुलिस ने पकड़ा है तो जानें अपने अधिकार",
        "description_english": "Know your rights if police arrests you",
        "color": "#0A3D62"
    },
    {
        "id": "accident",
        "name_hindi": "दुर्घटना / एक्सीडेंट",
        "name_english": "Road Accident",
        "icon": "car",
        "description_hindi": "दुर्घटना के बाद इंश्योरेंस क्लेम और मुआवज़ा",
        "description_english": "Insurance claim and compensation after accident",
        "color": "#138808"
    },
    {
        "id": "domestic_violence",
        "name_hindi": "घरेलू हिंसा",
        "name_english": "Domestic Violence",
        "icon": "home",
        "description_hindi": "घरेलू हिंसा से बचाव और कानूनी सहायता",
        "description_english": "Protection from domestic violence and legal help",
        "color": "#E74C3C"
    },
    {
        "id": "consumer",
        "name_hindi": "उपभोक्ता अधिकार",
        "name_english": "Consumer Rights",
        "icon": "shopping-cart",
        "description_hindi": "खराब सामान या सेवा मिलने पर शिकायत करें",
        "description_english": "Complain about defective products or services",
        "color": "#9B59B6"
    },
    {
        "id": "tenant",
        "name_hindi": "किरायेदार अधिकार",
        "name_english": "Tenant Rights",
        "icon": "building",
        "description_hindi": "मकान मालिक से परेशान हैं? जानें अधिकार",
        "description_english": "Troubled by landlord? Know your rights",
        "color": "#3498DB"
    },
    {
        "id": "women",
        "name_hindi": "महिला अधिकार",
        "name_english": "Women's Rights",
        "icon": "female",
        "description_hindi": "कार्यस्थल और समाज में महिलाओं के अधिकार",
        "description_english": "Women's rights at workplace and society",
        "color": "#E91E63"
    },
    {
        "id": "property",
        "name_hindi": "संपत्ति विवाद",
        "name_english": "Property Disputes",
        "icon": "landmark",
        "description_hindi": "जमीन-जायदाद के विवाद में अपने अधिकार",
        "description_english": "Your rights in property disputes",
        "color": "#795548"
    }
]

RIGHTS_DETAILS = {
    "employment": {
        "id": "employment",
        "category_id": "employment",
        "title_hindi": "नौकरी से निकाले जाने पर आपके अधिकार",
        "title_english": "Your Rights When Fired From Job",
        "content_hindi": """भारत में श्रम कानून के तहत, किसी भी कर्मचारी को अचानक नौकरी से नहीं निकाला जा सकता। कंपनी को कम से कम 1 महीने का नोटिस या नोटिस पीरियड की सैलरी देनी होती है।

अगर आपको बिना किसी वैध कारण के निकाला गया है, तो यह 'Wrongful Termination' माना जा सकता है।""",
        "content_english": """Under Indian labor laws, no employee can be terminated suddenly. The company must give at least 1 month notice or salary in lieu of notice period.

If you've been fired without valid reason, it may be considered 'Wrongful Termination'.""",
        "steps_hindi": [
            "टर्मिनेशन लेटर की कॉपी मांगें",
            "अपना पूरा बकाया सैलरी, PF, ग्रेच्युटी मांगें",
            "एक्सपीरियंस लेटर और रिलीविंग लेटर लें",
            "Labour Commissioner को शिकायत करें",
            "Labour Court में केस दर्ज कराएं"
        ],
        "steps_english": [
            "Ask for copy of termination letter",
            "Claim all dues - salary, PF, gratuity",
            "Get experience letter and relieving letter",
            "File complaint with Labour Commissioner",
            "File case in Labour Court"
        ],
        "emergency_contacts": [
            {"name": "Labour Helpline", "number": "14434"},
            {"name": "EPFO Helpline", "number": "1800-118-005"}
        ],
        "legal_sections": ["Industrial Disputes Act 1947", "Payment of Gratuity Act 1972", "Employees' PF Act 1952"]
    },
    "police": {
        "id": "police",
        "category_id": "police",
        "title_hindi": "पुलिस द्वारा गिरफ्तारी पर आपके अधिकार",
        "title_english": "Your Rights When Arrested by Police",
        "content_hindi": """अनुच्छेद 22 के तहत, गिरफ्तार व्यक्ति को 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश करना अनिवार्य है।

पुलिस आपको बिना वारंट के तभी गिरफ्तार कर सकती है जब अपराध 'cognizable' हो (जैसे चोरी, मारपीट)।""",
        "content_english": """Under Article 22, an arrested person must be produced before a magistrate within 24 hours.

Police can arrest without warrant only for 'cognizable' offenses (like theft, assault).""",
        "steps_hindi": [
            "चुप रहने का अधिकार - जबरदस्ती बयान न दें",
            "वकील से मिलने का अधिकार मांगें",
            "परिवार को सूचित करने का अधिकार",
            "गिरफ्तारी का कारण पूछें",
            "मेडिकल जांच का अधिकार",
            "महिला को रात में गिरफ्तार नहीं किया जा सकता"
        ],
        "steps_english": [
            "Right to remain silent - don't give forced statements",
            "Demand right to meet lawyer",
            "Right to inform family",
            "Ask reason for arrest",
            "Right to medical examination",
            "Women cannot be arrested at night"
        ],
        "emergency_contacts": [
            {"name": "Police Helpline", "number": "100"},
            {"name": "Women Helpline", "number": "181"},
            {"name": "Human Rights Commission", "number": "14433"}
        ],
        "legal_sections": ["Article 22 of Constitution", "CrPC Section 41", "D.K. Basu Guidelines"]
    },
    "accident": {
        "id": "accident",
        "category_id": "accident",
        "title_hindi": "सड़क दुर्घटना के बाद आपके अधिकार",
        "title_english": "Your Rights After Road Accident",
        "content_hindi": """Motor Vehicles Act के तहत, दुर्घटना पीड़ित को मुआवज़ा पाने का अधिकार है।

Third Party Insurance के तहत बिना गलती साबित किए भी मुआवज़ा मिल सकता है।""",
        "content_english": """Under Motor Vehicles Act, accident victims have right to compensation.

Under Third Party Insurance, compensation can be received even without proving fault.""",
        "steps_hindi": [
            "108 पर एम्बुलेंस बुलाएं",
            "FIR दर्ज कराएं",
            "सभी मेडिकल बिल और रिपोर्ट संभालें",
            "गाड़ी की फोटो और गवाहों का विवरण लें",
            "Insurance Company को सूचित करें",
            "MACT (Motor Accident Claims Tribunal) में क्लेम करें"
        ],
        "steps_english": [
            "Call ambulance on 108",
            "File FIR",
            "Keep all medical bills and reports",
            "Take photos of vehicle and witness details",
            "Inform Insurance Company",
            "File claim at MACT (Motor Accident Claims Tribunal)"
        ],
        "emergency_contacts": [
            {"name": "Ambulance", "number": "108"},
            {"name": "Road Accident Helpline", "number": "1073"},
            {"name": "Traffic Police", "number": "103"}
        ],
        "legal_sections": ["Motor Vehicles Act 2019", "Section 166 - Third Party Claims"]
    },
    "domestic_violence": {
        "id": "domestic_violence",
        "category_id": "domestic_violence",
        "title_hindi": "घरेलू हिंसा से बचाव के अधिकार",
        "title_english": "Protection from Domestic Violence",
        "content_hindi": """घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम 2005 के तहत, शारीरिक, मानसिक, आर्थिक सभी प्रकार की हिंसा से सुरक्षा का अधिकार है।

Protection Order के तहत अत्याचारी को घर से दूर रहने का आदेश मिल सकता है।""",
        "content_english": """Under Protection of Women from Domestic Violence Act 2005, you have right to protection from physical, mental, and economic violence.

Under Protection Order, the abuser can be ordered to stay away from home.""",
        "steps_hindi": [
            "Women Helpline 181 पर कॉल करें",
            "नजदीकी पुलिस स्टेशन में शिकायत दर्ज करें",
            "Protection Officer से मिलें",
            "Magistrate Court में Protection Order के लिए आवेदन करें",
            "Medical और Legal Aid लें",
            "One Stop Centre जाएं"
        ],
        "steps_english": [
            "Call Women Helpline 181",
            "File complaint at nearest police station",
            "Meet Protection Officer",
            "Apply for Protection Order in Magistrate Court",
            "Get Medical and Legal Aid",
            "Visit One Stop Centre"
        ],
        "emergency_contacts": [
            {"name": "Women Helpline", "number": "181"},
            {"name": "NCW Helpline", "number": "7827-170-170"},
            {"name": "Police", "number": "100"}
        ],
        "legal_sections": ["DV Act 2005", "Section 498A IPC", "Section 304B IPC"]
    },
    "consumer": {
        "id": "consumer",
        "category_id": "consumer",
        "title_hindi": "उपभोक्ता के रूप में आपके अधिकार",
        "title_english": "Your Rights as a Consumer",
        "content_hindi": """Consumer Protection Act 2019 के तहत, खराब सामान या सेवा के खिलाफ शिकायत करने और मुआवज़ा पाने का अधिकार है।

2 करोड़ तक की शिकायत District Consumer Forum में, 2-10 करोड़ State Commission में।""",
        "content_english": """Under Consumer Protection Act 2019, you have right to complain against defective goods or services and get compensation.

Complaints up to 2 crore in District Consumer Forum, 2-10 crore in State Commission.""",
        "steps_hindi": [
            "खरीदी का बिल और वारंटी कार्ड संभालें",
            "पहले कंपनी को लिखित शिकायत करें",
            "Online: consumerhelpline.gov.in पर शिकायत करें",
            "District Consumer Forum में केस दर्ज करें",
            "₹5 लाख तक कोई फीस नहीं"
        ],
        "steps_english": [
            "Keep purchase bill and warranty card",
            "First write complaint to company",
            "Online: File complaint at consumerhelpline.gov.in",
            "File case in District Consumer Forum",
            "No fee for claims up to ₹5 lakh"
        ],
        "emergency_contacts": [
            {"name": "Consumer Helpline", "number": "1800-11-4000"},
            {"name": "NCH Online", "number": "1915"}
        ],
        "legal_sections": ["Consumer Protection Act 2019", "E-Commerce Rules 2020"]
    },
    "tenant": {
        "id": "tenant",
        "category_id": "tenant",
        "title_hindi": "किरायेदार के रूप में आपके अधिकार",
        "title_english": "Your Rights as a Tenant",
        "content_hindi": """Rent Control Act के तहत, मकान मालिक बिना वैध कारण के किरायेदार को नहीं निकाल सकता।

Security Deposit वापस पाने का अधिकार है। मकान खाली करने पर पूरा deposit मिलना चाहिए।""",
        "content_english": """Under Rent Control Act, landlord cannot evict tenant without valid reason.

You have right to get security deposit back. Full deposit should be returned when vacating.""",
        "steps_hindi": [
            "Rent Agreement की कॉपी रखें",
            "सभी किराया भुगतान की रसीद लें",
            "मकान की फोटो मूव-इन और मूव-आउट पर लें",
            "Deposit वापसी के लिए लिखित मांग करें",
            "Rent Authority में शिकायत करें"
        ],
        "steps_english": [
            "Keep copy of Rent Agreement",
            "Get receipts for all rent payments",
            "Take photos at move-in and move-out",
            "Make written demand for deposit return",
            "File complaint with Rent Authority"
        ],
        "emergency_contacts": [
            {"name": "Rent Authority Helpline", "number": "Check local"},
            {"name": "Legal Aid", "number": "15100"}
        ],
        "legal_sections": ["Rent Control Act (State specific)", "Model Tenancy Act 2021"]
    },
    "women": {
        "id": "women",
        "category_id": "women",
        "title_hindi": "महिलाओं के विशेष अधिकार",
        "title_english": "Special Rights for Women",
        "content_hindi": """Workplace Sexual Harassment Act (POSH) के तहत, हर कार्यस्थल पर Internal Complaints Committee होनी चाहिए।

Equal pay for equal work का अधिकार है। Maternity leave 26 सप्ताह का अधिकार है।""",
        "content_english": """Under POSH Act, every workplace must have an Internal Complaints Committee.

You have right to equal pay for equal work. Right to 26 weeks maternity leave.""",
        "steps_hindi": [
            "Workplace harassment पर ICC में शिकायत करें",
            "Police में शिकायत करने का अधिकार",
            "Free legal aid का अधिकार (NALSA)",
            "One Stop Centre में मदद लें",
            "NCW को online शिकायत करें"
        ],
        "steps_english": [
            "Complain to ICC for workplace harassment",
            "Right to file police complaint",
            "Right to free legal aid (NALSA)",
            "Get help at One Stop Centre",
            "File online complaint to NCW"
        ],
        "emergency_contacts": [
            {"name": "Women Helpline", "number": "181"},
            {"name": "NCW WhatsApp", "number": "7827-170-170"},
            {"name": "She-Box (Online)", "number": "shebox.nic.in"}
        ],
        "legal_sections": ["POSH Act 2013", "Maternity Benefit Act", "Equal Remuneration Act"]
    },
    "property": {
        "id": "property",
        "category_id": "property",
        "title_hindi": "संपत्ति विवाद में आपके अधिकार",
        "title_english": "Your Rights in Property Disputes",
        "content_hindi": """Hindu Succession Act के तहत, बेटियों को पिता की संपत्ति में बराबर हक है (2005 संशोधन)।

Property का Registration कराना अनिवार्य है। बिना रजिस्ट्री के sale deed valid नहीं है।""",
        "content_english": """Under Hindu Succession Act, daughters have equal right in father's property (2005 amendment).

Property registration is mandatory. Sale deed without registration is not valid.""",
        "steps_hindi": [
            "Property के सभी documents verify करें",
            "Encumbrance Certificate निकालें",
            "Revenue records (7/12 extract) जांचें",
            "Civil Court में suit file करें",
            "Legal notice भेजें",
            "Mediation का option आज़माएं"
        ],
        "steps_english": [
            "Verify all property documents",
            "Get Encumbrance Certificate",
            "Check Revenue records (7/12 extract)",
            "File suit in Civil Court",
            "Send legal notice",
            "Try mediation option"
        ],
        "emergency_contacts": [
            {"name": "Sub-Registrar Office", "number": "Check local"},
            {"name": "Legal Aid", "number": "15100"}
        ],
        "legal_sections": ["Hindu Succession Act 1956", "Transfer of Property Act", "Registration Act 1908"]
    }
}

# ============== System Prompts ==============

SYSTEM_PROMPT_HINDI = """तुम NyayMitra हो - भारत का AI कानूनी सहायक। तुम्हारा काम आम भारतीयों को उनके कानूनी अधिकारों के बारे में सरल हिंदी में समझाना है।

तुम्हारी विशेषताएं:
- भारतीय कानून का गहरा ज्ञान
- सरल और समझने योग्य भाषा में जवाब
- Empathetic और supportive approach
- Practical और actionable सलाह

महत्वपूर्ण नियम:
1. कभी भी final legal advice मत दो - हमेशा कहो कि गंभीर मामलों में वकील से मिलें
2. Emergency situations में तुरंत helpline numbers दो
3. जवाब संक्षिप्त और clear रखो
4. Legal sections और relevant laws का reference दो
5. हमेशा user की problem को validate करो - उन्हें feel होना चाहिए कि उनकी बात सुनी गई

Response format:
- पहले user की problem को acknowledge करो
- फिर relevant rights और laws बताओ
- Practical steps दो
- Helpline numbers दो अगर जरूरी हो
- End में disclaimer दो कि यह general information है"""

SYSTEM_PROMPT_ENGLISH = """You are NyayMitra - India's AI Legal Assistant. Your job is to help common Indians understand their legal rights in simple language.

Your characteristics:
- Deep knowledge of Indian law
- Responses in simple, understandable language
- Empathetic and supportive approach
- Practical and actionable advice

Important rules:
1. Never give final legal advice - always suggest consulting a lawyer for serious matters
2. Provide helpline numbers immediately for emergency situations
3. Keep responses brief and clear
4. Reference legal sections and relevant laws
5. Always validate user's problem - they should feel heard

Response format:
- First acknowledge the user's problem
- Then explain relevant rights and laws
- Provide practical steps
- Give helpline numbers if needed
- End with disclaimer that this is general information"""

# ============== API Endpoints ==============

@api_router.get("/")
async def root():
    return {"message": "NyayMitra API - Har Indian ka Pocket Lawyer"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "NyayMitra"}

# Chat Endpoints
@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    try:
        # Select system prompt based on language
        system_prompt = SYSTEM_PROMPT_HINDI if request.language == "hindi" else SYSTEM_PROMPT_ENGLISH
        
        # Get chat history for context
        history = await db.chats.find(
            {"session_id": request.session_id}
        ).sort("timestamp", 1).limit(10).to_list(10)
        
        # Initialize chat with Claude
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=request.session_id,
            system_message=system_prompt
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        # Build context from history
        context = ""
        if history:
            for msg in history[-6:]:  # Last 6 messages for context
                role = "User" if msg["role"] == "user" else "Assistant"
                context += f"{role}: {msg['content']}\n"
        
        # Create message with context
        full_message = f"{context}\nUser: {request.message}" if context else request.message
        
        user_message = UserMessage(text=full_message)
        
        # Get response
        response = await chat.send_message(user_message)
        
        # Save user message
        user_msg = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message,
            language=request.language
        )
        await db.chats.insert_one(user_msg.dict())
        
        # Save assistant message
        assistant_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=response,
            language=request.language
        )
        await db.chats.insert_one(assistant_msg.dict())
        
        return ChatResponse(
            response=response,
            session_id=request.session_id,
            message_id=assistant_msg.id
        )
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 50):
    try:
        history = await db.chats.find(
            {"session_id": session_id}
        ).sort("timestamp", 1).limit(limit).to_list(limit)
        
        return [
            {
                "id": msg["id"],
                "role": msg["role"],
                "content": msg["content"],
                "timestamp": msg["timestamp"].isoformat() if isinstance(msg["timestamp"], datetime) else msg["timestamp"]
            }
            for msg in history
        ]
    except Exception as e:
        logger.error(f"History error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/chat/history/{session_id}")
async def clear_chat_history(session_id: str):
    try:
        result = await db.chats.delete_many({"session_id": session_id})
        return {"deleted": result.deleted_count}
    except Exception as e:
        logger.error(f"Clear history error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Rights Endpoints
@api_router.get("/rights/categories", response_model=List[RightsCategory])
async def get_rights_categories():
    return [RightsCategory(**cat) for cat in RIGHTS_CATEGORIES]

@api_router.get("/rights/{category_id}")
async def get_rights_detail(category_id: str):
    if category_id not in RIGHTS_DETAILS:
        raise HTTPException(status_code=404, detail="Category not found")
    return RIGHTS_DETAILS[category_id]

@api_router.get("/rights")
async def get_all_rights():
    return {
        "categories": RIGHTS_CATEGORIES,
        "details": RIGHTS_DETAILS
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
