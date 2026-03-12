// Chat API (frontend -> local backend)
export const chatAPI = {
  sendMessage: async (_sessionId: string, message: string, _language: string = 'hindi') => {
    const response = await fetch('http://localhost:8001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });
    const data = await response.json();
    return { message_id: data.message_id, response: data.response };
  },
};

// Rights API (frontend-only, static data – no backend)
type RightsCategory = {
  id: string;
  name_hindi: string;
  name_english: string;
  icon: string;
  description_hindi: string;
  description_english: string;
  color: string;
};

type RightsDetail = {
  id: string;
  category_id: string;
  title_hindi: string;
  title_english: string;
  content_hindi: string;
  content_english: string;
  steps_hindi: string[];
  steps_english: string[];
  emergency_contacts: { name: string; number: string }[];
  legal_sections: string[];
};

const STATIC_RIGHTS_CATEGORIES: RightsCategory[] = [
  {
    id: 'job_rights',
    name_hindi: 'नौकरी से जुड़े अधिकार',
    name_english: 'Job Related Rights',
    icon: 'briefcase',
    description_hindi: 'नौकरी, वेतन और निकाले जाने से जुड़े आपके अधिकार।',
    description_english: 'Your rights about job, salary and termination.',
    color: '#f97316',
  },
  {
    id: 'police_rights',
    name_hindi: 'पुलिस कार्रवाई में अधिकार',
    name_english: 'Rights with Police',
    icon: 'shield',
    description_hindi: 'गिरफ्तारी, पूछताछ और FIR में आपके अधिकार।',
    description_english: 'Your rights during arrest, interrogation and FIR.',
    color: '#2563eb',
  },
];

const STATIC_RIGHTS_DETAILS: Record<string, RightsDetail> = {
  job_rights: {
    id: 'job_rights_detail',
    category_id: 'job_rights',
    title_hindi: 'नौकरी से निकाले जाने पर आपके अधिकार',
    title_english: 'Your Rights When Fired from Job',
    content_hindi:
      'भारतीय श्रम क़ानून के तहत बिना उचित कारण और प्रक्रिया के आपको नौकरी से नहीं निकाला जा सकता। आपके पास नोटिस, बकाया वेतन और कानूनी अपील का अधिकार होता है।',
    content_english:
      'Under Indian labour laws, you cannot be terminated without proper reason and procedure. You may have rights to notice, pending wages and legal appeal.',
    steps_hindi: [
      'अपना अपॉइंटमेंट लेटर, सैलरी स्लिप और अन्य दस्तावेज़ सुरक्षित रखें।',
      'HR या मैनेजमेंट से लिखित में कारण और नोटिस मांगें।',
      'अगर न्याय न मिले तो श्रम विभाग या वकील से संपर्क करें।',
    ],
    steps_english: [
      'Keep your appointment letter, salary slips and other documents safely.',
      'Ask HR/management in writing for reason and notice.',
      'If no fair resolution, approach labour department or a lawyer.',
    ],
    emergency_contacts: [
      { name: 'राष्ट्रीय कानूनी सेवा प्राधिकरण (NALSA)', number: '15100' },
    ],
    legal_sections: ['Industrial Disputes Act, 1947', 'Shops and Establishments Acts (state-wise)'],
  },
  police_rights: {
    id: 'police_rights_detail',
    category_id: 'police_rights',
    title_hindi: 'पुलिस द्वारा पकड़े जाने पर आपके अधिकार',
    title_english: 'Your Rights When Detained by Police',
    content_hindi:
      'गिरफ्तारी के समय आपको कारण बताने, परिवार/वकील को सूचना देने और 24 घंटे में मजिस्ट्रेट के सामने पेश किए जाने का अधिकार है।',
    content_english:
      'When arrested, you have the right to know the reason, inform family/lawyer and be produced before a magistrate within 24 hours.',
    steps_hindi: [
      'गिरफ्तारी का कारण और पुलिस स्टेशन का नाम जानें।',
      'परिवार या भरोसेमंद व्यक्ति को तुरंत सूचना दें।',
      'कानूनी सहायता के लिए वकील या लीगल एड से संपर्क करें।',
    ],
    steps_english: [
      'Ask the reason for arrest and name of police station.',
      'Inform family or trusted person immediately.',
      'Contact a lawyer or legal aid for assistance.',
    ],
    emergency_contacts: [
      { name: 'राष्ट्रीय आपातकालीन नंबर', number: '112' },
      { name: 'कानूनी मदद हेल्पलाइन (उदाहरण)', number: '15100' },
    ],
    legal_sections: ['Article 22, Constitution of India', 'Section 50, 57 CrPC'],
  },
};

export const rightsAPI = {
  getCategories: async (): Promise<RightsCategory[]> => {
    return STATIC_RIGHTS_CATEGORIES;
  },

  getDetail: async (categoryId: string): Promise<RightsDetail | null> => {
    return STATIC_RIGHTS_DETAILS[categoryId] || null;
  },

  getAll: async (): Promise<RightsDetail[]> => {
    return Object.values(STATIC_RIGHTS_DETAILS);
  },
};

