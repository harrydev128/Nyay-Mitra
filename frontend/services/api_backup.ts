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
  key_rights_hindi?: string[];
  key_rights_english?: string[];
  action_steps_hindi?: string[];
  action_steps_english?: string[];
  steps_hindi: string[];
  steps_english: string[];
  emergency_contacts: { name: string; number: string }[];
  legal_sections: string[];
};

const STATIC_RIGHTS_CATEGORIES: RightsCategory[] = [
  {
    id: 'tenant_rights',
    name_hindi: 'किरायेदार अधिकार',
    name_english: 'Tenant Rights',
    icon: 'home',
    description_hindi: 'किराया, बिजली-पानी और मकान मालिक से जुड़े अधिकार।',
    description_english: 'Rights related to rent, utilities and landlord issues.',
    color: '#f97316',
  },
  {
    id: 'employee_rights',
    name_hindi: 'कर्मचारी अधिकार',
    name_english: 'Employee Rights',
    icon: 'briefcase',
    description_hindi: 'वेतन, छुट्टी और कार्यस्थल पर अधिकार।',
    description_english: 'Rights regarding salary, leave and workplace.',
    color: '#2563eb',
  },
  {
    id: 'police_arrest',
    name_hindi: 'पुलिस गिरफ्तारी',
    name_english: 'Police Arrest',
    icon: 'shield',
    description_hindi: 'गिरफ्तारी और पूछताछ में आपके अधिकार।',
    description_english: 'Your rights during arrest and interrogation.',
    color: '#dc2626',
  },
  {
    id: 'consumer_rights',
    name_hindi: 'उपभोक्ता अधिकार',
    name_english: 'Consumer Rights',
    icon: 'shopping-cart',
    description_hindi: 'खराब सामान, रिफंड और शिकायत अधिकार।',
    description_english: 'Rights for defective goods, refunds and complaints.',
    color: '#16a34a',
  },
  {
    id: 'women_rights',
    name_hindi: 'महिला अधिकार',
    name_english: 'Women Rights',
    icon: 'female',
    description_hindi: 'महिलाओं के विशेष कानूनी अधिकार।',
    description_english: 'Special legal rights for women.',
    color: '#9333ea',
  },
  {
    id: 'property_rights',
    name_hindi: 'संपत्ति अधिकार',
    name_english: 'Property Rights',
    icon: 'building',
    description_hindi: 'जमीन, मकान और संपत्ति विवाद अधिकार।',
    description_english: 'Rights for land, house and property disputes.',
    color: '#ea580c',
  },
  {
    id: 'child_rights',
    name_hindi: 'बाल अधिकार',
    name_english: 'Child Rights',
    icon: 'people',
    description_hindi: 'बच्चों के शिक्षा, सुरक्षा और संरक्षण अधिकार।',
    description_english: 'Rights for child education, safety and protection.',
    color: '#0891b2',
  },
  {
    id: 'rti_rights',
    name_hindi: 'RTI अधिकार',
    name_english: 'RTI Rights',
    icon: 'document-text',
    description_hindi: 'सूचना का अधिकार - सरकारी जानकारी पाने का अधिकार।',
    description_english: 'Right to Information - get government information.',
    color: '#4f46e5',
  },
  {
    id: 'traffic_rules',
    name_hindi: 'यातायात नियम',
    name_english: 'Traffic Rules',
    icon: 'car',
    description_hindi: 'ट्रैफिक उल्लंघन और चालान से जुड़े अधिकार।',
    description_english: 'Rights for traffic violations and challans.',
    color: '#e11d48',
  },
  {
    id: 'domestic_violence',
    name_hindi: 'घरेलू हिंसा',
    name_english: 'Domestic Violence',
    icon: 'home',
    description_hindi: 'घरेलू हिंसा से बचाव और कानूनी सहायता।',
    description_english: 'Protection from domestic violence and legal help.',
    color: '#be123c',
  },
  {
    id: 'cyber_crime',
    name_hindi: 'साइबर अपराध',
    name_english: 'Cyber Crime',
    icon: 'laptop',
    description_hindi: 'ऑनलाइन धोखाधड़ी और साइबर अपराध से बचाव।',
    description_english: 'Protection from online fraud and cyber crimes.',
    color: '#0d9488',
  },
  {
    id: 'marriage_rights',
    name_hindi: 'विवाह अधिकार',
    name_english: 'Marriage Rights',
    icon: 'heart',
    description_hindi: 'शादी और वैवाहिक संबंधों में अधिकार।',
    description_english: 'Rights in marriage and marital relationships.',
    color: '#c026d3',
  },
  {
    id: 'divorce_rights',
    name_hindi: 'तलाक अधिकार',
    name_english: 'Divorce Rights',
    icon: 'document',
    description_hindi: 'तलाक, अलगाव और बच्चों की कस्टडी अधिकार।',
    description_english: 'Rights for divorce, separation and child custody.',
    color: '#7c3aed',
  },
  {
    id: 'senior_citizen',
    name_hindi: 'वरिष्ठ नागरिक',
    name_english: 'Senior Citizen',
    icon: 'person',
    description_hindi: 'बुजुर्गों के कल्याण और संरक्षण अधिकार।',
    description_english: 'Welfare and protection rights for elderly.',
    color: '#b91c1c',
  },
  {
    id: 'disability_rights',
    name_hindi: 'दिव्यांग अधिकार',
    name_english: 'Disability Rights',
    icon: 'accessibility',
    description_hindi: 'दिव्यांगजनों के अधिकार और सुविधाएं।',
    description_english: 'Rights and facilities for disabled persons.',
    color: '#059669',
  },
  {
    id: 'education_rights',
    name_hindi: 'शिक्षा अधिकार',
    name_english: 'Education Rights',
    icon: 'book',
    description_hindi: 'शिक्षा का अधिकार और शैक्षणिक सुविधाएं।',
    description_english: 'Right to education and academic facilities.',
    color: '#2563eb',
  },
  {
    id: 'health_rights',
    name_hindi: 'स्वास्थ्य अधिकार',
    name_english: 'Health Rights',
    icon: 'medical',
    description_hindi: 'चिकित्सा उपचार और स्वास्थ्य सेवाएं।',
    description_english: 'Medical treatment and healthcare services.',
    color: '#dc2626',
  },
  {
    id: 'food_security',
    name_hindi: 'खाद्य सुरक्षा',
    name_english: 'Food Security',
    icon: 'restaurant',
    description_hindi: 'सस्ता अनाज और खाद्य सुरक्षा अधिकार।',
    description_english: 'Cheap grain and food security rights.',
    color: '#ea580c',
  },
  {
    id: 'environment_rights',
    name_hindi: 'पर्यावरण अधिकार',
    name_english: 'Environment Rights',
    icon: 'leaf',
    description_hindi: 'स्वच्छ वातावरण और प्रदूषण नियंत्रण अधिकार।',
    description_english: 'Clean environment and pollution control rights.',
    color: '#16a34a',
  },
  {
    id: 'voter_rights',
    name_hindi: 'मतदाता अधिकार',
    name_english: 'Voter Rights',
    icon: 'how-to-vote',
    description_hindi: 'मतदान, चुनाव और लोकतंत्र अधिकार।',
    description_english: 'Voting, elections and democracy rights.',
    color: '#9333ea',
  },
  {
    id: 'bail_rights',
    name_hindi: 'जमानत अधिकार',
    name_english: 'Bail Rights',
    icon: 'shield-checkmark',
    description_hindi: 'जमानत, सुरक्षात्मक जमानत और रिहाई अधिकार।',
    description_english: 'Bail, anticipatory bail and release rights.',
    color: '#0891b2',
  },
  {
    id: 'fir_rights',
    name_hindi: 'FIR अधिकार',
    name_english: 'FIR Rights',
    icon: 'document-text',
    description_hindi: 'FIR दर्ज कराने और शिकायत दर्ज कराने के अधिकार।',
    description_english: 'Rights to file FIR and register complaints.',
    color: '#4f46e5',
  },
  {
    id: 'witness_rights',
    name_hindi: 'गवाह अधिकार',
    name_english: 'Witness Rights',
    icon: 'eye',
    description_hindi: 'गवाह बनने और गवाह संरक्षण अधिकार।',
    description_english: 'Rights to be witness and witness protection.',
    color: '#e11d48',
  },
  {
    id: 'privacy_rights',
    name_hindi: 'निजता अधिकार',
    name_english: 'Privacy Rights',
    icon: 'lock-closed',
    description_hindi: 'निजता, डेटा सुरक्षा और निजी जानकारी अधिकार।',
    description_english: 'Privacy, data security and personal information rights.',
    color: '#be123c',
  },
  {
    id: 'banking_rights',
    name_hindi: 'बैंकिंग अधिकार',
    name_english: 'Banking Rights',
    icon: 'card',
    description_hindi: 'बैंक खाता, ऋण और बैंकिंग सेवाएं।',
    description_english: 'Bank account, loans and banking services.',
    color: '#0d9488',
  },
  {
    id: 'insurance_rights',
    name_hindi: 'बीमा अधिकार',
    name_english: 'Insurance Rights',
    icon: 'shield-checkmark',
    description_hindi: 'बीमा क्लेम, पॉलिसी और बीमा सेवाएं।',
    description_english: 'Insurance claims, policies and insurance services.',
    color: '#c026d3',
  },
  {
    id: 'tax_rights',
    name_hindi: 'कर अधिकार',
    name_english: 'Tax Rights',
    icon: 'receipt',
    description_hindi: 'आयकर, GST और कर निर्धारण अधिकार।',
    description_english: 'Income tax, GST and tax assessment rights.',
    color: '#7c3aed',
  },
  {
    id: 'labor_rights',
    name_hindi: 'श्रम अधिकार',
    name_english: 'Labor Rights',
    icon: 'construct',
    description_hindi: 'मजदूरी, कामकाजी समय और श्रम कानून।',
    description_english: 'Wages, working hours and labor laws.',
    color: '#b91c1c',
  },
  {
    id: 'minimum_wage',
    name_hindi: 'न्यूनतम वेतन',
    name_english: 'Minimum Wage',
    icon: 'cash',
    description_hindi: 'न्यूनतम वेतन और मजदूरी भुगतान अधिकार।',
    description_english: 'Minimum wage and salary payment rights.',
    color: '#059669',
  },
  {
    id: 'maternity_rights',
    name_hindi: 'मातृत्व अधिकार',
    name_english: 'Maternity Rights',
    icon: 'woman',
    description_hindi: 'गर्भावस्था, प्रसूति और मातृत्व अवकाश अधिकार।',
    description_english: 'Pregnancy, childbirth and maternity leave rights.',
    color: '#2563eb',
  },
  {
    id: 'agriculture_rights',
    name_hindi: 'कृषि अधिकार',
    name_english: 'Agriculture Rights',
    icon: 'leaf',
    description_hindi: 'किसान, फसल और कृषि भूमि अधिकार।',
    description_english: 'Farmer, crops and agricultural land rights.',
    color: '#16a34a',
  },
  {
    id: 'tribal_rights',
    name_hindi: 'आदिवासी अधिकार',
    name_english: 'Tribal Rights',
    icon: 'people',
    description_hindi: 'आदिवासी समुदायों के विशेष अधिकार।',
    description_english: 'Special rights for tribal communities.',
    color: '#ea580c',
  },
  {
    id: 'religious_rights',
    name_hindi: 'धार्मिक अधिकार',
    name_english: 'Religious Rights',
    icon: 'church',
    description_hindi: 'धर्म की स्वतंत्रता और धार्मिक अधिकार।',
    description_english: 'Freedom of religion and religious rights.',
    color: '#9333ea',
  },
  {
    id: 'media_rights',
    name_hindi: 'मीडिया अधिकार',
    name_english: 'Media Rights',
    icon: 'newspaper',
    description_hindi: 'पत्रकारिता, अभिव्यक्ति और मीडिया की आजादी।',
    description_english: 'Journalism, expression and media freedom.',
    color: '#0891b2',
  },
  {
    id: 'nri_rights',
    name_hindi: 'NRI अधिकार',
    name_english: 'NRI Rights',
    icon: 'globe',
    description_hindi: 'प्रवासी भारतीयों के विशेष अधिकार।',
    description_english: 'Special rights for non-resident Indians.',
    color: '#4f46e5',
  },
  {
    id: 'student_rights',
    name_hindi: 'छात्र अधिकार',
    name_english: 'Student Rights',
    icon: 'school',
    description_hindi: 'छात्रों के शैक्षणिक और व्यक्तिगत अधिकार।',
    description_english: 'Academic and personal rights for students.',
    color: '#e11d48',
  },
  {
    id: 'prisoner_rights',
    name_hindi: 'कैदी अधिकार',
    name_english: 'Prisoner Rights',
    icon: 'lock-closed',
    description_hindi: 'बंदियों के मानवाधिकार और जेल अधिकार।',
    description_english: 'Human rights and jail rights for prisoners.',
    color: '#be123c',
  },
  {
    id: 'animal_rights',
    name_hindi: 'पशु अधिकार',
    name_english: 'Animal Rights',
    icon: 'paw',
    description_hindi: 'पशुओं के संरक्षण और क्रूरता विरोध अधिकार।',
    description_english: 'Animal protection and anti-cruelty rights.',
    color: '#0d9488',
  },
  {
    id: 'internet_rights',
    name_hindi: 'इंटरनेट अधिकार',
    name_english: 'Internet Rights',
    icon: 'wifi',
    description_hindi: 'इंटरनेट पहुंच और डिजिटल अधिकार।',
    description_english: 'Internet access and digital rights.',
    color: '#c026d3',
  },
  {
    id: 'refugee_rights',
    name_hindi: 'शरणार्थी अधिकार',
    name_english: 'Refugee Rights',
    icon: 'home',
    description_hindi: 'शरणार्थियों के संरक्षण और मानवीय अधिकार।',
    description_english: 'Protection and humanitarian rights for refugees.',
    color: '#7c3aed',
  },
];

const STATIC_RIGHTS_DETAILS: Record<string, RightsDetail> = {
  tenant_rights: {
    id: 'tenant_rights_detail',
    category_id: 'tenant_rights',
    title_hindi: 'किरायेदार अधिकार - मकान मालिक से संरक्षण',
    title_english: 'Tenant Rights - Protection from Landlord',
    content_hindi: 'भारतीय कानून के तहत किरायेदारों को कई अधिकार प्राप्त हैं। मकान मालिक बिना 15 दिन की नोटिस दिए आपको नहीं निकाल सकता, बिजली-पानी काटना गैरकानूनी है, और अनुचित किराया वृद्धि पर रोक है।',
    content_english: 'Under Indian law, tenants have several rights. Landlord cannot evict without 15 days notice, cannot cut utilities, and excessive rent increases are regulated.',
    key_rights_hindi: [
      'बिना 15 दिन की नोटिस के बिना निकाले जाने का अधिकार',
      'बिजली-पानी की बुनियादी सेवाएं जारी रखने का अधिकार',
      'किराया वृद्धि पर नियंत्रण का अधिकार',
      'जमानत राशि की वापसी का अधिकार',
      'मकान मालिक की गैरकानूनी गतिविधियों से सुरक्षा'
    ],
    key_rights_english: [
      'Right to not be evicted without 15 days notice',
      'Right to essential utilities (water, electricity)',
      'Right to rent control and regulation',
      'Right to refund of security deposit',
      'Protection from illegal landlord practices'
    ],
    action_steps_hindi: [
      'रेंट एग्रीमेंट और सभी भुगतान रसीद सुरक्षित रखें।',
      'मकान मालिक की किसी भी मांग को लिखित में मांगें।',
      'अगर समस्या बनी तो रेंट कंट्रोल अथॉरिटी से संपर्क करें।',
      'गंभीर मामलों में सिविल कोर्ट में याचिका दायर करें।'
    ],
    action_steps_english: [
      'Keep rent agreement and all payment receipts safely.',
      'Ask for any landlord demand in writing.',
      'If problem persists, contact Rent Control Authority.',
      'For serious matters, file petition in civil court.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'रेंट कंट्रोल अथॉरिटी', number: '011-23378588' },
      { name: 'लीगल एड सेल', number: '1511' }
    ],
    legal_sections: [
      'Transfer of Property Act 1882 Section 108',
      'Rent Control Act',
      'Constitution Article 19(1)(g)',
      'Model Tenancy Act 2019'
    ]
  },
  employee_rights: {
    id: 'employee_rights_detail',
    category_id: 'employee_rights',
    title_hindi: 'कर्मचारी अधिकार - नौकरी से सुरक्षा',
    title_english: 'Employee Rights - Job Protection',
    content_hindi: 'भारतीय श्रम कानून कर्मचारियों को कई सुरक्षा प्रदान करता है। बिना कारण निकाले जाने पर रोक, न्यूनतम वेतन, ओवरटाइम भुगतान, और सुरक्षित कार्य वातावरण का अधिकार।',
    content_english: 'Indian labor laws provide multiple protections to employees. Protection from unjust termination, minimum wages, overtime payment, and right to safe working environment.',
    steps_hindi: [
      'अपॉइंटमेंट लेटर और सैलरी स्लिप रखें।',
      'काम के घंटे और ओवरटाइम रिकॉर्ड करें।',
      'वेतन से संबंधित समस्याओं के लिए श्रम आयुक्त से संपर्क करें।',
      'गंभीर विवादों के लिए लेबर कोर्ट जाएं।'
    ],
    steps_english: [
      'Keep appointment letter and salary slips.',
      'Record working hours and overtime.',
      'Contact Labor Commissioner for wage issues.',
      'Go to Labor Court for serious disputes.'
    ],
    emergency_contacts: [
      { name: 'श्रम आयुक्त कार्यालय', number: '011-23792146' },
      { name: 'सेंट्रल लेबर कोर्ट', number: '011-23387225' }
    ],
    legal_sections: [
      'Industrial Disputes Act 1947',
      'Factories Act 1948',
      'Payment of Wages Act 1936',
      'Minimum Wages Act 1948'
    ]
  },
  police_arrest: {
    id: 'police_arrest_detail',
    category_id: 'police_arrest',
    title_hindi: 'पुलिस गिरफ्तारी - आपके अधिकार',
    title_english: 'Police Arrest - Your Rights',
    content_hindi: 'गिरफ्तारी के समय आपके कई मौलिक अधिकार हैं। गिरफ्तारी का कारण जानने का अधिकार, परिवार/वकील को सूचना देने का अधिकार, और 24 घंटे में मजिस्ट्रेट के सामने पेश होने का अधिकार।',
    content_english: 'During arrest, you have several fundamental rights. Right to know reason for arrest, right to inform family/lawyer, and right to be produced before magistrate within 24 hours.',
    steps_hindi: [
      'गिरफ्तारी का कारण और पुलिस स्टेशन का नाम पूछें।',
      'परिवार या वकील को तुरंत सूचना दें।',
      'बिना वजह मारपीट या यातना सहन न करें।',
      'जमानत के लिए अदालत में याचिका दायर करें।'
    ],
    steps_english: [
      'Ask reason for arrest and police station name.',
      'Immediately inform family or lawyer.',
      'Do not tolerate beating or torture without reason.',
      'File bail application in court.'
    ],
    emergency_contacts: [
      { name: 'राष्ट्रीय आपातकालीन नंबर', number: '112' },
      { name: 'लीगल एड', number: '1511' }
    ],
    legal_sections: [
      'CrPC 41 / BNSS 35 - गिरफ्तारी का अधिकार',
      'CrPC 50 / BNSS 47 - गिरफ्तारी की सूचना',
      'CrPC 57 / BNSS 58 - मजिस्ट्रेट के सामने पेश',
      'Constitution Article 22 - गिरफ्तारी अधिकार'
    ]
  },
  consumer_rights: {
    id: 'consumer_rights_detail',
    category_id: 'consumer_rights',
    title_hindi: 'उपभोक्ता अधिकार - खराब सामान से बचाव',
    title_english: 'Consumer Rights - Protection from Defective Goods',
    content_hindi: 'उपभोक्ता संरक्षण अधिनियम 2019 के तहत आपको खराब सामान, सेवाओं में गड़बड़ी और अधिक मूल्य वसूली से सुरक्षा है। 30 दिन में रिफंड और बदली का अधिकार।',
    content_english: 'Under Consumer Protection Act 2019, you are protected from defective goods, service deficiencies, and overcharging. Right to refund and replacement within 30 days.',
    steps_hindi: [
      'खरीदारी रसीद और वारंटी रखें।',
      'विक्रेता को लिखित शिकायत दें।',
      'समाधान न मिले तो उपभोक्ता फोरम भरें।',
      'उपभोक्ता आयोग में शिकायत दर्ज कराएं।'
    ],
    steps_english: [
      'Keep purchase receipt and warranty.',
      'Give written complaint to seller.',
      'If not resolved, fill consumer forum form.',
      'File complaint in Consumer Commission.'
    ],
    emergency_contacts: [
      { name: 'उपभोक्ता हेल्पलाइन', number: '1800-11-4000' },
      { name: 'केंद्रीय उपभोक्ता संरक्षण', number: '1915' }
    ],
    legal_sections: [
      'Consumer Protection Act 2019',
      'Section 2 - Definition of Consumer',
      'Section 35 - Complaint Redressal',
      'Section 47 - Jurisdiction'
    ]
  },
  women_rights: {
    id: 'women_rights_detail',
    category_id: 'women_rights',
    title_hindi: 'महिला अधिकार - सम्मान और सुरक्षा',
    title_english: 'Women Rights - Dignity and Protection',
    content_hindi: 'महिलाओं के विशेष अधिकार कानून द्वारा सुरक्षित हैं। छेड़छाड़, घरेलू हिंसा, यौन उत्पीड़न और कार्यस्थल पर भेदभाव से सुरक्षा।',
    content_english: 'Special rights of women are protected by law. Protection from harassment, domestic violence, sexual assault, and workplace discrimination.',
    steps_hindi: [
      'किसी भी उत्पीड़न का विरोध करें और रिकॉर्ड करें।',
      'तुरंत परिवार या भरोसेमंद व्यक्ति को बताएं।',
      'पुलिस में FIR दर्ज कराएं।',
      'महिला आयोग या कोर्ट की मदद लें।'
    ],
    steps_english: [
      'Resist and record any harassment.',
      'Immediately inform family or trusted person.',
      'File FIR in police station.',
      'Seek help from Women Commission or court.'
    ],
    emergency_contacts: [
      { name: 'महिला हेल्पलाइन', number: '181' },
      { name: 'राष्ट्रीय महिला आयोग', number: '011-26942344' }
    ],
    legal_sections: [
      'IPC 354 / BNS 74 - छेड़छाड़',
      'IPC 498A / BNS 84 - घरेलू हिंसा',
      'Protection of Women from Domestic Violence Act 2005',
      'Sexual Harassment of Women at Workplace Act 2013'
    ]
  },
  child_rights: {
    id: 'child_rights_detail',
    category_id: 'child_rights',
    title_hindi: 'बाल अधिकार - संरक्षण और विकास',
    title_english: 'Child Rights - Protection and Development',
    content_hindi: 'बच्चों के अधिकार संविधान और विशेष कानूनों में सुरक्षित हैं। शिक्षा का अधिकार, बाल श्रम से मुक्ति, और यौन उत्पीड़न से सुरक्षा।',
    content_english: 'Children rights are protected in Constitution and special laws. Right to education, freedom from child labor, and protection from sexual abuse.',
    steps_hindi: [
      'बच्चे की शिक्षा सुनिश्चित करें।',
      'बाल श्रम या उपेक्षा की शिकायत दर्ज करें।',
      'यौन उत्पीड़न की सूचना तुरंत दें।',
      'बाल कल्याण समिति या पुलिस से संपर्क करें।'
    ],
    steps_english: [
      'Ensure child education.',
      'Report child labor or neglect.',
      'Immediately report sexual abuse.',
      'Contact Child Welfare Committee or police.'
    ],
    emergency_contacts: [
      { name: 'चाइल्ड हेल्पलाइन', number: '1098' },
      { name: 'बाल कल्याण समिति', number: '011-23690419' }
    ],
    legal_sections: [
      'POCSO Act 2012',
      'RTE Act 2009 - Right to Education',
      'Child Labour (Prohibition) Act 1986',
      'Juvenile Justice Act 2015'
    ]
  },
  rti_rights: {
    id: 'rti_rights_detail',
    category_id: 'rti_rights',
    title_hindi: 'RTI अधिकार - सूचना का अधिकार',
    title_english: 'RTI Rights - Right to Information',
    content_hindi: 'सूचना का अधिकार अधिनियम 2005 के तहत आप सरकारी जानकारी मांग सकते हैं। 30 दिन में जानकारी देना अनिवार्य है।',
    content_english: 'Under Right to Information Act 2005, you can seek government information. Providing information within 30 days is mandatory.',
    steps_hindi: [
      'RTI फॉर्म भरें और शुल्क लगाएं।',
      'सही विभाग में आवेदन दें।',
      '30 दिन में जानकारी न मिले तो प्रथम अपील करें।',
      'सूचना आयोग में शिकायत दर्ज करें।'
    ],
    steps_english: [
      'Fill RTI form and pay fees.',
      'Submit application to correct department.',
      'If no info in 30 days, file first appeal.',
      'Complain in Information Commission.'
    ],
    emergency_contacts: [
      { name: 'केंद्रीय सूचना आयोग', number: '011-26172839' },
      { name: 'राज्य सूचना आयोग', number: '011-23379279' }
    ],
    legal_sections: [
      'RTI Act 2005 Section 6 - Request for Information',
      'RTI Act 2005 Section 7 - Disposal of Request',
      'RTI Act 2005 Section 8 - Exemptions'
    ]
  },
  cyber_crime: {
    id: 'cyber_crime_detail',
    category_id: 'cyber_crime',
    title_hindi: 'साइबर अपराध - ऑनलाइन सुरक्षा',
    title_english: 'Cyber Crime - Online Protection',
    content_hindi: 'सूचना प्रौद्योगिकी अधिनियम 2000 के तहत साइबर अपराधों से सुरक्षा है। ऑनलाइन धोखाधड़ी, हैकिंग, और डेटा चोरी गैरकानूनी है।',
    content_english: 'Protection from cyber crimes under IT Act 2000. Online fraud, hacking, and data theft are illegal.',
    steps_hindi: [
      'संदिग्ध ईमेल/मैसेज को सेव करें।',
      'बैंक को तुरंत सूचना दें।',
      'साइबर सेल में शिकायत दर्ज करें।',
      'डिजिटल सबूत जमा करें और पुलिस में FIR करें।'
    ],
    steps_english: [
      'Save suspicious emails/messages.',
      'Immediately inform bank.',
      'File complaint in cyber cell.',
      'Collect digital evidence and file FIR.'
    ],
    emergency_contacts: [
      { name: 'साइबर क्राइम हेल्पलाइन', number: '1930' },
      { name: 'साइबर सेल', number: '011-24361439' }
    ],
    legal_sections: [
      'IT Act 2000 Section 66 - Computer Related Offences',
      'IT Act 2000 Section 66C - Punishment for Identity Theft',
      'IT Act 2000 Section 66D - Punishment for Cheating',
      'IT Act 2000 Section 67 - Publishing Obscene Material'
    ]
  },
  bail_rights: {
    id: 'bail_rights_detail',
    category_id: 'bail_rights',
    title_hindi: 'जमानत अधिकार - रिहाई का अधिकार',
    title_english: 'Bail Rights - Right to Release',
    content_hindi: 'भारतीय कानून में जमानत का अधिकार मौलिक है। गैर-गंभीर अपराधों पर जमानत मिल सकती है, सुरक्षात्मक जमानत भी अधिकार है।',
    content_english: 'Right to bail is fundamental in Indian law. Bail available for non-serious offenses, anticipatory bail is also a right.',
    steps_hindi: [
      'जमानत आवेदन तैयार करें।',
      'जमानती राशि और जमानतदार तय करें।',
      'अदालत में जमानत याचिका दायर करें।',
      'गंभीर मामलों में उच्च अदालत जाएं।'
    ],
    steps_english: [
      'Prepare bail application.',
      'Arrange bail amount and surety.',
      'File bail application in court.',
      'Go to high court for serious matters.'
    ],
    emergency_contacts: [
      { name: 'लीगल एड', number: '1511' },
      { name: 'कोर्ट हेल्पलाइन', number: '011-23387225' }
    ],
    legal_sections: [
      'CrPC 436 / BNSS 478 - Right to Bail',
      'CrPC 437 / BNSS 479 - Anticipatory Bail',
      'CrPC 439 / BNSS 483 - Special Bail Powers',
      'Constitution Article 21 - Right to Life and Liberty'
    ]
  },
  police_arrest: {
    id: 'police_arrest_detail',
    category_id: 'police_arrest',
    title_hindi: 'पुलिस गिरफ्तारी - आपके अधिकार',
    title_english: 'Police Arrest - Your Rights',
    content_hindi: 'गिरफ्तारी के समय आपके कई मौलिक अधिकार हैं। गिरफ्तारी का कारण जानने का अधिकार, परिवार/वकील को सूचना देने का अधिकार, और 24 घंटे में मजिस्ट्रेट के सामने पेश होने का अधिकार।',
    content_english: 'During arrest, you have several fundamental rights. Right to know reason for arrest, right to inform family/lawyer, and right to be produced before magistrate within 24 hours.',
    key_rights_hindi: [
      'चुप रहने का अधिकार',
      'वकील का अधिकार',
      'परिवार को सूचित करने का अधिकार',
      '24 घंटे में मजिस्ट्रेट के सामने पेश होने का अधिकार',
      'महिला की गिरफ्तारी सूर्यास्त के बाद नहीं होने का अधिकार'
    ],
    key_rights_english: [
      'Right to remain silent',
      'Right to legal counsel',
      'Right to inform family',
      'Right to be produced before magistrate within 24 hours',
      'Right to not be arrested after sunset for women'
    ],
    action_steps_hindi: [
      'शांत रहें, नाम-पता बताएं',
      'वकील मांगें',
      'गिरफ्तारी का कारण पूछें',
      'महिला या दोस्त को तुरंत सूचित करें'
    ],
    action_steps_english: [
      'Stay silent, provide name-address',
      'Ask for lawyer',
      'Ask reason for arrest',
      'Immediately inform woman or friend'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'राष्ट्रीय आपातकालीन नंबर', number: '112' },
      { name: 'लीगल एड', number: '1511' }
    ],
    legal_sections: [
      'CrPC 41 / BNSS 35 - गिरफ्तारी का अधिकार',
      'CrPC 50 / BNSS 47 - गिरफ्तारी की सूचना',
      'CrPC 57 / BNSS 58 - मजिस्ट्रेट के सामने पेश',
      'Constitution Article 22 - गिरफ्तारी अधिकार'
    ]
  }
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

