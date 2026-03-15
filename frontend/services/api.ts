import { Config } from '../constants/Config';

export const sanitizeInput = (text: string) => {
  return text
    .replace(/<script>/gi, '')
    .replace(/<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

interface RightsCategory {
  id: string;
  name_hindi: string;
  name_english: string;
  icon: string;
  description_hindi: string;
  description_english: string;
  color: string;
}

interface EmergencyContact {
  name: string;
  number: string;
}

interface RightsDetail {
  id: string;
  category_id: string;
  title_hindi: string;
  title_english: string;
  content_hindi: string;
  content_english: string;
  key_rights_hindi: string[];
  key_rights_english: string[];
  action_steps_hindi: string[];
  action_steps_english: string[];
  steps_hindi: string[];
  steps_english: string[];
  emergency_contacts: EmergencyContact[];
  legal_sections: string[];
}

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
    title_hindi: 'किरायेदार अधिकार - मकान मालिक से सुरक्षा',
    title_english: 'Tenant Rights - Protection from Landlord',
    content_hindi: 'भारतीय कानून (Model Tenancy Act) के तहत किरायेदारों को व्यापक सुरक्षा प्रदान की गई है। मकान मालिक बिना उचित कानूनी नोटिस के आपको घर से नहीं निकाल सकता। बिजली और पानी जैसी आवश्यक सेवाओं को काटना अपराध है। यदि मकान मालिक बिना कारण किराया बढ़ाता है, तो आप रेंट अथॉरिटी में शिकायत कर सकते हैं।',
    content_english: 'Under Indian law (Model Tenancy Act), tenants are provided with broad protection. A landlord cannot evict you without proper legal notice. Cutting off essential services like electricity and water is a crime. If the landlord increases the rent without reason, you can complain to the Rent Authority.',
    key_rights_hindi: [
      'बिना 15-30 दिन के लिखित नोटिस के बेदखली के विरुद्ध अधिकार',
      'बिजली, पानी और सफाई जैसी आवश्यक सेवाओं का अधिकार',
      'रेंट एग्रीमेंट में तय सीमा से अधिक किराया वृद्धि पर रोक',
      'जमानत राशि (Security Deposit) की समय पर वापसी का अधिकार',
      'मकान मालिक द्वारा अकारण घर में प्रवेश करने पर रोक'
    ],
    key_rights_english: [
      'Right against eviction without 15-30 days written notice',
      'Right to essential services like electricity, water, and sanitation',
      'Restriction on rent increases beyond the limit set in the rent agreement',
      'Right to timely refund of security deposit',
      'Right against landlord entering the house without reason'
    ],
    action_steps_hindi: [
      'हमेशा एक लिखित रेंट एग्रीमेंट (Rent Agreement) बनवाएं और उसकी कॉपी रखें।',
      'किराये के भुगतान की रसीद (Payment Receipt) मांगें।',
      'अवधि समाप्त होने पर सिक्योरिटी मनी की वापसी की लिखित मांग करें।',
      'विवाद की स्थिति में स्थानीय रेंट कंट्रोलर (Rent Controller) से संपर्क करें।'
    ],
    action_steps_english: [
      'Always get a written Rent Agreement and keep a copy.',
      'Ask for a rent payment receipt.',
      'Make a written demand for the refund of security money upon expiry.',
      'In case of a dispute, contact the local Rent Controller.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'पुलिस हेल्पलाइन', number: '112' },
      { name: 'लीगल एड सेल', number: '1511' }
    ],
    legal_sections: [
      'Transfer of Property Act 1882 Section 108',
      'Model Tenancy Act 2021',
      'Article 21 - Right to Shelter'
    ]
  },
  employee_rights: {
    id: 'employee_rights_detail',
    category_id: 'employee_rights',
    title_hindi: 'कर्मचारी अधिकार - श्रम कानूनों के तहत सुरक्षा',
    title_english: 'Employee Rights - Protection under Labor Laws',
    content_hindi: 'औद्योगिक विवाद अधिनियम और भारतीय श्रम कानूनों के तहत हर कर्मचारी को सम्मानजनक कार्य वातावरण और समय पर वेतन का अधिकार है। बिना किसी ठोस कारण के नौकरी से निकालना या वेतन रोकना कानूनी अपराध है। आप कार्यस्थल पर होने वाले शोषण के विरुद्ध लेबर कोर्ट जा सकते हैं।',
    content_english: 'Under the Industrial Disputes Act and Indian labor laws, every employee has the right to a dignified working environment and timely wages. Termination without a solid reason or withholding wages is a legal offense. You can go to the labor court against exploitation at the workplace.',
    key_rights_hindi: [
      'काम के घंटों का निर्धारण और ओवरटाइम भुगतान का अधिकार',
      'न्यूनतम वेतन अधिनियम के तहत तय वेतन पाने का अधिकार',
      'बिना नोटिस या अकारण छंटनी के विरुद्ध सुरक्षा',
      'कार्यस्थल पर सुरक्षा और स्वास्थ्य मानकों का पालन',
      'ग्रेच्युटी, पीएफ (PF) और अन्य बोनस का अधिकार'
    ],
    key_rights_english: [
      'Right to fixed working hours and overtime payment',
      'Right to receive prescribed wages under the Minimum Wages Act',
      'Protection against layoff or retrenchment without notice or reason',
      'Adherence to safety and health standards at the workplace',
      'Right to gratuity, PF, and other bonuses'
    ],
    action_steps_hindi: [
      'जॉइनिंग के समय नियुक्ति पत्र (Appointment Letter) जरूर लें।',
      'सैलरी स्लिप और उपस्थिति रजिस्टर का रिकॉर्ड रखें।',
      'शोषण होने पर लेबर कमिश्नर (Labour Commissioner) को शिकायत दें।',
      'महिला कर्मचारी कार्यस्थल पर यौन उत्पीड़न की शिकायत ICC समिति को दें।'
    ],
    action_steps_english: [
      'Always get an Appointment Letter at the time of joining.',
      'Keep records of salary slips and attendance registers.',
      'In case of exploitation, complain to the Labour Commissioner.',
      'Female employees should report workplace sexual harassment to the ICC committee.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'श्रम हेल्पलाइन', number: '155214' },
      { name: 'महिला आयोग', number: '1091' }
    ],
    legal_sections: [
      'Industrial Disputes Act 1947',
      'Minimum Wages Act 1948',
      'Factories Act 1948',
      'POSH Act 2013'
    ]
  },
  police_arrest: {
    id: 'police_arrest_detail',
    category_id: 'police_arrest',
    title_hindi: 'गिरफ्तारी के समय आपके कानूनी अधिकार',
    title_english: 'Your Legal Rights During Arrest',
    content_hindi: 'भारतीय संविधान का अनुच्छेद 22 और CrPC/BNSS आपको गिरफ्तारी के समय महत्वपूर्ण अधिकार प्रदान करते हैं। पुलिस आपको बिना कारण बताए गिरफ्तार नहीं कर सकती। गिरफ्तारी के 24 घंटे के भीतर आपको मजिस्ट्रेट के सामने पेश करना अनिवार्य है। अपमानजनक व्यवहार के विरुद्ध आपको सुरक्षा प्राप्त है।',
    content_english: 'Article 22 of the Indian Constitution and CrPC/BNSS provide you with important rights during arrest. The police cannot arrest you without giving a reason. It is mandatory to produce you before a magistrate within 24 hours of arrest. You are protected against degrading treatment.',
    key_rights_hindi: [
      'गिरफ्तारी का आधार और वारंट देखने का अधिकार',
      'अपने वकील या परिजन को तुरंत सूचित करने का अधिकार',
      'पूछताछ के दौरान चुप रहने का मौलिक अधिकार',
      'गिरफ्तारी के बाद मेडिकल जांच कराने का अधिकार',
      'महिलाओं को सूर्यास्त के बाद और सूर्योदय से पहले गिरफ्तार न करने का अधिकार'
    ],
    key_rights_english: [
      'Right to see the grounds for arrest and the warrant',
      'Right to immediately inform your lawyer or relatives',
      'Fundamental right to remain silent during interrogation',
      'Right to have a medical examination after arrest',
      'Right of women not to be arrested after sunset and before sunrise'
    ],
    action_steps_hindi: [
      'गिरफ्तारी मेमो (Arrest Memo) पर हस्ताक्षर करने से पहले उसे ध्यान से पढ़ें।',
      'पुलिस द्वारा दुर्व्यवहार किए जाने पर कोर्ट में मजिस्ट्रेट को बताएं।',
      'कानूनी सहायता के लिए तुरंत सरकारी लीगल एड (Legal Aid) मांगें।',
      'किसी भी खाली कागज पर हस्ताक्षर न करें।'
    ],
    action_steps_english: [
      'Read the Arrest Memo carefully before signing it.',
      'Inform the magistrate in court if abused by the police.',
      'Immediately ask for government Legal Aid for legal assistance.',
      'Do not sign any blank paper.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'आपातकालीन नंबर', number: '112' },
      { name: 'लीगल एड हेल्पलाइन', number: '15100' }
    ],
    legal_sections: [
      'Constitution Article 22',
      'BNSS Section 35-60',
      'D.K. Basu vs State of WB Guidelines'
    ]
  },
  consumer_rights: {
    id: 'consumer_rights_detail',
    category_id: 'consumer_rights',
    title_hindi: 'उपभोक्ता अधिकार - धोखाधड़ी से बचाव',
    title_english: 'Consumer Rights - Protection from Fraud',
    content_hindi: 'उपभोक्ता संरक्षण अधिनियम 2019 के अंतर्गत ग्राहकों को विशेष अधिकार दिए गए हैं। यदि आपको खराब सामान बेचा गया है या सेवाओं में कमी है, तो आप विक्रेता या कंपनी के विरुद्ध ' +
      'शिकायत कर सकते हैं। ऑनलाइन खरीदारी पर भी ये नियम समान रूप से लागू होते हैं। आप जिला उपभोक्ता फोरम में बिना वकील के भी शिकायत दर्ज करा सकते हैं।',
    content_english: 'Under the Consumer Protection Act 2019, special rights are given to customers. If you have been sold defective goods or there is a deficiency in services, you can complain against the seller or the company. These rules apply equally to online purchases. You can file a complaint in the District Consumer Forum even without a lawyer.',
    key_rights_hindi: [
      'सुरक्षित और मानक उत्पादों के उपयोग का अधिकार',
      'वस्तु की गुणवत्ता और कीमत के बारे में जानकारी पाने का अधिकार',
      'धोखाधड़ी वाली व्यापारिक गतिविधियों के विरुद्ध शिकायत का अधिकार',
      'क्षतिपूर्ति (Compensation) और रिफंड पाने का अधिकार',
      'उपभोक्ता शिक्षा और जागरूकता का अधिकार'
    ],
    key_rights_english: [
      'Right to use safe and standard products',
      'Right to get information about the quality and price of the product',
      'Right to complain against fraudulent trade practices',
      'Right to receive compensation and refund',
      'Right to consumer education and awareness'
    ],
    action_steps_hindi: [
      'सामान खरीदते समय पक्का बिल (Invoice) जरूर लें।',
      'शिकायत के लिए कस्टमर केयर (Customer Care) नंबर पर कॉल करें।',
      'समाधान न होने पर "ई-दाखिल" (E-Daakhil) पोर्टल पर शिकायत करें।',
      'भ्रामक विज्ञापनों के विरुद्ध शिकायत दर्ज कराएं।'
    ],
    action_steps_english: [
      'Always get a proper Invoice while purchasing goods.',
      'Call the Customer Care number for complaints.',
      'If not resolved, file a complaint on the "E-Daakhil" portal.',
      'File a complaint against misleading advertisements.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'राष्ट्रीय उपभोक्ता हेल्पलाइन', number: '1915' },
      { name: 'उपभोक्ता फोरम हेल्पलाइन', number: '1800114000' }
    ],
    legal_sections: [
      'Consumer Protection Act 2019',
      'Section 2(9) - Rights of Consumer'
    ]
  },
  women_rights: {
    id: 'women_rights_detail',
    category_id: 'women_rights',
    title_hindi: 'महिला अधिकार - सुरक्षा और समानता',
    title_english: 'Women Rights - Security and Equality',
    content_hindi: 'भारतीय कानून महिलाओं को घरेलू हिंसा, कार्यस्थल पर उत्पीड़न और सामाजिक भेदभाव के विरुद्ध कड़ी सुरक्षा प्रदान करता है। आपको पैतृक संपत्ति में समान अधिकार प्राप्त है। ' +
      'घरेलू हिंसा की स्थिति में आप मजिस्ट्रेट से सुरक्षा आदेश प्राप्त कर सकती हैं। कार्यस्थल पर सम्मानजनक वातावरण आपका अधिकार है।',
    content_english: 'Indian law provides strong protection to women against domestic violence, workplace harassment, and social discrimination. You have equal rights in ancestral property. In case of domestic violence, you can obtain a protection order from a magistrate. A dignified atmosphere at the workplace is your right.',
    key_rights_hindi: [
      'घरेलू हिंसा के विरुद्ध संरक्षण और फ्री कानूनी सहायता',
      'पैतृक संपत्ति में भाइयों के बराबर हिस्सा पाने का अधिकार',
      'कार्यस्थल पर यौन उत्पीड़न के विरुद्ध सुरक्षा (POSH Act)',
      'नाम गोपनीय रखने का अधिकार (यौन अपराध के मामलों में)',
      'जीरो एफआईआर (Zero FIR) दर्ज कराने का अधिकार'
    ],
    key_rights_english: [
      'Protection against domestic violence and free legal aid',
      'Right to receive an equal share in ancestral property as brothers',
      'Protection against sexual harassment at the workplace (POSH Act)',
      'Right to maintain anonymity (in cases of sexual offenses)',
      'Right to file a Zero FIR'
    ],
    action_steps_hindi: [
      'घरेलू हिंसा होने पर नजदीकी "वन स्टॉप सेंटर" या कोर्ट जाएं।',
      'उत्पीड़न की स्थिति में महिला हेल्पलाइन 1091 पर कॉल करें।',
      'संपत्ति विवाद के लिए सिविल सूट दाखिल करें।',
      'कार्यस्थल पर शिकायत के लिए आंतरिक शिकायत समिति (ICC) से संपर्क करें।'
    ],
    action_steps_english: [
      'Go to the nearest "One Stop Center" or court in case of domestic violence.',
      'Call the women helpline 1091 in case of harassment.',
      'File a civil suit for property disputes.',
      'Contact the Internal Complaints Committee (ICC) for workplace complaints.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'महिला हेल्पलाइन', number: '1091' },
      { name: 'घरेलू हिंसा हेल्पलाइन', number: '181' }
    ],
    legal_sections: [
      'Domestic Violence Act 2005',
      'Hindu Succession Amendment 2005',
      'Constitution Article 14, 15',
      'BNS Section 72-84'
    ]
  },
  child_rights: {
    id: 'child_rights_detail',
    category_id: 'child_rights',
    title_hindi: 'बाल अधिकार - सुरक्षा और शिक्षा',
    title_english: 'Child Rights - Protection and Education',
    content_hindi: 'देश के हर बच्चे को मुफ्त शिक्षा और बाल श्रम से सुरक्षा का अधिकार है। POCSO कानून बच्चों को यौन अपराधों से कड़ी सुरक्षा प्रदान करता है। बच्चों का शोषण ' +
      'करने वालों के विरुद्ध कठोर सजा का प्रावधान है। बच्चों के अधिकारों की रक्षा करना समाज और सरकार का दायित्व है।',
    content_english: 'Every child in the country has the right to free education and protection from child labor. The POCSO Act provide strong protection to children from sexual offenses. There is a provision for strict punishment against those who exploit children. It is the responsibility of the society and the government to protect the rights of children.',
    key_rights_hindi: [
      '6 से 14 वर्ष की आयु तक मुफ्त और अनिवार्य शिक्षा का अधिकार',
      'कठिन और खतरनाक उद्योगों में बाल श्रम के विरुद्ध सुरक्षा',
      'यौन शोषण और दुर्व्यवहार के विरुद्ध सुरक्षा (POCSO)',
      'पोषण, स्वास्थ्य और खेलकूद का अधिकार',
      'कानूनी मामलों में बाल मित्र कोर्ट (Child-Friendly Courts) का अधिकार'
    ],
    key_rights_english: [
      'Right to free and compulsory education up to 6 to 14 years of age',
      'Protection against child labor in hazardous industries',
      'Protection against sexual exploitation and abuse (POCSO)',
      'Right to nutrition, health, and sports',
      'Right to Child-Friendly Courts in legal matters'
    ],
    action_steps_hindi: [
      'यदि किसी बच्चे का शोषण हो रहा है, तो 1098 पर कॉल करें।',
      'POCSO मामले में पुलिस को तुरंत सूचना दें।',
      'स्कूल से बच्चे का नाम काटे जाने पर शिक्षा विभाग में शिकायत करें।',
      'बाल कल्याण समिति (CWC) से संपर्क करें।'
    ],
    action_steps_english: [
      'If a child is being exploited, call 1098.',
      'Inform the police immediately in a POCSO case.',
      'Complain to the education department if a child is expelled from school.',
      'Contact the Child Welfare Committee (CWC).'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'चाइल्ड हेल्पलाइन', number: '1098' },
      { name: 'बाल संरक्षण हेल्पलाइन', number: '1800114400' }
    ],
    legal_sections: [
      'RTE Act 2009',
      'POCSO Act 2012',
      'Child Labour Prohibition Act',
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
    title_hindi: 'साइबर अपराध - ऑनलाइन सुरक्षा और फ्रॉड से बचाव',
    title_english: 'Cyber Crime - Online Protection and Fraud Prevention',
    content_hindi: 'सूचना प्रौद्योगिकी अधिनियम 2000 और भारतीय न्याय संहिता (BNS) के तहत ऑनलाइन धोखाधड़ी, बैंकिंग फ्रॉड, सोशल मीडिया पर उत्पीड़न और डेटा चोरी के विरुद्ध कड़ी सुरक्षा प्रदान की गई है। यदि आपके साथ कोई डिजिटल धोखाधड़ी होती है, तो आप तुरंत शिकायत दर्ज करा सकते हैं।',
    content_english: 'Strict protection is provided against online fraud, banking fraud, social media harassment, and data theft under the IT Act 2000 and BNS. If any digital fraud happens to you, you can file a complaint immediately.',
    key_rights_hindi: [
      'वित्तीय धोखाधड़ी (Bank Fraud) की तुरंत रिपोर्ट करने का अधिकार',
      'निजी डेटा और तस्वीरों के दुरुपयोग के विरुद्ध कानूनी सुरक्षा',
      'साइबर बुलिंग और ऑनलाइन धमकी के विरुद्ध शिकायत का अधिकार',
      'ऑनलाइन शॉपिंग में हुए फ्रॉड के खिलाफ रिफंड पाने का अधिकार',
      'साइबर सेल या नेशनल साइबर क्राइम पोर्टल पर शिकायत का अधिकार'
    ],
    key_rights_english: [
      'Right to immediately report financial fraud (Bank Fraud)',
      'Legal protection against misuse of personal data and photos',
      'Right to complain against cyberbullying and online threats',
      'Right to receive a refund against fraud in online shopping',
      'Right to complain on the Cyber Cell or National Cyber Crime Portal'
    ],
    action_steps_hindi: [
      'धोखाधड़ी का पता चलते ही 1930 नंबर पर कॉल करें।',
      'सभी स्क्रीनशॉट और चैट्स को सबूत के तौर पर सुरक्षित रखें।',
      'वेबसाइट "cybercrime.gov.in" पर ऑनलाइन शिकायत दर्ज करें।',
      'अपने बैंक को तुरंत सूचित कर कार्ड या अकाउंट ब्लॉक कराएं।'
    ],
    action_steps_english: [
      'Call 1930 as soon as you find out about the fraud.',
      'Keep all screenshots and chats safe as evidence.',
      'File an online complaint on the website "cybercrime.gov.in".',
      'Immediately inform your bank and block the card or account.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'साइबर क्राइम हेल्पलाइन', number: '1930' },
      { name: 'नेशनल साइबर पोर्टल', number: '1800110422' }
    ],
    legal_sections: [
      'IT Act 2000 Section 66C, 66D',
      'BNS Section 318, 319 (Cheating)',
      'IT Rules 2021'
    ]
  },
  bail_rights: {
    id: 'bail_rights_detail',
    category_id: 'bail_rights',
    title_hindi: 'जमानत - आपका कानूनी अधिकार',
    title_english: 'Bail - Your Legal Right',
    content_hindi: 'भारतीय न्याय व्यवस्था में "जमानत एक नियम है और जेल एक अपवाद" (Bail is the rule, Jail is an exception)। यदि आप पर कोई आरोप लगा है, तो आपको अदालत से सशर्त रिहाई पाने का अधिकार है। गैर-जमानती अपराधों में भी कुछ परिस्थितियों में जमानत मिल सकती है।',
    content_english: 'In the Indian justice system, "Bail is the rule, Jail is an exception". If any charge is leveled against you, you have the right to get a conditional release from the court. Bail can be obtained in even non-bailable offenses under certain circumstances.',
    key_rights_hindi: [
      'जमानती अपराधों (Bailable Offenses) में तुरंत जमानत पाने का अधिकार',
      'गिरफ्तारी से पहले सुरक्षात्मक जमानत (Anticipatory Bail) का अधिकार',
      'मजिस्ट्रेट के सामने 24 घंटे में पेश होने का अधिकार',
      'गरीबों के लिए "पर्सनल बॉन्ड" पर रिहाई पाने का अधिकार',
      'मामले में देरी होने पर "डिफ़ॉल्ट बेल" (Default Bail) का अधिकार'
    ],
    key_rights_english: [
      'Right to get immediate bail in Bailable Offenses',
      'Right to Anticipatory Bail before arrest',
      'Right to be produced before a magistrate within 24 hours',
      'Right to get released on "Personal Bond" for the poor',
      'Right to "Default Bail" in case of delay in the case'
    ],
    action_steps_hindi: [
      'वकील के माध्यम से सक्षम अदालत में जमानत याचिका दाखिल करें।',
      'जरूरी दस्तावेज (ID प्रूफ, एड्रेस प्रूफ) और जमानतदार (Surety) तैयार रखें।',
      'जमानत की शर्तों को ध्यान से समझें और उनका पालन करें।',
      'कानूनी सहायता के लिए "लीगल एड" सेल से संपर्क करें।'
    ],
    action_steps_english: [
      'File a bail petition in a competent court through a lawyer.',
      'Keep necessary documents (ID proof, address proof) and Surety ready.',
      'Understand the bail conditions carefully and follow them.',
      'Contact the "Legal Aid" cell for legal assistance.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'नालसा हेल्पलाइन', number: '15110' },
      { name: 'पुलिस हेल्प', number: '112' }
    ],
    legal_sections: [
      'BNSS Section 478-490',
      'Constitution Article 21',
      'Anticipatory Bail BNSS 482'
    ]
  },
  minimum_wage: {
    id: "minimum_wage_detail",
    category_id: "minimum_wage",
    title_hindi: "न्यूनतम वेतन - मजदूरों के अधिकार",
    title_english: "Minimum Wage - Rights of Workers",
    content_hindi: "न्यूनतम मजदूरी अधिनियम 1948 के तहत सरकार हर क्षेत्र और कार्य के लिए एक न्यूनतम वेतन निर्धारित करती है। किसी भी कर्मचारी से इस तय सीमा से कम पर काम करवाना न केवल अनैतिक है बल्कि एक दंडनीय अपराध भी है। आपको आपके परिश्रम का उचित, समय पर और पूरा फल पाने का संवैधानिक अधिकार है। यदि कोई नियोक्ता (Employer) सरकारी दर से कम पैसे देता है, तो आप लेबर कोर्ट में अपनी शिकायत दर्ज करा सकते हैं।",
    content_english: "Under the Minimum Wages Act 1948, the government prescribes a minimum wage for every sector and job. Making any employee work for less than this set limit is not only immoral but also a punishable offense. You have the constitutional right to get fair, timely, and full fruit of your hard work.",
    key_rights_hindi: [
      'राज्य सरकार द्वारा तय न्यूनतम वेतन पाने का कानूनी अधिकार',
      'समय पर वेतन भुगतान (महीने की 7 या 10 तारीख तक) पाने का अधिकार',
      '8 घंटे से अधिक काम करने पर ओवरटाइम (Double Rate) पाने का हक',
      'वेतन से बिना किसी वैध कारण के कटौती के विरुद्ध कानूनन सुरक्षा',
      'समान कार्य के लिए महिलाओं और पुरुषों को बिना किसी भेदभाव के समान वेतन का अधिकार',
      'काम के दौरान साप्ताहिक छुट्टी (Weekly Off) पाने का अधिकार'
    ],
    key_rights_english: [
      'Right to receive prescribed minimum wages from the State Government',
      'Right to timely wage payment (up to 7th or 10th of the month)',
      'Right to overtime (Double Rate) for working more than 8 hours',
      'Protection against deduction of wages without reason',
      'Right to equal pay for equal work for women and men'
    ],
    action_steps_hindi: [
      'वेतन न मिलने या कम मिलने पर लेबर ऑफिसर (Labour Officer) को पत्र लिखें।',
      'अपने काम के घंटों और प्राप्त वेतन का लिखित रिकॉर्ड रखें।',
      'लेबर कोर्ट के माध्यम से बकाया वेतन का दावा (Claim) करें।',
      'किसी भी यूनियन या श्रम संगठन से मदद लें।'
    ],
    action_steps_english: [
      'Write a letter to the Labour Officer in case of non-payment or underpayment of wages.',
      'Keep a written record of your working hours and received wages.',
      'Make a claim for outstanding wages through the Labour Court.',
      'Take help from any union or labor organization.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "श्रम हेल्पलाइन", number: "1800-11-2228" },
      { name: "शिकायत सेल", number: "155214" }
    ],
    legal_sections: [
      "Minimum Wages Act 1948",
      "Code on Wages 2019",
      "Equal Remuneration Act 1976"
    ]
  },
  maternity_rights: {
    id: "maternity_rights_detail",
    category_id: "maternity_rights",
    title_hindi: "मातृत्व अधिकार - गर्भवती महिलाओं के अधिकार",
    title_english: "Maternity Rights - Rights of Pregnant Women",
    content_hindi: "मातृत्व लाभ अधिनियम के तहत हर कामकाजी गर्भवती महिला को विशेष अधिकार और वेतन सहित लंबी छुट्टियां पाने का कानूनी अधिकार दिया गया है। गर्भावस्था के दौरान या बच्चे के जन्म के तुरंत बाद किसी महिला को काम से निकालना एक गंभीर अपराध है। सरकार सुरक्षित मातृत्व, बच्चे के स्वास्थ्य और माँ की देखभाल के लिए कड़े कानून बनाती है ताकि उन्हें आर्थिक और सामाजिक सुरक्षा मिल सके।",
    content_english: "Under the Maternity Benefit Act, every working pregnant woman has the legal right to special rights and long paid leave. Terminating a woman from work during pregnancy or immediately after the birth of the child is a serious offense.",
    key_rights_hindi: [
      '26 सप्ताह की सवैतनिक छुट्टी (Paid Leave) का वैधानिक अधिकार',
      'गर्भावस्था के कारण काम से निकाले जाने या पद घटाने के विरुद्ध सुरक्षा',
      'अस्पताल जाने और शिशु को दूध पिलाने के लिए विशेष ब्रेक (Nursing Breaks) का हक',
      'कार्यस्थल पर शिशुगृह (Creche) की सुविधा पाने का अधिकार (50 से अधिक कर्मचारियों पर)',
      'गर्भावस्था के दौरान भारी या कठिन शारीरिक कार्य न करने का कानूनी अधिकार',
      'मैटरनिटी बोनस और मेडिकल खर्चों के लिए सहायता पाने का हक'
    ],
    key_rights_english: [
      'Right to 26 weeks of paid leave',
      'Protection against being fired from work due to pregnancy',
      'Right to nursing breaks for hospital visits and feeding',
      'Right to get creche facility at the workplace (for 50+ employees)',
      'Right not to do hard physical work during pregnancy'
    ],
    action_steps_hindi: [
      'छुट्टी के लिए अपने संस्थान के HR या प्रबंधक को कम से कम 8 सप्ताह पहले सूचित करें।',
      'डॉक्टर द्वारा दिया गया फिटनेस सर्टिफिकेट और अन्य मेडिकल रिपोर्ट संभाल कर रखें।',
      'लाभ न मिलने पर लेबर कमिश्नर या महिला आयोग में शिकायत करें।',
      'दबाव में आकर इस्तीफा (Resignation) न दें।'
    ],
    action_steps_english: [
      'Inform the HR or manager of your organization at least 8 weeks in advance for leave.',
      'Keep the fitness certificate and other medical reports given by the doctor safely.',
      'In case of non-receipt of benefits, complain to the Labour Commissioner or the Women Commission.',
      'Do not resign under pressure.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "महिला हेल्पलाइन", number: "1091" },
      { name: "श्रम हेल्पलाइन", number: "155214" }
    ],
    legal_sections: [
      "Maternity Benefit Act 1961",
      "Maternity Benefit (Amendment) Act 2017",
      "ESI Act 1948"
    ]
  },
  agriculture_rights: {
    id: "agriculture_rights_detail",
    category_id: "agriculture_rights",
    title_hindi: "कृषि अधिकार - किसानों की कानूनी सुरक्षा",
    title_english: "Agriculture Rights - Legal Protection for Farmers",
    content_hindi: "भारतीय कानून किसानों को उनकी भूमि, फसल के उचित मूल्य और सरकारी योजनाओं के लाभ पाने के विशेष अधिकार प्रदान करता है। भूमि अधिग्रहण की स्थिति में किसानों को उचित मुआवजे और पुनर्वास का अधिकार भी दिया गया है। केंद्र और राज्य सरकारें किसानों की आय बढ़ाने और उन्हें कर्ज के जाल से बचाने के लिए समय-समय पर विशेष कानून और नीतियां बनाती हैं।",
    content_english: "Indian law provides special rights to farmers for their land, fair price for crops, and benefits of government schemes. Farmers have also been given the right to fair compensation and rehabilitation in case of land acquisition.",
    key_rights_hindi: [
      'न्यूनतम समर्थन मूल्य (MSP) पर फसल बेचने का कानूनी अधिकार',
      'प्राकृतिक आपदा में फसल बीमा (PMFBY) का पूरा लाभ पाने का हक',
      'सरकारी और बैंकिंग संस्थाओं से कम ब्याज पर ऋण (KCC) पाने का अधिकार',
      'भूमि अधिग्रहण (Land Acquisition) पर बाजार दर से 4 गुना तक मुआवजा पाने का हक',
      'कृषि यंत्रों, बीजों और उर्वरकों पर मिलने वाली सरकारी सब्सिडी का अधिकार',
      'सिंचाई के लिए बिजली और पानी की उचित उपलब्धता की मांग करने का हक'
    ],
    key_rights_english: [
      'Right to sell crop at Minimum Support Price (MSP)',
      'Right to receive the benefit of crop insurance (PMFBY) in natural disasters',
      'Right to receive loans (KCC) at low interest from banking institutions',
      'More than market rate compensation on land acquisition',
      'Right to subsidies available on agricultural implements and fertilizers'
    ],
    action_steps_hindi: [
      'अपनी भूमि के दस्तावेज (खतौनी, जमाबंदी) हमेशा अपडेट रखें।',
      'फसल बेचने पर हमेशा पक्की रसीद मांगें।',
      'नुकसान की स्थिति में 72 घंटे के भीतर बीमा कंपनी को सूचित करें।',
      'कृषि विभाग के ब्लॉक स्तर के अधिकारियों से नियमित संपर्क में रहें।'
    ],
    action_steps_english: [
      'Always keep your land documents (Khatauni, Jamabandi) updated.',
      'Always ask for a proper receipt on selling the crop.',
      'In case of loss, inform the insurance company within 72 hours.',
      'Stay in regular contact with the block-level officers of the agriculture department.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "किसान कॉल सेंटर", number: "1800-180-1551" },
      { name: "कृषि मंत्रालय", number: "1551" }
    ],
    legal_sections: [
      "Land Acquisition Act 2013",
      "Essential Commodities Act",
      "PPV&FR Act 2001"
    ]
  },
  tribal_rights: {
    id: "tribal_rights_detail",
    category_id: "tribal_rights",
    title_hindi: "आदिवासी अधिकार - वन और भूमि संरक्षण",
    title_english: "Tribal Rights - Forest and Land Protection",
    content_hindi: "अनुसूची-V और वन अधिकार अधिनियम 2006 (FRA) के तहत अनुसूचित जनजातियों को उनकी संस्कृति, परंपरा और निवास स्थान पर विशेष अधिकार प्राप्त हैं। उन्हें अपनी पारंपरिक वन भूमि पर रहने, पशु चराने और खेती करने का अटूट हक है। किसी भी बाहरी व्यक्ति, भू-माफिया या कंपनी द्वारा आदिवासी भूमि पर कब्जा करना एक गैर-जमानती अपराध है।",
    content_english: "Scheduled Tribes have special rights over their culture, tradition, and place of residence under Schedule-V and the Forest Rights Act 2006 (FRA).",
    key_rights_hindi: [
      'पट्टा (Title Deed) के माध्यम से वन भूमि पर मालिकाना हक का अधिकार',
      'लघु वन उपज (Minor Forest Produce) को बिना किसी रोक-टोक इकट्ठा करने और बेचने का हक',
      'ग्राम सभा की अनुमति के बिना भूमि अधिग्रहण और विस्थापन के विरुद्ध पूर्ण सुरक्षा',
      'शिक्षा, नौकरियों और राजनीति में संवैधानिक आरक्षण पाने का अधिकार',
      'अपनी विशिष्ट भाषा, लिपि और सांस्कृतिक विरासत के संरक्षण का अधिकार',
      'अत्याचार निवारण अधिनियम (SC/ST Act) के तहत विशेष कानूनी सुरक्षा'
    ],
    key_rights_english: [
      'Ownership rights over forest land through Title Deed',
      'Right to collect and sell Minor Forest Produce',
      'Protection against land acquisition without the permission of Gram Sabha',
      'Right to reservation in education and government jobs',
      'Right to preserve their distinct culture and language'
    ],
    action_steps_hindi: [
      'अपने वन अधिकार दावे (Claim) ग्राम सभा के माध्यम से वन समिति को दें।',
      'भूमि पर कब्जे की स्थिति में "अनुसूचित जाति/जनजाति सुरक्षा अधिनियम" के तहत FIR करें।',
      'कमिश्नर या जिला कलेक्टर को भूमि संबंधी विवादों की शिकायत करें।',
      'अपनी ग्राम सभा को पूर्णतः जागरूक और सक्रिय रखें।'
    ],
    action_steps_english: [
      'Submit your forest right claims to the Forest Committee through the Gram Sabha.',
      'In case of occupation of land, file an FIR under the "SC/ST Protection Act".',
      'Complain about land-related disputes to the Commissioner or District Collector.',
      'Keep your Gram Sabha fully aware and active.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "आदिवासी हेल्पलाइन", number: "1800110031" },
      { name: "एनसीटीआर (NCTR)", number: "155214" }
    ],
    legal_sections: [
      "Forest Rights Act 2006",
      "PESA Act 1996",
      "Constitution Article 244",
      "SC/ST PA Act 1989"
    ]
  },
  marriage_rights: {
    id: "marriage_rights_detail",
    category_id: "marriage_rights",
    title_hindi: "विवाह संबंधी अधिकार - समानता और सम्मान",
    title_english: "Marriage Rights - Equality and Dignity",
    content_hindi: "भारतीय कानून में विवाह केवल एक धार्मिक संस्कार नहीं, बल्कि एक कानूनी अनुबंध भी है। इसमें पति और पत्नी दोनों को समान अधिकार प्राप्त हैं। दहेज मांगना या देना एक गंभीर अपराध है। विवाह में सहमति सबसे महत्वपूर्ण है, और जबरन विवाह कानूनी रूप से अमान्य है।",
    content_english: "In Indian law, marriage is not only a religious ritual but also a legal contract. In this, both husband and wife have equal rights. Asking for or giving dowry is a serious offense. Consent is most important in marriage, and forced marriage is legally invalid.",
    key_rights_hindi: [
      'अपनी मर्जी से जीवनसाथी चुनने का कानूनी अधिकार',
      'दहेज की मांग और मानसिक प्रताड़ना के विरुद्ध सुरक्षा',
      'स्त्रीधन (Gold, Gift) पर पत्नी का पूर्ण मालिकाना हक',
      'सम्मानजनक कार्य और रहने के वातावरण का साझा अधिकार',
      'विवाह का पंजीकरण (Marriage Registration) कराने का हक'
    ],
    key_rights_english: [
      'Legal right to choose a life partner by one\'s choice',
      'Protection against dowry demands and mental torture',
      'Full ownership rights of the wife over Stree-dhan (Gold, Gift)',
      'Shared right to a dignified work and living environment',
      'Right to register the marriage'
    ],
    action_steps_hindi: [
      'विवाह का सर्टिफिकेट (Marriage Certificate) जरूर बनवाएं।',
      'दहेज के मामलों में तुरंत 100/112 या महिला हेल्पलाइन पर कॉल करें।',
      'पारिवारिक विवादों के लिए "काउंसलिंग" या फैमिली कोर्ट की मदद लें।',
      'अपने सभी कानूनी दस्तावेजों में पति/पत्नी का नाम अपडेट कराएं।'
    ],
    action_steps_english: [
      'Always get a Marriage Certificate made.',
      'In dowry cases, immediately call 100/112 or the women helpline.',
      'For family disputes, take the help of "counseling" or the family court.',
      'Update the name of the spouse in all your legal documents.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "महिला हेल्पलाइन", number: "181" },
      { name: "लीगल एड", number: "15110" }
    ],
    legal_sections: [
      "Hindu Marriage Act 1955",
      "Special Marriage Act 1954",
      "Dowry Prohibition Act 1961"
    ]
  },
  divorce_rights: {
    id: "divorce_rights_detail",
    category_id: "divorce_rights",
    title_hindi: "तलाक - विवाह विच्छेद और आपके अधिकार",
    title_english: "Divorce - Separation and Your Rights",
    content_hindi: "यदि वैवाहिक जीवन में गंभीर मतभेद हों, तो कानूनी तौर पर अलग होने का अधिकार हर नागरिक को है। इसमें आपसी सहमति (Mutual Consent) या विवादित (Contested) तलाक के प्रावधान हैं। तलाक की प्रक्रिया के दौरान और बाद में भरण-पोषण, बच्चों की कस्टडी और संपत्ति के बंटवारे का कानूनी अधिकार सुरक्षित रहता है।",
    content_english: "If there are serious differences in married life, every citizen has the right to separate legally. There are provisions for Mutual Consent or Contested divorce. The legal right to maintenance, child custody, and property division remains secure during and after the divorce process.",
    key_rights_hindi: [
      'आपसी सहमति से सरल और त्वरित तलाक पाने का अधिकार',
      'विवाहित महिला को भरण-पोषण (Alimony) और गुजारा भत्ता का हक',
      'बच्चों के सर्वोत्तम हित में उनकी कस्टडी या मिलने का अधिकार',
      'वैवाहिक घर में रहने या संपत्ति में अपने हिस्से का दावा करने का हक',
      'क्रूरता, त्याग या व्यभिचार के आधार पर तलाक लेने का अधिकार'
    ],
    key_rights_english: [
      'Right to get a simple and quick divorce by mutual consent',
      'Right to alimony and maintenance for a married woman',
      'Right to custody or meeting of children in their best interest',
      'Right to reside in the matrimonial home or claim a share in the property',
      'Right to divorce on grounds of cruelty, desertion, or adultery'
    ],
    action_steps_hindi: [
      'एक अनुभवी फैमिली लॉयर से परामर्श लें और सभी विकल्प समझें।',
      'फॅमिली कोर्ट में उचित धाराओं के तहत याचिका (Petition) दाखिल करें।',
      'मुफ्त कानूनी सहायता के लिए जिला विधिक सेवा प्राधिकरण (DLSA) जाएं।',
      'मध्यस्थता (Mediation) के जरिए विवाद सुलझाने का प्रयास करें।'
    ],
    action_steps_english: [
      'Consult an experienced family lawyer and understand all options.',
      'File a petition under appropriate sections in the family court.',
      'Go to the District Legal Services Authority (DLSA) for free legal aid.',
      'Try to resolve the dispute through mediation.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "लीगल एड", number: "15110" },
      { name: "महिला हेल्पलाइन", number: "181" }
    ],
    legal_sections: [
      "Hindu Marriage Act 1955 Section 13",
      "Special Marriage Act Section 27",
      "BNS Section 84"
    ]
  },
  senior_citizen: {
    id: "senior_citizen_detail",
    category_id: "senior_citizen",
    title_hindi: "वरिष्ठ नागरिक - सम्मान और भरण-पोषण",
    title_english: "Senior Citizen - Dignity and Maintenance",
    content_hindi: "वरिष्ठ नागरिक (60 वर्ष से अधिक) अधिनियम के तहत बुजुर्गों को उनके बच्चों या रिश्तेदारों से सम्मानजनक जीवन और देखभाल पाने का कानूनी अधिकार है। यदि बच्चे माता-पिता की सेवा नहीं करते, तो वे अपनी संपत्ति वापस ले सकते हैं और गुजारा भत्ता का दावा कर सकते हैं।",
    content_english: "Under the Senior Citizens (above 60 years) Act, the elderly have the legal right to get a dignified life and care from their children or relatives. If children do not serve their parents, they can take back their property and claim maintenance.",
    key_rights_hindi: [
      'ट्रिब्यूनल के माध्यम से बच्चों से मासिक गुजारा भत्ता पाने का अधिकार',
      'दुर्व्यवहार की स्थिति में बच्चों को दी गई संपत्ति वापस लेने का हक',
      'रेलवे, हवाई यात्रा और टैक्स में विशेष सरकारी छूट (Concessions)',
      'अस्पतालों में अलग लाइन और प्राथमिकता से इलाज का अधिकार',
      'सुरक्षित और सम्मानजनक निवास (Old Age Homes) पाने का हक'
    ],
    key_rights_english: [
      'Right to receive monthly maintenance from children through the tribunal',
      'Right to take back property given to children in case of abuse',
      'Special government concessions in railways, air travel, and taxes',
      'Right to separate line and priority treatment in hospitals',
      'Right to get safe and dignified residence (Old Age Homes)'
    ],
    action_steps_hindi: [
      'भरण-पोषण के लिए SDM या संबंधित ट्रिब्यूनल में आवेदन करें।',
      'किसी भी उत्पीड़न या धोखाधड़ी की स्थिति में "एल्डरलाइन" 14567 पर कॉल करें।',
      'अपनी वसीयत (Will) और संपत्ति के दस्तावेजों को अपनी सुरक्षित कस्टडी में रखें।',
      'स्थानीय पुलिस स्टेशन में वरिष्ठ नागरिक सेल में अपना पंजीकरण कराएं।'
    ],
    action_steps_english: [
      'Apply to the SDM or relevant tribunal for maintenance.',
      'Call "ElderLine" 14567 in case of any harassment or fraud.',
      'Keep your Will and property documents in your safe custody.',
      'Register yourself in the Senior Citizen Cell at the local police station.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "एल्डरलाइन", number: "14567" },
      { name: "पुलिस हेल्प", number: "112" }
    ],
    legal_sections: [
      "Maintenance and Welfare of Parents and Senior Citizens Act 2007",
      "Section 125 CrPC",
      "Article 41 of Constitution"
    ]
  },
  disability_rights: {
    id: "disability_rights_detail",
    category_id: "disability_rights",
    title_hindi: "दिव्यांग अधिकार - समानता और अवसर",
    title_english: "Disability Rights - Equality and Opportunity",
    content_hindi: "दिव्यांग व्यक्ति अधिकार अधिनियम (RPWD) 2016 के तहत दिव्यांगों को समाज की मुख्यधारा में जुड़ने के बराबर अवसर प्राप्त हैं। सरकारी नौकरियों में आरक्षण, शिक्षा में छूट और बाधा मुक्त वातावरण (Accessibility) उनका कानूनी अधिकार है। उनके प्रति भेदभाव करना कानूनन अपराध है।",
    content_english: "Under the Rights of Persons with Disabilities (RPWD) Act 2016, the disabled have equal opportunities to join the mainstream of society. Reservation in government jobs, relaxation in education, and accessibility are their legal rights. Discriminating against them is a legal offense.",
    key_rights_hindi: [
      'सरकारी नौकरियों में 4% और उच्च शिक्षा में 5% आरक्षण का अधिकार',
      '18 वर्ष तक की आयु तक मुफ्त और विशेष शिक्षा पाने का हक',
      'सार्वजनिक स्थानों और वाहनों में बाधा मुक्त प्रवेश (Ramps, Lifts)',
      'दिव्यांगता पेंशन और सहायक उपकरणों पर सब्सिडी पाने का अधिकार',
      'किसी भी अपमानजनक व्यवहार या भेदभाव के विरुद्ध कड़ी सुरक्षा'
    ],
    key_rights_english: [
      'Right to 4% reservation in government jobs and 5% in higher education',
      'Right to free and special education up to 18 years of age',
      'Barrier-free access in public places and vehicles (Ramps, Lifts)',
      'Right to get disability pension and subsidy on assistive devices',
      'Strict protection against any degrading treatment or discrimination'
    ],
    action_steps_hindi: [
      'अपना स्वावलंबन कार्ड (UDID) ऑनलाइन जरूर बनवाएं।',
      'सरकारी अस्पताल से दिव्यांगता प्रमाण पत्र (Certificate) प्राप्त करें।',
      'अधिकारों के हनन की स्थिति में जिला दिव्यांग पुनर्वास केंद्र से संपर्क करें।',
      'दिव्यांग आयुक्त (Commissioner for PwD) कार्यालय में शिकायत दर्ज कराएं।'
    ],
    action_steps_english: [
      'Must get your Swavalamban Card (UDID) made online.',
      'Obtain a disability certificate from a government hospital.',
      'In case of violation of rights, contact the District Disability Rehabilitation Center.',
      'File a complaint in the Office of the Commissioner for PwD.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "दिव्यांग हेल्पलाइन", number: "1800110031" },
      { name: "सामाजिक न्याय", number: "155214" }
    ],
    legal_sections: [
      "RPWD Act 2016",
      "Constitution Article 14, 15",
      "Mental Healthcare Act 2017"
    ]
  },
  education_rights: {
    id: "education_rights_detail",
    category_id: "education_rights",
    title_hindi: "शिक्षा का अधिकार - उज्ज्वल भविष्य की नींव",
    title_english: "Right to Education - Foundation of a Bright Future",
    content_hindi: "शिक्षा का अधिकार (RTE) अधिनियम के तहत 6 से 14 वर्ष की आयु के हर बच्चे को मुफ्त और अनिवार्य शिक्षा प्राप्त करने का मौलिक अधिकार है। किसी भी बच्चे को फीस न होने के कारण स्कूल से नहीं निकाला जा सकता। निजी स्कूलों में भी आर्थिक रूप से कमजोर वर्ग (EWS) के लिए सीटें आरक्षित हैं।",
    content_english: "Under the Right to Education (RTE) Act, every child in the age group of 6 to 14 years has a fundamental right to get free and compulsory education. No child can be expelled from school due to lack of fees. Even in private schools, seats are reserved for Economically Weaker Section (EWS).",
    key_rights_hindi: [
      'नजदीकी सरकारी स्कूल में मुफ्त दाखिला और किताबों का अधिकार',
      'जाति, धर्म या आर्थिक स्थिति के आधार पर भेदभाव के विरुद्ध सुरक्षा',
      'स्कूलों में पेयजल, शौचालय और मिड-डे मील (Mid-day Meal) का हक',
      'शारीरिक दंड (Physical Punishment) और मानसिक प्रताड़ना पर पूर्ण रोक',
      'प्राइवेट स्कूलों में 25% सीटों पर गरीब बच्चों के लिए मुफ्त शिक्षा'
    ],
    key_rights_english: [
      'Right to free admission and books in the nearest government school',
      'Protection against discrimination on the basis of caste, religion, or economic status',
      'Right to drinking water, toilets, and Mid-day Meal in schools',
      'Full ban on physical punishment and mental torture',
      'Free education for poor children in 25% seats in private schools'
    ],
    action_steps_hindi: [
      'दाखिले के लिए बच्चे का जन्म प्रमाण पत्र या आधार कार्ड तैयार रखें।',
      'दाखिला न मिलने पर जिला शिक्षा अधिकारी (DEO) से शिकायत करें।',
      'EWS सीटों के लिए ऑनलाइन पोर्टल पर समय पर आवेदन करें।',
      'स्कूल मैनेजमेंट कमेटी (SMC) की बैठकों में नियमित भाग लें।'
    ],
    action_steps_english: [
      'Keep the child\'s birth certificate or Aadhaar card ready for admission.',
      'In case of non-admission, complain to the District Education Officer (DEO).',
      'Apply on time on the online portal for EWS seats.',
      'Regularly participate in School Management Committee (SMC) meetings.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "शिक्षा हेल्पलाइन", number: "1800112199" },
      { name: "चाइल्ड हेल्पलाइन", number: "1098" }
    ],
    legal_sections: [
      "RTE Act 2009",
      "Constitution Article 21A",
      "Constitution Article 45"
    ]
  },
  health_rights: {
    id: "health_rights_detail",
    category_id: "health_rights",
    title_hindi: "स्वास्थ्य अधिकार - जीवन की सुरक्षा",
    title_english: "Health Rights - Protection of Life",
    content_hindi: "अनुच्छेद 21 के तहत हर नागरिक को स्वस्थ जीवन और उचित इलाज पाने का अधिकार है। आपातकालीन स्थिति (Emergency) में किसी भी अस्पताल को पहले इलाज करना अनिवार्य है, वे पैसे के लिए इलाज नहीं रोक सकते। सरकारी अस्पतालों में मुफ्त जांच और दवाएं पाना आपका अधिकार है।",
    content_english: "Under Article 21, every citizen has the right to a healthy life and proper treatment. In an emergency, it is mandatory for any hospital to treat first, they cannot withhold treatment for money. It is your right to get free tests and medicines in government hospitals.",
    key_rights_hindi: [
      'दुर्घटना या इमरजेंसी की स्थिति में बिना अग्रिम भुगतान के इलाज का हक',
      'इलाज शुरू करने से पहले बीमारी और कोर्स की पूरी जानकारी पाने का हक',
      'मरीज की निजता (Privacy) और रिकॉर्ड को गोपनीय रखने का अधिकार',
      'अस्पताल से डिस्चार्ज या मृत्यु के बाद शव को न रोकने का कानूनी अधिकार',
      'आयुष्मान भारत और अन्य सरकारी योजनाओं के तहत मुफ्त इलाज का हक'
    ],
    key_rights_english: [
      'Right to treatment in case of accident or emergency without advance payment',
      'Right to get full information about the disease and course before starting treatment',
      'Right to privacy of the patient and keep records confidential',
      'Legal right not to withhold the body after discharge from the hospital or death',
      'Right to free treatment under Ayushman Bharat and other government schemes'
    ],
    action_steps_hindi: [
      'इलाज के सभी बिल, प्रिस्क्रिप्शन और टेस्ट रिपोर्ट की फाइल बना कर रखें।',
      'अस्पताल द्वारा कोताही बरतने पर स्टेट मेडिकल काउंसिल में शिकायत करें।',
      'सरकारी अस्पतालों में "पेशेंट वेलफेयर कमेटी" से मदद मांगें।',
      'जेनेरिक दवाइयों के लिए "जन औषधि केंद्र" का उपयोग करें।'
    ],
    action_steps_english: [
      'Keep a file of all treatment bills, prescriptions, and test reports.',
      'In case of negligence by the hospital, complain to the State Medical Council.',
      'Ask for help from the "Patient Welfare Committee" in government hospitals.',
      'Use "Jan Aushadhi Kendra" for generic medicines.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "स्वास्थ्य हेल्पलाइन", number: "104" },
      { name: "एम्बुलेंस", number: "102 / 108" }
    ],
    legal_sections: [
      "Constitution Article 21",
      "Clinical Establishments Act 2010",
      "Consumer Protection Act"
    ]
  },
  traffic_rules: {
    id: "traffic_rules_detail",
    category_id: "traffic_rules",
    title_hindi: "यातायात नियम और आपके अधिकार",
    title_english: "Traffic Rules and Your Rights",
    content_hindi: "सड़क पर सुरक्षा और सुचारु यातायात के लिए नियम बनाए गए हैं। पुलिस को आपको रोकने का अधिकार है, लेकिन उन्हें आपसे सलीके से पेश आना चाहिए। आपके पास भी पुलिस की पहचान पूछने और वैध चालान रसीद मांगने का अधिकार है। नियमों का पालन करना आपकी और दूसरों की सुरक्षा के लिए है।",
    content_english: "Rules have been made for safety and smooth traffic on the road. The police have the right to stop you, but they should treat you politely. You also have the right to ask for the police identity and ask for a valid challan receipt. Following the rules is for your and others' safety.",
    key_rights_hindi: [
      'ट्रैफिक पुलिस द्वारा रोके जाने पर उनकी पहचान और नेमप्लेट देखने का हक',
      'चालान कटने पर उसकी वैध डिजिटल या रसीद प्राप्त करने का अधिकार',
      'महिला वाहन चालक को केवल महिला पुलिस ही रोक सकती है या ले जा सकती है',
      'पुलिस द्वारा दुर्व्यवहार या चाबी निकालने के विरुद्ध शिकायत का हक',
      'गाड़ी जब्त (Seizure) होने पर उसका कारण और मेमो पाने का अधिकार'
    ],
    key_rights_english: [
      'Right to see the identity and nameplate of the traffic police when stopped',
      'Right to receive its valid digital or receipt when the challan is cut',
      'Only female police can stop or take away a female driver',
      'Right to complain against misbehavior or removing key by police',
      'Right to get the reason and memo when the vehicle is seized'
    ],
    action_steps_hindi: [
      'हमेशा ड्राइविंग लाइसेंस और बीमा (Insurance) की कॉपी साथ रखें।',
      'पुलिस द्वारा रोके जाने पर विनम्रता से बात करें और बहस न करें।',
      'गलत चालान होने पर आप उसे कोर्ट में चुनौती (Contest) दे सकते हैं।',
      'सड़क पर किसी घायल की मदद करें (Good Samaritan Law) - पुलिस आपको परेशान नहीं करेगी।'
    ],
    action_steps_english: [
      'Always keep a copy of driving license and insurance with you.',
      'Speak politely when stopped by the police and do not argue.',
      'In case of a wrong challan, you can challenge (Contest) it in court.',
      'Help an injured person on the road (Good Samaritan Law) - the police will not trouble you.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "ट्रैफिक हेल्पलाइन", number: "1073" },
      { name: "पुलिस", number: "112" }
    ],
    legal_sections: [
      "Motor Vehicles Act 1988",
      "MV Amendment Act 2019",
      "Supreme Court Guidelines"
    ]
  },
  domestic_violence: {
    id: "domestic_violence_detail",
    category_id: "domestic_violence",
    title_hindi: "घरेलू हिंसा से सुरक्षा - आपका अधिकार",
    title_english: "Protection from Domestic Violence - Your Right",
    content_hindi: "घरेलू हिंसा अधिनियम के तहत महिलाओं को घर के भीतर होने वाली शारीरिक, मानसिक, मौखिक, आर्थिक या यौन हिंसा के विरुद्ध पूर्ण कानूनी सुरक्षा प्राप्त है। इसमें केवल पति ही नहीं, बल्कि ससुराल के अन्य सदस्य भी शामिल हो सकते हैं। कानून आपको सुरक्षित निवास और भरण-पोषण का हक देता है।",
    content_english: "Under the Domestic Violence Act, women have full legal protection against physical, mental, verbal, economic, or sexual violence occurring within the home. This can include not only the husband but also other members of the in-laws. The law gives you the right to safe residence and maintenance.",
    key_rights_hindi: [
      'हिंसा रोकने के लिए अदालत से सुरक्षा आदेश (Protection Order) का हक',
      'अपने साझा घर (Shared Household) में रहने का कानूनी अधिकार',
      'हिंसा के कारण हुए शारीरिक या मानसिक नुकसान के लिए आर्थिक मुआवजा',
      'बच्चों की अस्थायी कस्टडी (Custody) प्राप्त करने का अधिकार',
      'मुफ्त कानूनी सहायता और मेडिकल सुविधा पाने का हक'
    ],
    key_rights_english: [
      'Right to protection order from the court to stop violence',
      'Legal right to reside in your shared household',
      'Financial compensation for physical or mental damage caused due to violence',
      'Right to obtain temporary custody of children',
      'Right to get free legal aid and medical facilities'
    ],
    action_steps_hindi: [
      'हिंसा की स्थिति में तुरंत महिला हेल्पलाइन 181 या पुलिस 112 पर कॉल करें।',
      'अपने क्षेत्र के प्रोटेक्शन ऑफिसर (Protection Officer) से मिलकर शिकायत दर्ज करें।',
      'चोट लगने पर सरकारी अस्पताल में मेडिकल जांच (MLC) जरूर कराएं।',
      'हिंसा की घटनाओं का तारीख और समय के साथ रिकॉर्ड रखने का प्रयास करें।'
    ],
    action_steps_english: [
      'In case of violence, immediately call women helpline 181 or police 112.',
      'Meet the Protection Officer of your area and file a complaint.',
      'In case of injury, must get a medical examination (MLC) done in a government hospital.',
      'Try to keep a record of violent incidents with date and time.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "महिला हेल्पलाइन", number: "181" },
      { name: "पुलिस", number: "112" }
    ],
    legal_sections: [
      "PWDVA 2005",
      "BNS Section 85 (Cruelty)",
      "BNS Section 86"
    ]
  },
  property_rights: {
    id: "property_rights_detail",
    category_id: "property_rights",
    title_hindi: "संपत्ति अधिकार - मालिकाना हक और सुरक्षा",
    title_english: "Property Rights - Ownership and Protection",
    content_hindi: "भारत में हर नागरिक को कानून के अनुसार संपत्ति खरीदने, रखने और उसे बेचने का अधिकार है। अनुच्छेद 300A के तहत किसी भी व्यक्ति को उसकी संपत्ति से बिना कानूनी प्रक्रिया के वंचित नहीं किया जा सकता। विरासत और वसीयत के माध्यम से संपत्ति प्राप्त करना भी एक कानूनी प्रक्रिया है।",
    content_english: "In India, every citizen has the right to buy, hold, and sell property according to the law. Under Article 300A, no person can be deprived of his property without a legal process. Acquiring property through inheritance and will is also a legal process.",
    key_rights_hindi: [
      'संपत्ति पर अवैध कब्जे के विरुद्ध सिविल और क्रिमिनल कोर्ट में केस का हक',
      'पिता की पैतृक संपत्ति में बेटियों का बेटों के बराबर कानूनी अधिकार',
      'रजिस्ट्री और म्यूटेशन (दाखिल-खारिज) कराने का कानूनी अधिकार',
      'सरकारी अधिग्रहण पर उचित मुआवजा और बाजार दर पाने का हक',
      'अपनी स्वअर्जित संपत्ति को किसी को भी वसीयत या दान करने का हक'
    ],
    key_rights_english: [
      'Right to file a case in civil and criminal courts against illegal occupation of property',
      'Legal right of daughters equal to sons in the ancestral property of the father',
      'Legal right to get registry and mutation (Dakhil-Kharij) done',
      'Right to get fair compensation and market rate on government acquisition',
      'Right to will or donate your self-acquired property to anyone'
    ],
    action_steps_hindi: [
      'संपत्ति के सभी दस्तावेज (Registry, Sale Deed, Map) सुरक्षित रखें।',
      'खरीदने से पहले वकील से टाइटल क्लियरेंस (Title Clearance) रिपोर्ट जरूर लें।',
      'अवैध कब्जे की स्थिति में पुलिस में शिकायत और कोर्ट में निषेधाज्ञा (Stay Order) मांगें।',
      'नियमित रूप से अपनी संपत्ति का टैक्स भरें और सरकारी रिकॉर्ड चेक करें।'
    ],
    action_steps_english: [
      'Keep all property documents (Registry, Sale Deed, Map) safe.',
      'Must take a title clearance report from a lawyer before buying.',
      'In case of illegal occupation, file a complaint in the police and ask for an injunction (Stay Order) in the court.',
      'Regularly pay tax on your property and check government records.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "लीगल एड", number: "15110" },
      { name: "राजस्व विभाग", number: "011-23392350" }
    ],
    legal_sections: [
      "Transfer of Property Act 1882",
      "Hindu Succession Act 2005",
      "Constitution Article 300A"
    ]
  },
  food_security: {
    id: "food_security_detail",
    category_id: "food_security",
    title_hindi: "खाद्य सुरक्षा - पोषण का अधिकार",
    title_english: "Food Security - Right to Nutrition",
    content_hindi: "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के तहत हर पात्र परिवार को सस्ते दाम पर गुणवत्तापूर्ण खाद्यान्न पाने का कानूनी अधिकार है। इसमें राशन कार्ड धारकों को अनाज के साथ-साथ गर्भवती महिलाओं और बच्चों के लिए पोषण सहायता भी शामिल है। राशन डीलर द्वारा अनाज न देना या कम देना अपराध है।",
    content_english: "Under the National Food Security Act (NFSA), every eligible family has the legal right to get quality food grains at cheap rates. This includes food grains for ration card holders as well as nutritional assistance for pregnant women and children. It is an offense for a ration dealer not to give food grains or to give less.",
    key_rights_hindi: [
      'राशन दुकान से तय मात्रा में गेहूं, चावल और अन्य अनाज पाने का हक',
      'अंगूठा लगाने के बाद रसीद और अनाज की पूरी तौल पाने का अधिकार',
      'गर्भवती महिलाओं को आंगनवाड़ी के माध्यम से मुफ्त भोजन पाने का हक',
      'खराब गुणवत्ता वाले अनाज के विरुद्ध शिकायत दर्ज करने का अधिकार',
      'राशन कार्ड न बनने या देरी होने पर अपील करने का हक'
    ],
    key_rights_english: [
      'Right to get set quantity of wheat, rice, and other grains from ration shop',
      'Right to get a receipt and full weight of grains after putting the thumbprint',
      'Right of pregnant women to get free food through Anganwadi',
      'Right to file a complaint against poor quality grains',
      'Right to appeal in case of non-making or delay of ration card'
    ],
    action_steps_hindi: [
      'अपना राशन कार्ड ऑनलाइन पोर्टल पर चेक और अपडेट रखें।',
      'राशन न मिलने पर तहसील के "फूड सप्लाई ऑफिसर" (FSO) को शिकायत करें।',
      'दुकान पर उपलब्ध स्टॉक रजिस्टर और कीमतों की सूची देखने की मांग करें।',
      'मिलावट के मामलों में "FSSAI" के पोर्टल पर ऑनलाइन रिपोर्ट करें।'
    ],
    action_steps_english: [
      'Keep your ration card checked and updated on the online portal.',
      'In case of non-receipt of ration, complain to the "Food Supply Officer" (FSO) of the tehsil.',
      'Demand to see the stock register and list of prices available at the shop.',
      'Report food adulteration online on the "FSSAI" portal.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "राशन हेल्पलाइन", number: "1967" },
      { name: "उपभोक्ता हेल्पलाइन", number: "1800114000" }
    ],
    legal_sections: [
      "National Food Security Act 2013",
      "Essential Commodities Act",
      "FSSAI Act 2006"
    ]
  },
  environment_rights: {
    id: "environment_rights_detail",
    category_id: "environment_rights",
    title_hindi: "पर्यावरण अधिकार - स्वच्छ जीवन का हक",
    title_english: "Environment Rights - Right to Clean Life",
    content_hindi: "भारत के संविधान के अनुसार हर नागरिक को प्रदूषण मुक्त और स्वच्छ पर्यावरण में जीने का मूल अधिकार है। यदि कोई कंपनी या व्यक्ति कचरा जलाकर, जहरीला पानी छोड़कर या ध्वनि प्रदूषण (Noise Pollution) फैलाकर पर्यावरण को नुकसान पहुंचाता है, तो उसके विरुद्ध एनजीटी (NGT) में शिकायत की जा सकती है।",
    content_english: "According to the Constitution of India, every citizen has a fundamental right to live in a pollution-free and clean environment. If any company or person harms the environment by burning garbage, releasing toxic water or spreading noise pollution, a complaint can be filed against them in the NGT.",
    key_rights_hindi: [
      'अपने क्षेत्र में होने वाले प्रदूषण के विरुद्ध शिकायत दर्ज करने का अधिकार',
      'स्वच्छ पेयजल और हवा पाने का संवैधानिक अधिकार',
      'पर्यावरण को नुकसान पहुंचाने वालों से मुआवजे (Compensation) का हक',
      'पेड़ काटने या वनों को नष्ट करने के विरुद्ध कानूनी शिकायत का अधिकार',
      'सार्वजनिक स्थानों पर स्वच्छता बनाए रखने की मांग करने का अधिकार'
    ],
    key_rights_english: [
      'Right to file a complaint against pollution occurring in your area',
      'Constitutional right to get clean drinking water and air',
      'Right to compensation from those who harm the environment',
      'Right to legal complaint against cutting trees or destroying forests',
      'Right to demand maintaining cleanliness in public places'
    ],
    action_steps_hindi: [
      'प्रदूषण की स्थिति में "स्टेट पॉल्यूशन कंट्रोल बोर्ड" (SPCB) को पत्र लिखें।',
      'ध्वनि प्रदूषण होने पर तुरंत पुलिस हेल्पलाइन 112 पर शिकायत करें।',
      'बड़े स्तर के पर्यावरण नुकसान के लिए "नेशनल ग्रीन ट्रिब्यूनल" (NGT) में याचिका दें।',
      'अपने अधिकारों के लिए स्थानीय स्वैच्छिक संस्थाओं (NGOs) से जुड़ें।'
    ],
    action_steps_english: [
      'In case of pollution, write a letter to the "State Pollution Control Board" (SPCB).',
      'In case of noise pollution, immediately complain to the police helpline 112.',
      'For large-scale environmental damage, file a petition in the "National Green Tribunal" (NGT).',
      'Join local voluntary organizations (NGOs) for your rights.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "पर्यावरण हेल्पलाइन", number: "1800119191" },
      { name: "सीपीसीबी", number: "011-43102030" }
    ],
    legal_sections: [
      "Environment Protection Act 1986",
      "Constitution Article 21, 48A",
      "National Green Tribunal Act 2010"
    ]
  },
  voter_rights: {
    id: "voter_rights_detail",
    category_id: "voter_rights",
    title_hindi: "मतदाता अधिकार - लोकतंत्र में आपकी शक्ति",
    title_english: "Voter Rights - Your Power in Democracy",
    content_hindi: "18 वर्ष से अधिक आयु के हर भारतीय नागरिक को मतदान का संवैधानिक अधिकार प्राप्त है। यह अधिकार बिना किसी भेदभाव के सभी को समान रूप से मिलता है। मतदान गुप्त होना चाहिए और कोई भी आपको किसी विशेष उम्मीदवार को वोट देने के लिए मजबूर या डरा नहीं सकता।",
    content_english: "Every Indian citizen above 18 years of age has the constitutional right to vote. This right is available to all equally without any discrimination. Voting should be secret and no one can force or intimidate you to vote for a particular candidate.",
    key_rights_hindi: [
      'बिना किसी दबाव या लालच के अपनी पसंद अनुसार वोट देने का अधिकार',
      'निर्वाचक नामावली (Voter List) में अपना नाम जुड़वाने का हक',
      'यदि कोई उम्मीदवार पसंद न हो, तो नोटा (NOTA) बटन दबाने का अधिकार',
      'मतदान प्रक्रिया में गड़बड़ी दिखने पर चुनाव अधिकारी से शिकायत का हक',
      'विकलांग और बुजुर्गों के लिए मतदान केंद्र पर विशेष सुविधा पाने का अधिकार'
    ],
    key_rights_english: [
      'Right to vote according to your choice without any pressure or greed',
      'Right to get your name added in the Electoral Roll (Voter List)',
      'Right to press the NOTA button if no candidate is liked',
      'Right to complain to the election officer on seeing discrepancy in the voting process',
      'Right to get special facilities at the polling station for the disabled and elderly'
    ],
    action_steps_hindi: [
      'voters.eci.gov.in पोर्टल पर जाकर अपनी वोटर आईडी और नाम की जाँच करें।',
      'चुनाव के दौरान किसी भी गड़बड़ी की "cVIGIL" ऐप पर तुरंत रिपोर्ट करें।',
      'अपने बीएलओ (BLO) से मिलकर वोटर कार्ड में सुधार या बदलाव कराएं।',
      'वोट देने के बाद अपनी उंगली पर स्याही और रसीद (VVPAT) जरूर देखें।'
    ],
    action_steps_english: [
      'Check your Voter ID and name by visiting voters.eci.gov.in portal.',
      'Report any discrepancy during elections immediately on "cVIGIL" app.',
      'Get correction or change in voter card by meeting your BLO.',
      'Always see the ink on your finger and the receipt (VVPAT) after voting.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "चुनाव आयोग हेल्पलाइन", number: "1950" },
      { name: "कलेक्टर ऑफिस", number: "155214" }
    ],
    legal_sections: [
      "Constitution Article 326",
      "Representation of People Act 1951",
      "Election Rules 1961"
    ]
  },
  fir_rights: {
    id: "fir_rights_detail",
    category_id: "fir_rights",
    title_hindi: "FIR अधिकार - प्रथम सूचना रिपोर्ट",
    title_english: "FIR Rights - First Information Report",
    content_hindi: "किसी भी संज्ञेय (Cognizable) अपराध की स्थिति में पुलिस का यह कर्तव्य है कि वह आपकी FIR दर्ज करे। यदि पुलिस FIR दर्ज करने से मना करती है, तो आप वरिष्ठ अधिकारियों या अदालत की मदद ले सकते हैं। कानून आपको FIR की एक कॉपी मुफ्त में पाने का अधिकार देता है।",
    content_english: "In case of any cognizable offense, it is the duty of the police to register your FIR. If the police refuse to register the FIR, you can take the help of senior officers or the court. The law gives you the right to get a copy of the FIR for free.",
    key_rights_hindi: [
      'पुलिस स्टेशन में मौखिक या लिखित रूप में FIR दर्ज कराने का अधिकार',
      'FIR दर्ज होने के बाद उसकी एक प्रमाणित कॉपी मुफ्त पाने का हक',
      'यदि अपराध दूसरे क्षेत्र का है, तो "जीरो एफआईआर" (Zero FIR) का अधिकार',
      'एफआईआर में अपनी बात को पढ़कर सुनाने और हस्ताक्षर करने का हक',
      'ऑनलाइन माध्यम (e-FIR) से भी चोरी या गुमशुदगी की शिकायत का अधिकार'
    ],
    key_rights_english: [
      'Right to register FIR in oral or written form at the police station',
      'Right to receive a certified copy of the FIR for free after registration',
      'Right to "Zero FIR" if the crime belongs to another area',
      'Right to have your statement read out and sign in the FIR',
      'Right to complain about theft or missing via online medium (e-FIR)'
    ],
    action_steps_hindi: [
      'घटना की पूरी जानकारी (समय, स्थान, अपराधी) स्पष्ट रूप से पुलिस को दें।',
      'यदि थाना प्रभारी मना करे, तो SP या स्थानीय मजिस्ट्रेट को पत्र भेजें।',
      'FIR दर्ज होने के बाद उसका नंबर और जांच अधिकारी का नाम जरूर नोट करें।',
      'किसी भी दबाव में आकर पुलिस की लिखी अधूरी बातों पर हस्ताक्षर न करें।'
    ],
    action_steps_english: [
      'Clearly give full information of the incident (time, place, criminal) to the police.',
      'If the SHO refuses, send a letter to the SP or local magistrate.',
      'After registering the FIR, must note its number and the name of the investigating officer.',
      'Do not sign on incomplete things written by the police under any pressure.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: "पुलिस", number: "112" },
      { name: "महिला हेल्पलाइन", number: "1091" }
    ],
    legal_sections: [
      "BNSS Section 173 (old CrPC 154)",
      "BNSS Section 174, 175",
      "Constitution Article 22"
    ]
  },
  witness_rights: {
    id: 'witness_rights_detail',
    category_id: 'witness_rights',
    title_hindi: 'गवाह अधिकार - सुरक्षा और संरक्षण',
    title_english: 'Witness Rights - Protection and Security',
    content_hindi: 'भारतीय न्याय व्यवस्था में गवाहों की भूमिका अत्यंत महत्वपूर्ण है। कानून गवाहों को डराने-धमकाने या प्रभावित करने से बचाने के लिए व्यापक सुरक्षा प्रदान करता है। गवाहों को कोर्ट आने-जाने के खर्च और सुरक्षा का अधिकार है।',
    content_english: 'The role of witnesses is extremely important in the Indian justice system. The law provides extensive protection to prevent witnesses from being intimidated or influenced. Witnesses have the right to travel expenses and protection.',
    key_rights_hindi: [
      'धमकी या दबाव से सुरक्षा का अधिकार',
      'अपना बयान स्वतंत्र रूप से दर्ज करने का अधिकार',
      'कोर्ट आने-जाने के लिए यात्रा भत्ता (Conveyance) पाने का हक',
      'यौन अपराधों के मामलों में अपनी पहचान गोपनीय रखने का अधिकार',
      'गवाह संरक्षण योजना 2018 के तहत विशेष सुरक्षा का अधिकार'
    ],
    key_rights_english: [
      'Right to protection from threats or pressure',
      'Right to record statement independently',
      'Right to receive conveyance allowance for attending court',
      'Right to maintain anonymity in cases of sexual offenses',
      'Right to special protection under the Witness Protection Scheme 2018'
    ],
    action_steps_hindi: [
      'खतरा महसूस होने पर तुरंत कोर्ट या जज को लिखित में सूचित करें।',
      'क्षेत्र के SP को सुरक्षा के लिए आवेदन दें।',
      'गवाह संरक्षण समिति (Witness Protection Committee) से मदद मांगें।',
      'अपना बयान देने से पहले पुलिस द्वारा दिए गए बयान की कॉपी मांगें।'
    ],
    action_steps_english: [
      'Immediately inform the court or judge in writing if you feel threatened.',
      'Apply for protection to the SP of the area.',
      'Seek help from the Witness Protection Committee.',
      'Ask for a copy of the statement given by the police before giving your statement.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'पुलिस हेल्पलाइन', number: '112' },
      { name: 'लीगल एड हेल्पलाइन', number: '15100' }
    ],
    legal_sections: [
      'Witness Protection Scheme 2018',
      'BNS Section 230-233',
      'Indian Evidence Act 1872'
    ]
  },
  privacy_rights: {
    id: 'privacy_rights_detail',
    category_id: 'privacy_rights',
    title_hindi: 'निजता का अधिकार - डेटा और गोपनीयता',
    title_english: 'Privacy Rights - Data and Confidentiality',
    content_hindi: 'अनुच्छेद 21 के तहत निजता एक मौलिक अधिकार है। कोई भी आपकी अनुमति के बिना आपकी निजी जानकारी, फोटो या कॉल रिकॉर्डिंग का उपयोग नहीं कर सकता। डिजिटल सुरक्षा के लिए भारत में अब कड़े कानून लागू हैं।',
    content_english: 'Privacy is a fundamental right under Article 21. No one can use your private information, photos, or call recordings without your permission. Strict laws are now in place in India for digital security.',
    key_rights_hindi: [
      'डेटा सुरक्षा और गोपनीयता का अधिकार',
      'बिना अनुमति फोन टैपिंग के विरुद्ध सुरक्षा',
      'आधार और निजी डेटा के दुरुपयोग पर रोक',
      'सोशल मीडिया पर अश्लीलता या बदनामी से सुरक्षा',
      'डिजिटल पर्सनल डेटा प्रोटेक्शन एक्ट (DPDP) के तहत अधिकार'
    ],
    key_rights_english: [
      'Right to data protection and confidentiality',
      'Protection against phone tapping without permission',
      'Restriction on misuse of Aadhaar and private data',
      'Protection from obscenity or defamation on social media',
      'Rights under the Digital Personal Data Protection Act (DPDP)'
    ],
    action_steps_hindi: [
      'डेटा चोरी होने पर "cybercrime.gov.in" पर शिकायत दर्ज करें।',
      'कॉल रिकॉर्डिंग या फोन टैपिंग की शिकायत "TRAI" को करें।',
      'निजी फोटो के दुरुपयोग पर पुलिस में "IT Act" के तहत FIR करें।',
      'बैंक ट्रांजेक्शन की जानकारी साझा न करें और पासवर्ड बदलते रहें।'
    ],
    action_steps_english: [
      'File a complaint at "cybercrime.gov.in" if data is stolen.',
      'Report call recording or phone tapping to "TRAI".',
      'File an FIR under the "IT Act" with the police for misuse of private photos.',
      'Do not share bank transaction details and keep changing passwords.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'साइबर क्राइम हेल्पलाइन', number: '1930' },
      { name: 'TRAI हेल्पलाइन', number: '155222' }
    ],
    legal_sections: [
      'Constitution Article 21',
      'DPDP Act 2023',
      'IT Act 2000 Section 66E'
    ]
  },
  banking_rights: {
    id: 'banking_rights_detail',
    category_id: 'banking_rights',
    title_hindi: 'बैंकिंग अधिकार - ग्राहकों की सुरक्षा',
    title_english: 'Banking Rights - Customer Protection',
    content_hindi: 'RBI के नियमों के अनुसार बैंकिंग ग्राहकों को अनेक सुरक्षा अधिकार प्राप्त हैं। यदि बैंक आपकी समस्या का समाधान नहीं करता, तो आप लोकपाल (Ombudsman) के पास जा सकते हैं। धोखाधड़ी होने पर तुरंत बैंक को सूचित करने से आपकी देयता सीमित हो जाती है।',
    content_english: 'According to RBI rules, banking customers have several protection rights. If the bank does not resolve your problem, you can go to the Ombudsman. Immediately informing the bank in case of fraud limits your liability.',
    key_rights_hindi: [
      'मुफ्त बेसिक सेविंग्स बैंक अकाउंट (BSBDA) का अधिकार',
      'अनधिकृत ट्रांजेक्शन पर मुआवजा और रिफंड पाने का हक',
      'बिना कारण बैंक सर्विस चार्ज काटने पर रोक',
      'वरिष्ठ नागरिकों और दिव्यांगों के लिए "डोरस्टेप बैंकिंग" का अधिकार',
      'बैंकिंग लोकपाल (Banking Ombudsman) में मुफ्त शिकायत का हक'
    ],
    key_rights_english: [
      'Right to a free Basic Savings Bank Deposit Account (BSBDA)',
      'Right to compensation and refund on unauthorized transactions',
      'Restriction on deducting bank service charges without reason',
      'Right to "Doorstep Banking" for senior citizens and the disabled',
      'Right to a free complaint in the Banking Ombudsman'
    ],
    action_steps_hindi: [
      'पहले अपनी बैंक शाखा में लिखित शिकायत दर्ज करें।',
      '30 दिन में समाधान न मिलने पर "bankingombudsman.rbi.org.in" पर शिकायत करें।',
      'बैंक फ्रॉड होने पर तुरंत 14448 पर कॉल कर कार्ड ब्लॉक कराएं।',
      'लोन रिकवरी एजेंट द्वारा उत्पीड़न होने पर RBI को रिपोर्ट करें।'
    ],
    action_steps_english: [
      'First, file a written complaint in your bank branch.',
      'If not resolved in 30 days, complain at "bankingombudsman.rbi.org.in".',
      'Immediately call 14448 and block the card in case of bank fraud.',
      'Report to RBI in case of harassment by loan recovery agents.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'RBI हेल्पलाइन', number: '14448' },
      { name: 'साइबर फ्रॉड हेल्पलाइन', number: '1930' }
    ],
    legal_sections: [
      'RBI Charter of Customer Rights',
      'Banking Regulation Act 1949',
      'Consumer Protection Act 2019'
    ]
  },
  insurance_rights: {
    id: 'insurance_rights_detail',
    category_id: 'insurance_rights',
    title_hindi: 'बीमा अधिकार - पॉलिसी धारकों का संरक्षण',
    title_english: 'Insurance Rights - Protection of Policy Holders',
    content_hindi: 'IRDAI ने बीमा कंपनियों के लिए सख्त नियम बनाए हैं ताकि ग्राहकों को क्लेम पास कराने में परेशानी न हो। पॉलिसी लेने के बाद आपको उसे रद्द करने के लिए फ्री-लुक पीरियड भी मिलता है।',
    content_english: 'IRDAI has made strict rules for insurance companies so that customers do not face trouble in getting claims passed. You also get a free-look period to cancel the policy after taking it.',
    key_rights_hindi: [
      'क्लेम रिजेक्ट होने पर अपील और पुनर्विचार का अधिकार',
      '15 दिन का "फ्री लुक पीरियड" (पॉलिसी रद्द करने का समय)',
      'बिना कारण बताए क्लेम रोकने पर ब्याज पाने का हक',
      'पॉलिसी शर्तों की स्पष्ट और सरल भाषा में जानकारी पाने का अधिकार',
      'बीमा लोकपाल (Insurance Ombudsman) में शिकायत का हक'
    ],
    key_rights_english: [
      'Right to appeal and reconsider if the claim is rejected',
      '15-day "Free Look Period" (time to cancel the policy)',
      'Right to receive interest if the claim is withheld without giving a reason',
      'Right to get information on policy terms in clear and simple language',
      'Right to complain in the Insurance Ombudsman'
    ],
    action_steps_hindi: [
      'बीमा कंपनी के ' + 'Grievance Officer' + ' को लिखित शिकायत भेजें।',
      'समाधान न होने पर "Bima Bharosa" (igms.irda.gov.in) पोर्टल पर शिकायत करें।',
      'बीमा लोकपाल (Ombudsman) से संपर्क कर मध्यस्थता की मांग करें।',
      'सभी प्रीमियम रसीदों और दस्तावेजों का रिकॉर्ड सुरक्षित रखें।'
    ],
    action_steps_english: [
      'Send a written complaint to the Grievance Officer of the insurance company.',
      'If not resolved, file a complaint on the "Bima Bharosa" (igms.irda.gov.in) portal.',
      'Contact the Insurance Ombudsman and demand mediation.',
      'Keep records of all premium receipts and documents safe.'
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      { name: 'IRDAI हेल्पलाइन', number: '155255' },
      { name: 'बीमा लोकपाल', number: '1800-4254-732' }
    ],
    legal_sections: [
      'Insurance Act 1938',
      'IRDAI Protection of Policyholders Rules 2017'
    ]
  },
  tax_rights: {
    id: "tax_rights_detail",
    category_id: "tax_rights",
    title_hindi: "कर अधिकार - करदाताओं की सुरक्षा",
    title_english: "Tax Rights - Protection for Taxpayers",
    content_hindi: "भारतीय आयकर अधिनियम के तहत करदाताओं को अनेक अधिकार प्राप्त हैं। आपको पारदर्शी और निष्पक्ष व्यवहार का अधिकार है। कर विभाग बिना ठोस सबूत के आपको परेशान नहीं कर सकता।",
    content_english: "Under the Indian Income Tax Act, taxpayers have several rights. You have the right to transparent and fair treatment. The tax department cannot harass you without solid evidence.",
    key_rights_hindi: [
      "रिफंड पाने का अधिकार (Refund)",
      "अपील करने का अधिकार (Appeal)",
      "उत्पीड़न से सुरक्षा (Protection from Harassment)",
      "निजता और गोपनीयता का अधिकार",
      "वकील या प्रतिनिधि से सलाह लेने का अधिकार"
    ],
    key_rights_english: [
      "Right to refund",
      "Right to appeal",
      "Protection from harassment",
      "Right to privacy and confidentiality",
      "Right to consult a lawyer or representative"
    ],
    action_steps_hindi: [
      "इनकम टैक्स पोर्टल (incometax.gov.in) पर शिकायत दर्ज करें।",
      "नजदीकी आयकर सेवा केंद्र (ASK) जाएं।",
      "लोकपाल (Ombudsman) से संपर्क करें।"
    ],
    action_steps_english: [
      "File a complaint on the Income Tax portal.",
      "Go to the nearest Aayakar Seva Kendra (ASK).",
      "Contact the Ombudsman."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "टैक्स हेल्पलाइन",
        number: "1800-103-0025"
      }
    ],
    legal_sections: [
      "Income Tax Act 1961 Section 237, 246, 264"
    ]
  },
  labor_rights: {
    id: "labor_rights_detail",
    category_id: "labor_rights",
    title_hindi: "श्रम अधिकार - मजदूरों की सुरक्षा",
    title_english: "Labor Rights - Protection for Workers",
    content_hindi: "भारतीय श्रम कानूनों के तहत हर मजदूर को सुरक्षित वातावरण और उचित वेतन का अधिकार है। औद्योगिक विवाद अधिनियम के तहत आप अपने शोषण के विरुद्ध शिकायत कर सकते हैं।",
    content_english: "Under Indian labor laws, every worker has the right to a safe environment and fair wages. You can complain against your exploitation under the Industrial Disputes Act.",
    key_rights_hindi: [
      "पी.एफ. और ई.एस.आई. (PF, ESI) का अधिकार",
      "ओवरटाइम भुगतान (Overtime Payment) का हक",
      "सवैतनिक छुट्टियों का अधिकार",
      "सुरक्षित कार्यस्थल (Safe Workplace) का हक",
      "न्यूनतम वेतन पाने का अधिकार"
    ],
    key_rights_english: [
      "Right to PF and ESI",
      "Right to overtime payment",
      "Right to paid leaves",
      "Right to a safe workplace",
      "Right to minimum wages"
    ],
    action_steps_hindi: [
      "श्रम सुविधा पोर्टल (shramsuvidha.gov.in) पर शिकायत करें।",
      "लेबर कमिश्नर (Labour Commissioner) से मिलें।",
      "अपनी यूनियन के माध्यम से आवाज उठाएं।"
    ],
    action_steps_english: [
      "Complain on shramsuvidha.gov.in",
      "Meet the Labour Commissioner.",
      "Raise your voice through your union."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "लेबर हेल्पलाइन",
        number: "1800-11-2228"
      }
    ],
    legal_sections: [
      "Labour Codes 2020",
      "Factories Act 1948",
      "ESI Act 1948"
    ]
  },
  religious_rights: {
    id: "religious_rights_detail",
    category_id: "religious_rights",
    title_hindi: "धार्मिक अधिकार - आस्था की स्वतंत्रता",
    title_english: "Religious Rights - Freedom of Faith",
    content_hindi: "संविधान के अनुच्छेद 25-28 के तहत हर नागरिक को अपने धर्म को मानने, आचरण करने और प्रचार करने की स्वतंत्रता है। जबरन धर्म परिवर्तन कानूनी रूप से प्रतिबंधित है।",
    content_english: "Under Articles 25-28 of the Constitution, every citizen has the freedom to profess, practice, and propagate their religion. Forced conversion is legally prohibited.",
    key_rights_hindi: [
      "अपनी पसंद का धर्म चुनने का अधिकार",
      "धार्मिक स्थल बनाने और प्रबंध करने का हक",
      "जबरन धर्म परिवर्तन से सुरक्षा",
      "धार्मिक शिक्षा पाना या न पाना (विकल्प)",
      "धार्मिक कर (Tax) से मुक्ति का अधिकार"
    ],
    key_rights_english: [
      "Right to choose religion of choice",
      "Right to build and manage religious places",
      "Protection from forced conversion",
      "Option to receive or not receive religious education",
      "Right to freedom from religious taxes"
    ],
    action_steps_hindi: [
      "पुलिस स्टेशन में FIR दर्ज कराएं।",
      "जिला मजिस्ट्रेट (DM) को आवेदन दें।",
      "धार्मिक संस्थाओं से कानूनी मदद लें।"
    ],
    action_steps_english: [
      "File an FIR at the police station.",
      "Submit an application to the District Magistrate (DM).",
      "Take legal help from religious organizations."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "पुलिस",
        number: "112"
      }
    ],
    legal_sections: [
      "Constitution Article 25, 26, 27, 28"
    ]
  },
  media_rights: {
    id: "media_rights_detail",
    category_id: "media_rights",
    title_hindi: "मीडिया अधिकार - अभिव्यक्ति की स्वतंत्रता",
    title_english: "Media Rights - Freedom of Expression",
    content_hindi: "प्रेस की स्वतंत्रता संविधान के अनुच्छेद 19(1)(a) का हिस्सा है। मीडिया को लोकहित के समाचार प्रकाशित करने और सत्ता से सवाल पूछने का अधिकार है। पत्रकारों की सुरक्षा के लिए विशेष कानून और दिशा-निर्देश मौजूद हैं।",
    content_english: "Freedom of the press is part of Article 19(1)(a) of the Constitution. Media has the right to publish news of public interest and question the authorities. Special laws and guidelines exist for the protection of journalists.",
    key_rights_hindi: [
      "समाचार प्रकाशित करने का अधिकार",
      "सूत्रों (Sources) को गोपनीय रखने का अधिकार",
      "सेंसरशिप (Censorship) से सुरक्षा का हक",
      "सूचना के अधिकार (RTI) के तहत जानकारी पाने का हक",
      "निष्पक्ष रिपोर्टिंग के लिए सुरक्षा का अधिकार"
    ],
    key_rights_english: [
      "Right to publish news",
      "Right to keep sources confidential",
      "Right to protection from censorship",
      "Right to get information under RTI",
      "Right to protection for fair reporting"
    ],
    action_steps_hindi: [
      "प्रेस काउंसिल ऑफ इंडिया (PCI) में शिकायत दर्ज करें।",
      "पुलिस द्वारा उत्पीड़न होने पर अदालत की शरण लें।",
      "अपनी संस्था (Press Club) या यूनियन से मदद लें।"
    ],
    action_steps_english: [
      "File a complaint with the Press Council of India (PCI).",
      "Seek court intervention in case of police harassment.",
      "Take help from your press club or union."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "PCI",
        number: "011-23715401"
      }
    ],
    legal_sections: [
      "Constitution Article 19(1)(a)",
      "Press Council Act 1978"
    ]
  },
  nri_rights: {
    id: "nri_rights_detail",
    category_id: "nri_rights",
    title_hindi: "NRI अधिकार - अनिवासी भारतीयों के कानूनी अधिकार",
    title_english: "NRI Rights - Legal Rights of Non-Resident Indians",
    content_hindi: "अनिवासी भारतीयों (NRI) को भारत में संपत्ति खरीदने, निवेश करने और कानूनी सुरक्षा पाने का पूरा अधिकार है। ओसीआई (OCI) कार्ड धारकों को भी भारत में रहने और काम करने के विशेष अधिकार मिलते हैं।",
    content_english: "Non-Resident Indians (NRI) have the full right to buy property, invest, and get legal protection in India. OCI card holders also get special rights to live and work in India.",
    key_rights_hindi: [
      "भारत में कृषि भूमि को छोड़कर अन्य संपत्ति खरीदने का अधिकार",
      "OCI कार्ड के माध्यम से आजीवन वीजा-मुक्त यात्रा का हक",
      "भारत में चुनाव के दौरान मतदान (Voting) करने का अधिकार",
      "NRE/NRO बैंक खाते खोलने और प्रबंध करने का हक",
      "विरासत में मिली संपत्ति पर पूर्ण मालिकाना हक"
    ],
    key_rights_english: [
      "Right to buy property in India (except agricultural land)",
      "Right to life-long visa-free travel via OCI card",
      "Right to vote during elections in India",
      "Right to open and manage NRE/NRO bank accounts",
      "Full ownership rights on inherited property"
    ],
    action_steps_hindi: [
      "MEA के 'मदद' (MADAD) पोर्टल पर पंजीकरण करें।",
      "नजदीकी भारतीय दूतावास (Embassy) से संपर्क करें।",
      "भारत में संपत्ति संबंधी विवादों के लिए पावर ऑफ अटॉर्नी (PoA) बनवाएं।"
    ],
    action_steps_english: [
      "Register on the MEA's MADAD portal.",
      "Contact the nearest Indian Embassy.",
      "Get a Power of Attorney (PoA) made for property disputes in India."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "MEA हेल्पलाइन",
        number: "1800-11-3090"
      }
    ],
    legal_sections: [
      "FEMA 1999",
      "Citizenship Act 1955",
      "RBI NRI Guidelines"
    ]
  },
  student_rights: {
    id: "student_rights_detail",
    category_id: "student_rights",
    title_hindi: "छात्र अधिकार - शिक्षा और सम्मान",
    title_english: "Student Rights - Education and Dignity",
    content_hindi: "विद्यार्थियों को शैक्षणिक संस्थानों में भयमुक्त वातावरण, गरिमा और उचित मूल्यांकन का अधिकार है। रैगिंग एक दंडनीय अपराध है और इसके विरुद्ध संस्थानों को सख्त कदम उठाने अनिवार्य हैं।",
    content_english: "Students have the right to a fear-free environment, dignity, and fair evaluation in educational institutions. Ragging is a punishable offense, and institutions must take strict steps against it.",
    key_rights_hindi: [
      "रैगिंग (Ragging) से पूर्ण सुरक्षा का अधिकार",
      "बिना कारण टी.सी. (TC) या डिग्री न रोकने का अधिकार",
      "निष्पक्ष मूल्यांकन (Fair Evaluation) का हक",
      "छात्रवृत्ति (Scholarship) और आरक्षण का लाभ पाने का हक",
      "संस्थान की समितियों में प्रतिनिधित्व का अधिकार"
    ],
    key_rights_english: [
      "Right to full protection from ragging",
      "Right not to have TC or Degree withheld without reason",
      "Right to fair evaluation",
      "Right to receive scholarship and reservation benefits",
      "Right to representation in institutional committees"
    ],
    action_steps_hindi: [
      "रैगिंग होने पर antiragging.in पर तुरंत रिपोर्ट करें।",
      "यूजीसी (UGC) की हेल्पलाइन पर कॉल करें।",
      "संस्थान की आंतरिक शिकायत समिति (ICC) में शिकायत दर्ज करें।"
    ],
    action_steps_english: [
      "Report ragging immediately on antiragging.in.",
      "Call the UGC helpline.",
      "File a complaint with the institution's Internal Complaint Committee (ICC)."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "एंटी-रैगिंग",
        number: "1800-180-5522"
      }
    ],
    legal_sections: [
      "UGC Anti-Ragging Regulations",
      "RTE Act 2009"
    ]
  },
  prisoner_rights: {
    id: "prisoner_rights_detail",
    category_id: "prisoner_rights",
    title_hindi: "कैदी अधिकार - मानवाधिकार और न्याय",
    title_english: "Prisoner Rights - Human Rights and Justice",
    content_hindi: "जेल में बंद व्यक्तियों के भी मानवाधिकार खत्म नहीं होते। उन्हें गरिमापूर्ण जीवन, चिकित्सा और कानूनी सहायता पाने का पूरा अधिकार है। हिरासत में प्रताड़ना (Custodial Torture) कानूनन जुर्म है।",
    content_english: "Human rights of persons in prison do not end. They have the full right to a dignified life, medical care, and legal aid. Custodial torture is a crime by law.",
    key_rights_hindi: [
      "अपने वकील से मिलने और कानूनी सलाह लेने का अधिकार",
      "उचित चिकित्सा सुविधा (Medical Facility) पाने का हक",
      "परिवार के सदस्यों से नियमित मुलाकात करने का हक",
      "जमानत (Bail) के लिए आवेदन करने का वैधानिक अधिकार",
      "मुफ्त कानूनी सहायता (Free Legal Aid) पाने का हक"
    ],
    key_rights_english: [
      "Right to meet lawyer and take legal advice",
      "Right to get proper medical facilities",
      "Right to meet family members regularly",
      "Statutory right to apply for bail",
      "Right to receive free legal aid"
    ],
    action_steps_hindi: [
      "जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें।",
      "राष्ट्रीय मानवाधिकार आयोग (NHRC) में शिकायत करें।",
      "जेलर या संबंधित मजिस्ट्रेट को अपनी समस्या बताएं।"
    ],
    action_steps_english: [
      "Contact the District Legal Services Authority (DLSA).",
      "Complain to the National Human Rights Commission (NHRC).",
      "Tell your problem to the Jailer or the concerned Magistrate."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "लीगल एड",
        number: "15100"
      }
    ],
    legal_sections: [
      "Prison Act 1894",
      "BNSS 478",
      "Constitution Article 21"
    ]
  },
  animal_rights: {
    id: "animal_rights_detail",
    category_id: "animal_rights",
    title_hindi: "पशु अधिकार - बेजुबानों की सुरक्षा",
    title_english: "Animal Rights - Protection for Voiceless",
    content_hindi: "पशुओं के प्रति क्रूरता रोकना हर नागरिक का कर्तव्य है। भारतीय कानून पशुओं को भी जीने और पीड़ा से मुक्त रहने का अधिकार देता है। उन्हें मारना या प्रताड़ित करना दंडनीय अपराध है।",
    content_english: "Preventing cruelty to animals is the duty of every citizen. Indian law also gives animals the right to live and be free from suffering. Killing or torturing them is a punishable offense.",
    key_rights_hindi: [
      "पशुओं के साथ क्रूरता के विरुद्ध शिकायत का अधिकार",
      "आवारा पशुओं (Stray Animals) को भोजन और सुरक्षा पाने का हक",
      "वन्य जीवों के संरक्षण और शिकार के विरुद्ध सुरक्षा",
      "पशु बलि (Animal Sacrifice) पर कानूनी रोक",
      "घायल पशुओं के लिए चिकित्सा सहायता पाने का हक"
    ],
    key_rights_english: [
      "Right to complain against cruelty to animals",
      "Right of stray animals to get food and protection",
      "Protection of wildlife and safety against hunting",
      "Legal ban on animal sacrifice",
      "Right to get medical aid for injured animals"
    ],
    action_steps_hindi: [
      "एनिमल वेलफेयर बोर्ड (AWBI) को शिकायत भेजें।",
      "पुलिस स्टेशन में FIR दर्ज कराएं।",
      "स्थानीय पशु क्रूरता निवारण संस्था (SPCA) से मदद लें।"
    ],
    action_steps_english: [
      "Send a complaint to the Animal Welfare Board (AWBI).",
      "File an FIR at the police station.",
      "Take help from the local Society for the Prevention of Cruelty to Animals (SPCA)."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "पशु हेल्पलाइन",
        number: "1962"
      }
    ],
    legal_sections: [
      "Prevention of Cruelty to Animals Act 1960",
      "BNS 325"
    ]
  },
  internet_rights: {
    id: "internet_rights_detail",
    category_id: "internet_rights",
    title_hindi: "इंटरनेट अधिकार - डिजिटल स्वतंत्रता",
    title_english: "Internet Rights - Digital Freedom",
    content_hindi: "डिजिटल युग में इंटरनेट तक पहुंच और ऑनलाइन सुरक्षा एक अनिवार्य अधिकार बन गया है। सुप्रीम कोर्ट के अनुसार, इंटरनेट का उपयोग अभिव्यक्ति की स्वतंत्रता का हिस्सा है।",
    content_english: "In the digital age, access to the internet and online safety has become an essential right. According to the Supreme Court, use of the internet is part of the freedom of expression.",
    key_rights_hindi: [
      "इंटरनेट शटडाउन (Shutdown) के विरुद्ध अपील का अधिकार",
      "डेटा की गोपनीयता और सुरक्षा का अधिकार",
      "ऑनलाइन अभिव्यक्ति की स्वतंत्रता का हक",
      "इंटरनेट सेवा प्रदाताओं से पारदर्शी सर्विस का हक",
      "साइबर अपराधों से सुरक्षा का अधिकार"
    ],
    key_rights_english: [
      "Right to appeal against internet shutdown",
      "Right to data confidentiality and security",
      "Right to freedom of online expression",
      "Right to transparent service from internet service providers",
      "Right to protection from cyber crimes"
    ],
    action_steps_hindi: [
      "साइबर अपराध होने पर 'cybercrime.gov.in' पर रिपोर्ट करें।",
      "इंटरनेट सेवाओं में समस्या होने पर TRAI को शिकायत करें।",
      "सोशल मीडिया पर उत्पीड़न होने पर प्लेटफॉर्म के रिपोर्ट टूल का उपयोग करें।"
    ],
    action_steps_english: [
      "Report cyber crime on 'cybercrime.gov.in'.",
      "Complain to TRAI in case of problems in internet services.",
      "Use the platform's report tool in case of harassment on social media."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "साइबर हेल्पलाइन",
        number: "1930"
      }
    ],
    legal_sections: [
      "IT Act 2000",
      "DPDP Act 2023",
      "Constitution Article 19"
    ]
  },
  refugee_rights: {
    id: "refugee_rights_detail",
    category_id: "refugee_rights",
    title_hindi: "शरणार्थी अधिकार - मानवीय संरक्षण",
    title_english: "Refugee Rights - Humanitarian Protection",
    content_hindi: "भारत में शरण लेने वाले व्यक्तियों को मानवीय और कानूनी संरक्षण का अधिकार है। अनुच्छेद 21 के तहत उन्हें भी जीवन की सुरक्षा और गरिमापूर्ण जीवन का अधिकार मिलता है।",
    content_english: "Persons taking refuge in India have the right to humanitarian and legal protection. Under Article 21, they also get the right to life protection and a dignified life.",
    key_rights_hindi: [
      "बिना कानूनी प्रक्रिया के निष्कासन (Eviction) से सुरक्षा",
      "UNHCR के माध्यम से शरणार्थी प्रमाण पत्र पाने का हक",
      "मानवीय सहायता और बुनियादी चिकित्सा का हक",
      "कानूनी सहायता और वकीलों तक पहुंच का अधिकार",
      "बच्चों के लिए प्राथमिक शिक्षा का अधिकार"
    ],
    key_rights_english: [
      "Protection from eviction without legal process",
      "Right to get refugee certificate through UNHCR",
      "Right to humanitarian aid and basic medical care",
      "Right to legal aid and access to lawyers",
      "Right to primary education for children"
    ],
    action_steps_hindi: [
      "UNHCR इंडिया ऑफिस से संपर्क कर पंजीकरण कराएं।",
      "कानूनी मदद के लिए विधिक सेवा प्राधिकरण से संपर्क करें।",
      "स्थानीय प्रशासन को अपनी स्थिति की जानकारी दें।"
    ],
    action_steps_english: [
      "Contact the UNHCR India office and register.",
      "Contact the Legal Services Authority for legal help.",
      "Inform the local administration about your situation."
    ],
    steps_hindi: [],
    steps_english: [],
    emergency_contacts: [
      {
        name: "UNHCR",
        number: "011-46070400"
      }
    ],
    legal_sections: [
      "Foreigners Act 1946",
      "Constitution Article 14, 21"
    ]
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

// Create axios-like API client for backend calls
const API_BASE_URL = Config.API_URL;

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 30000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

// Chat API
export const chatAPI = {
  sendMessage: async (_sessionId: string, message: string, language: string = 'hi') => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language: language
      }),
    });
    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }
    const data = await response.json();
    return { message_id: data.message_id, response: data.response };
  },
};

const api = {
  post: async (endpoint: string, data: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return {
      data: await response.json(),
    };
  },

  get: async (endpoint: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return {
      data: await response.json(),
    };
  },
};

export default api;
