import { RightsCategory, RightsDetail } from './types';

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
    description_hindi: 'नौकरी, वेतन और काम की स्थिति से जुड़े अधिकार।',
    description_english: 'Rights related to job, salary and working conditions.',
    color: '#2563eb',
  },
  {
    id: 'police_arrest',
    name_hindi: 'पुलिस गिरफ्तारी',
    name_english: 'Police Arrest',
    icon: 'shield',
    description_hindi: 'गिरफ्तारी, पूछताछ और FIR में आपके अधिकार।',
    description_english: 'Your rights during arrest, interrogation and FIR.',
    color: '#dc2626',
  },
  {
    id: 'consumer_rights',
    name_hindi: 'उपभोक्ता अधिकार',
    name_english: 'Consumer Rights',
    icon: 'shopping-cart',
    description_hindi: 'खराब सामान, सेवाओं और रिफंड के अधिकार।',
    description_english: 'Rights for defective goods, services and refunds.',
    color: '#16a34a',
  },
  {
    id: 'women_rights',
    name_hindi: 'महिला अधिकार',
    name_english: 'Women Rights',
    icon: 'female',
    description_hindi: 'महिलाओं के सम्मान और सुरक्षा अधिकार।',
    description_english: 'Rights for women dignity and protection.',
    color: '#e91e63',
  },
  {
    id: 'child_rights',
    name_hindi: 'बाल अधिकार',
    name_english: 'Child Rights',
    icon: 'people',
    description_hindi: 'बच्चों की सुरक्षा और विकास अधिकार।',
    description_english: 'Rights for child protection and development.',
    color: '#f59e0b',
  },
  {
    id: 'rti_rights',
    name_hindi: 'RTI अधिकार',
    name_english: 'RTI Rights',
    icon: 'document-text',
    description_hindi: 'सरकारी जानकारी का अधिकार।',
    description_english: 'Right to government information.',
    color: '#8b5cf6',
  },
  {
    id: 'cyber_crime',
    name_hindi: 'साइबर अपराध',
    name_english: 'Cyber Crime',
    icon: 'laptop',
    description_hindi: 'ऑनलाइन धोखाधड़ी और सुरक्षा अधिकार।',
    description_english: 'Online fraud protection and rights.',
    color: '#6366f1',
  },
  {
    id: 'bail_rights',
    name_hindi: 'जमानत अधिकार',
    name_english: 'Bail Rights',
    icon: 'heart',
    description_hindi: 'जमानत और रिहाई के अधिकार।',
    description_english: 'Rights for bail and release.',
    color: '#10b981',
  },
  {
    id: 'property_rights',
    name_hindi: 'संपत्ति अधिकार',
    name_english: 'Property Rights',
    icon: 'document',
    description_hindi: 'जमीन और संपत्ति के अधिकार।',
    description_english: 'Rights for land and property.',
    color: '#f97316',
  },
  {
    id: 'education_rights',
    name_hindi: 'शिक्षा अधिकार',
    name_english: 'Education Rights',
    icon: 'person',
    description_hindi: 'शिक्षा और सीखने के अधिकार।',
    description_english: 'Rights for education and learning.',
    color: '#3b82f6',
  },
  {
    id: 'health_rights',
    name_hindi: 'स्वास्थ्य अधिकार',
    name_english: 'Health Rights',
    icon: 'accessibility',
    description_hindi: 'स्वास्थ्य सेवा और इलाज के अधिकार।',
    description_english: 'Rights for healthcare and treatment.',
    color: '#ef4444',
  },
  {
    id: 'traffic_rules',
    name_hindi: 'यातायात नियम',
    name_english: 'Traffic Rules',
    icon: 'car',
    description_hindi: 'सड़क पर यात्रियों के अधिकार।',
    description_english: 'Rights and duties on road.',
    color: '#64748b',
  },
  {
    id: 'domestic_violence',
    name_hindi: 'घरेलू हिंसा',
    name_english: 'Domestic Violence',
    icon: 'book',
    description_hindi: 'घरेलू हिंसा से सुरक्षा अधिकार।',
    description_english: 'Protection from domestic violence.',
    color: '#dc2626',
  },
  {
    id: 'marriage_rights',
    name_hindi: 'विवाह अधिकार',
    name_english: 'Marriage Rights',
    icon: 'medical',
    description_hindi: 'विवाह और रिश्ते के अधिकार।',
    description_english: 'Rights for marriage and divorce.',
    color: '#ec4899',
  },
  {
    id: 'divorce_rights',
    name_hindi: 'तलाक अधिकार',
    name_english: 'Divorce Rights',
    icon: 'restaurant',
    description_hindi: 'तलाक और अलग के अधिकार।',
    description_english: 'Rights for divorce and separation.',
    color: '#f59e0b',
  },
  {
    id: 'senior_citizen',
    name_hindi: 'वरिष्ठ नागरिक',
    name_english: 'Senior Citizen',
    icon: 'leaf',
    description_hindi: 'वरिष्ठ नागरिकों के अधिकार।',
    description_english: 'Rights for elderly citizens.',
    color: '#8b5cf6',
  },
  {
    id: 'disability_rights',
    name_hindi: 'दिव्यांग अधिकार',
    name_english: 'Disability Rights',
    icon: 'how-to-vote',
    description_hindi: 'दिव्यांग जनों के अधिकार।',
    description_english: 'Rights for disabled persons.',
    color: '#10b981',
  },
  {
    id: 'minimum_wage',
    name_hindi: 'न्यूनतम वेतन',
    name_english: 'Minimum Wage',
    icon: 'shield-checkmark',
    description_hindi: 'न्यूनतम वेतन के अधिकार।',
    description_english: 'Rights for minimum wages.',
    color: '#f97316',
  },
  {
    id: 'maternity_rights',
    name_hindi: 'मातृत्व अधिकार',
    name_english: 'Maternity Rights',
    icon: 'eye',
    description_hindi: 'गर्भावस्था और मातृत्व के अधिकार।',
    description_english: 'Rights for pregnancy and maternity.',
    color: '#ec4899',
  },
  {
    id: 'agriculture_rights',
    name_hindi: 'कृषि अधिकार',
    name_english: 'Agriculture Rights',
    icon: 'lock-closed',
    description_hindi: 'किसानों के अधिकार।',
    description_english: 'Rights for farmers.',
    color: '#16a34a',
  },
  {
    id: 'tribal_rights',
    name_hindi: 'आदिवासी अधिकार',
    name_english: 'Tribal Rights',
    icon: 'card',
    description_hindi: 'आदिवासियों के अधिकार।',
    description_english: 'Rights for tribal communities.',
    color: '#7c3aed',
  },
  {
    id: 'religious_rights',
    name_hindi: 'धार्मिक अधिकार',
    name_english: 'Religious Rights',
    icon: 'receipt',
    description_hindi: 'धर्म की आज़ादी का अधिकार।',
    description_english: 'Rights for religious freedom.',
    color: '#dc2626',
  },
  {
    id: 'media_rights',
    name_hindi: 'मीडिया अधिकार',
    name_english: 'Media Rights',
    icon: 'construct',
    description_hindi: 'प्रेस की आज़ादी का अधिकार।',
    description_english: 'Rights for press and media.',
    color: '#6366f1',
  },
  {
    id: 'nri_rights',
    name_hindi: 'NRI अधिकार',
    name_english: 'NRI Rights',
    icon: 'cash',
    description_hindi: 'एनआरआई भारतीयों के अधिकार।',
    description_english: 'Rights for NRIs.',
    color: '#3b82f6',
  },
  {
    id: 'student_rights',
    name_hindi: 'छात्र अधिकार',
    name_english: 'Student Rights',
    icon: 'woman',
    description_hindi: 'छात्रों के शैक्षिक अधिकार।',
    description_english: 'Rights for students.',
    color: '#8b5cf6',
  },
  {
    id: 'prisoner_rights',
    name_hindi: 'कैदी अधिकार',
    name_english: 'Prisoner Rights',
    icon: 'church',
    description_hindi: 'कैदियों के मानवी अधिकार।',
    description_english: 'Rights for prisoners.',
    color: '#ef4444',
  },
  {
    id: 'animal_rights',
    name_hindi: 'पशु अधिकार',
    name_english: 'Animal Rights',
    icon: 'newspaper',
    description_hindi: 'पशुओं के संरक्षण और अधिकार।',
    description_english: 'Rights for animal protection.',
    color: '#16a34a',
  },
  {
    id: 'internet_rights',
    name_hindi: 'इंटरनेट अधिकार',
    name_english: 'Internet Rights',
    icon: 'globe',
    description_hindi: 'इंटरनेट और डिजिटल अधिकार।',
    description_english: 'Rights for internet access.',
    color: '#6366f1',
  },
  {
    id: 'refugee_rights',
    name_hindi: 'शरणार्थी अधिकार',
    name_english: 'Refugee Rights',
    icon: 'home',
    description_hindi: 'शरणार्थियों के संरक्षण और मानवी अधिकार।',
    description_english: 'Protection and humanitarian rights for refugees.',
    color: '#7c3aed',
  },
  {
    id: 'voter_rights',
    name_hindi: 'मतदाता अधिकार',
    name_english: 'Voter Rights',
    icon: 'school',
    description_hindi: 'मतदान और लोकतंत्र के अधिकार।',
    description_english: 'Rights for voting and democracy.',
    color: '#10b981',
  },
  {
    id: 'witness_rights',
    name_hindi: 'गवाह अधिकार',
    name_english: 'Witness Rights',
    icon: 'paw',
    description_hindi: 'गवाहों के संरक्षण अधिकार।',
    description_english: 'Rights for witnesses protection.',
    color: '#f59e0b',
  },
  {
    id: 'privacy_rights',
    name_hindi: 'निजता अधिकार',
    name_english: 'Privacy Rights',
    icon: 'wifi',
    description_hindi: 'निजता और डेटा सुरक्षा अधिकार।',
    description_english: 'Rights for privacy and data protection.',
    color: '#6366f1',
  },
  {
    id: 'banking_rights',
    name_hindi: 'बैंकिंग अधिकार',
    name_english: 'Banking Rights',
    icon: 'globe',
    description_hindi: 'बैंक खाते और लेनदेन के अधिकार।',
    description_english: 'Rights for banking services.',
    color: '#16a34a',
  },
  {
    id: 'insurance_rights',
    name_hindi: 'बीमा अधिकार',
    name_english: 'Insurance Rights',
    icon: 'school',
    description_hindi: 'बीमा दावों और क्लेम के अधिकार।',
    description_english: 'Rights for insurance claims.',
    color: '#10b981',
  },
  {
    id: 'tax_rights',
    name_hindi: 'कर अधिकार',
    name_english: 'Tax Rights',
    icon: 'paw',
    description_hindi: 'कर चुकाई और रिफंड के अधिकार।',
    description_english: 'Rights for tax payment and refunds.',
    color: '#f97316',
  },
  {
    id: 'labor_rights',
    name_hindi: 'श्रम अधिकार',
    name_english: 'Labor Rights',
    icon: 'wifi',
    description_hindi: 'श्रमिकों के काम और सुरक्षा अधिकार।',
    description_english: 'Rights for labor and work.',
    color: '#ec4899',
  },
  {
    id: 'fir_rights',
    name_hindi: 'FIR अधिकार',
    name_english: 'FIR Rights',
    icon: 'globe',
    description_hindi: 'FIR दर्ज कराने के अधिकार।',
    description_english: 'Rights for FIR registration.',
    color: '#3b82f6',
  },
  {
    id: 'food_security',
    name_hindi: 'खाद्य सुरक्षा',
    name_english: 'Food Security',
    icon: 'school',
    description_hindi: 'खाद्य सुरक्षा और सस्ता अधिकार।',
    description_english: 'Rights for food security and ration.',
    color: '#16a34a',
  },
  {
    id: 'environment_rights',
    name_hindi: 'पर्यावरण अधिकार',
    name_english: 'Environment Rights',
    icon: 'paw',
    description_hindi: 'पर्यावरण संरक्षण के अधिकार।',
    description_english: 'Rights for environmental protection.',
    color: '#10b981',
  }
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
    key_rights_hindi: [
      'नौकरी से निकाले जाने से सुरक्षा',
      'न्यूनतम वेतन पाने का अधिकार',
      'ओवरटाइम के लिए अतिरिक भुगतान',
      'सुरक्षित कार्य वातावरण का अधिकार',
      'छुट्टी बंद और ग्रेच्युटी से सुरक्षा'
    ],
    key_rights_english: [
      'Protection from unjust termination',
      'Right to minimum wages',
      'Right to overtime payment',
      'Right to safe working environment',
      'Protection from layoffs and retrenchment'
    ],
    action_steps_hindi: [
      'अपॉइंटमेंट लेटर और सैलरी स्लिप रखें।',
      'काम के घंटे और ओवरटाइम रिकॉर्ड करें।',
      'वेतन से संबंधित समस्याओं के लिए श्रम आयुक्त से संपर्क करें।',
      'गंभीर विवादों के लिए लेबर कोर्ट जाएं।'
    ],
    action_steps_english: [
      'Keep appointment letter and salary slips.',
      'Record working hours and overtime.',
      'Contact Labor Commissioner for wage issues.',
      'Go to Labor Court for serious disputes.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'श्रम आयुक्त कार्यालय', number: '1800-11-2228' },
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
      { name: 'लीगल एड', number: '15100' }
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
    key_rights_hindi: [
      '30 दिन में रिफंड का अधिकार',
      'खराब सामान बदलने का अधिकार',
      'अधिक मूल्य वसूली से सुरक्षा',
      'उपभोक्ता फोरम में शिकायत का अधिकार',
      'उपभोक्ता आयोग में अपील का अधिकार'
    ],
    key_rights_english: [
      'Right to refund within 30 days',
      'Right to replacement of defective goods',
      'Protection from overcharging',
      'Right to complain in consumer forum',
      'Right to appeal in consumer commission'
    ],
    action_steps_hindi: [
      'खरीदारी रसीद और वारंटी रखें।',
      'विक्रेता को लिखित शिकायत दें।',
      'समाधान न मिले तो उपभोक्ता फोरम भरें।',
      'उपभोक्ता आयोग में शिकायत दर्ज कराएं।'
    ],
    action_steps_english: [
      'Keep purchase receipt and warranty.',
      'Give written complaint to seller.',
      'If not resolved, fill consumer forum form.',
      'File complaint in Consumer Commission.'
    ],
    steps_hindi: [],
    steps_english: [],
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
    key_rights_hindi: [
      'छेड़छाड़ से सुरक्षा का अधिकार',
      'घरेलू हिंसा से सुरक्षा का अधिकार',
      'कार्यस्थल पर समानता का अधिकार',
      'यौन उत्पीड़न से सुरक्षा का अधिकार',
      'महिला आयोग से सहायता का अधिकार'
    ],
    key_rights_english: [
      'Right to protection from harassment',
      'Right to protection from domestic violence',
      'Right to equality at workplace',
      'Right to protection from sexual assault',
      'Right to assistance from Women Commission'
    ],
    action_steps_hindi: [
      'किसी भी उत्पीड़न का विरोध करें और रिकॉर्ड करें।',
      'तुरंत परिवार या भरोसेमंद व्यक्ति को बताएं।',
      'पुलिस में FIR दर्ज कराएं।',
      'महिला आयोग या कोर्ट की मदद लें।'
    ],
    action_steps_english: [
      'Resist and record any harassment.',
      'Immediately inform family or trusted person.',
      'File FIR in police station.',
      'Seek help from Women Commission or court.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'महिला हेल्पलाइन', number: '181' },
      { name: 'राष्ट्रीय महिला आयोग', number: '7827170170' }
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
    key_rights_hindi: [
      'शिक्षा का मौलिक अधिकार',
      'बाल श्रम से मुक्ति का अधिकार',
      'यौन उत्पीड़न से सुरक्षा का अधिकार',
      'स्वास्थ्य और पोषण का अधिकार',
      'बाल न्यायायोग में सुरक्षा का अधिकार'
    ],
    key_rights_english: [
      'Right to education',
      'Right to protection from child labor',
      'Right to protection from sexual abuse',
      'Right to health and nutrition',
      'Right to protection in juvenile justice'
    ],
    action_steps_hindi: [
      'बच्चे की शिक्षा सुनिश्चित करें।',
      'बाल श्रम या उपेक्षा की शिकायत दर्ज करें।',
      'यौन उत्पीड़न की सूचना तुरंत दें।',
      'बाल कल्याण समिति या पुलिस से संपर्क करें।'
    ],
    action_steps_english: [
      'Ensure child education.',
      'Report child labor or neglect.',
      'Immediately report sexual abuse.',
      'Contact Child Welfare Committee or police.'
    ],
    steps_hindi: [],
    steps_english: [],
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
    key_rights_hindi: [
      'सरकारी जानकारी मांगने का अधिकार',
      '30 दिन में जानकारी पाने का अधिकार',
      'जानकारी अस्वीकरण का अधिकार',
      'प्रथम अपील का अधिकार',
      'सूचना आयोग में शिकायत का अधिकार'
    ],
    key_rights_english: [
      'Right to seek government information',
      'Right to receive information within 30 days',
      'Right to information inspection',
      'Right to first appeal',
      'Right to complain in Information Commission'
    ],
    action_steps_hindi: [
      'RTI फॉर्म भरें और शुल्क लगाएं।',
      'सही विभाग में आवेदन दें।',
      '30 दिन में जानकारी न मिले तो प्रथम अपील करें।',
      'सूचना आयोग में शिकायत दर्ज करें।'
    ],
    action_steps_english: [
      'Fill RTI form and pay fees.',
      'Submit application to correct department.',
      'If no info in 30 days, file first appeal.',
      'Complain in Information Commission.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'केंद्रीय सूचना आयोग', number: '011-24622461' },
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
    key_rights_hindi: [
      'ऑनलाइन धोखाधड़ी से सुरक्षा का अधिकार',
      'डेटा चोरी से सुरक्षा का अधिकार',
      'डिजिटल सबूत जमा करने का अधिकार',
      'गोपनीयता का अधिकार',
      'साइबर सेल में शिकायत का अधिकार'
    ],
    key_rights_english: [
      'Right to protection from online fraud',
      'Right to data protection',
      'Right to digital evidence preservation',
      'Right to privacy',
      'Right to complain in cyber cell'
    ],
    action_steps_hindi: [
      'संदिग्ध ईमेल/मैसेज को सेव करें।',
      'बैंक को तुरंत सूचना दें।',
      'साइबर सेल में शिकायत दर्ज करें।',
      'डिजिटल सबूत जमा करें और पुलिस में FIR करें।'
    ],
    action_steps_english: [
      'Save suspicious emails/messages.',
      'Immediately inform bank.',
      'File complaint in cyber cell.',
      'Collect digital evidence and file FIR.'
    ],
    steps_hindi: [],
    steps_english: [],
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
    key_rights_hindi: [
      'जमानत का मौलिक अधिकार',
      'गैर-गंभीर अपराधों पर जमानत',
      'सुरक्षात्मक जमानत का अधिकार',
      'जमानती राशि निर्धारण का अधिकार',
      'उच्च अदालत में जमानत याचिका का अधिकार'
    ],
    key_rights_english: [
      'Right to bail',
      'Right to bail for non-serious offenses',
      'Right to anticipatory bail',
      'Right to reasonable bail conditions',
      'Right to bail in higher courts'
    ],
    action_steps_hindi: [
      'जमानत आवेदन तैयार करें।',
      'जमानती राशि और जमानतदार तय करें।',
      'अदालत में जमानत याचिका दायर करें।',
      'गंभीर मामलों में उच्च अदालत जाएं।'
    ],
    action_steps_english: [
      'Prepare bail application.',
      'Arrange bail amount and surety.',
      'File bail application in court.',
      'Go to high court for serious matters.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'लीगल एड', number: '15100' },
      { name: 'पुलिस', number: '112' }
    ],
    legal_sections: [
      'CrPC 436 / BNSS 478 - Right to Bail',
      'CrPC 437 / BNSS 479 - Anticipatory Bail',
      'CrPC 439 / BNSS 483 - Special Bail Powers',
      'Constitution Article 21 - Right to Life and Liberty'
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
