import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

export default function PropertyGuideScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#141B3C' : '#F5F5F5';
  const cardBg = isDark ? '#1C2340' : '#FFFFFF';
  const textColor = isDark ? '#F0F2FF' : '#1a237e';
  const subText = isDark ? '#8A95C0' : '#666666';
  const orange = '#E8610A';
  const [expanded, setExpanded] = useState(null);
  const t = (hi, en) => language === 'hi' ? hi : en;

  const ISSUES = [
    {
      id: 1, icon: '🏚️',
      title: t('अवैध कब्जा', 'Illegal Possession'),
      desc: t('किसी ने आपकी जमीन पर जबरदस्ती कब्जा कर लिया है', 'Someone has forcefully occupied your land'),
      steps: [
        t('तुरंत नजदीकी Police Station में FIR दर्ज करें — BNS धारा 329 (अतिक्रमण) के तहत। FIR की कॉपी अवश्य लें।', 'Immediately file FIR at nearest Police Station under BNS Section 329 (trespass). Always get a copy of FIR.'),
        t('Tahsildar/SDM को लिखित शिकायत दें — जमीन के सभी कागज लगाएं। 30 दिन में कार्रवाई होनी चाहिए।', 'Give written complaint to Tahsildar/SDM with all land documents. Action must happen within 30 days.'),
        t('Civil Court में Suit for Possession file करें। वकील के बिना भी खुद कर सकते हैं।', 'File Suit for Possession in Civil Court. You can do it yourself even without a lawyer.'),
        t('अगर कब्जा 12 साल से कम है तो Adverse Possession का खतरा नहीं — तुरंत कार्रवाई करें।', 'If possession is less than 12 years, no risk of Adverse Possession — act immediately.'),
        t('Revenue Court में दावा करें — Collector के यहां। यह सस्ता और तेज है।', 'File claim in Revenue Court — at Collector office. This is cheaper and faster.'),
        t('सभी जमीन के कागज — खतौनी, खसरा, Registry — की certified copy बनवाएं और सुरक्षित रखें।', 'Get certified copies of all land documents — Khatauni, Khasra, Registry — and keep them safe.'),
      ],
      docs: [
        t('खतौनी / खसरा (भूमि अभिलेख)', 'Khatauni / Khasra (Land Records)'),
        t('Registry / Sale Deed की certified copy', 'Certified copy of Registry / Sale Deed'),
        t('Property Tax Receipts (पिछले 5 साल)', 'Property Tax Receipts (last 5 years)'),
        t('कब्जे के Photos और Videos (date/time के साथ)', 'Photos and Videos of encroachment (with date/time)'),
        t('गवाहों के बयान (Witness Statements)', 'Witness Statements'),
        t('Aadhaar / Voter ID (पहचान प्रमाण)', 'Aadhaar / Voter ID (Identity Proof)'),
      ],
      rights: t('आपको यह अधिकार है कि कोई भी आपकी जमीन पर बिना आपकी सहमति के कब्जा नहीं कर सकता। Article 300A के तहत संपत्ति का अधिकार एक कानूनी अधिकार है।', 'You have the right that no one can occupy your land without your consent. Right to property is a legal right under Article 300A.'),
      helpline: '112',
      law: 'BNS 329, 331 | Specific Relief Act 1963 | Article 300A',
      url: 'https://upbhulekh.gov.in',
      urlLabel: t('UP Bhulekh — जमीन रिकॉर्ड', 'UP Bhulekh — Land Records'),
    },
    {
      id: 2, icon: '👨‍👩‍👧',
      title: t('पारिवारिक संपत्ति विवाद', 'Family Property Dispute'),
      desc: t('पिता/दादा की संपत्ति में हिस्से को लेकर झगड़ा', 'Dispute over share in father/grandfather property'),
      steps: [
        t('पहले परिवार में बातचीत और समझौते की कोशिश करें — Mediation सबसे सस्ता रास्ता है।', 'First try family discussion and settlement — Mediation is the cheapest route.'),
        t('District Court के Mediation Centre जाएं — यह मुफ्त है और 3-6 महीने में हल होता है।', 'Go to Mediation Centre at District Court — it is free and resolves in 3-6 months.'),
        t('Partition Suit file करें Civil Court में — सभी हिस्सेदारों को party बनाएं।', 'File Partition Suit in Civil Court — make all sharers parties.'),
        t('बेटियों का पैतृक संपत्ति में बराबर हक है — Hindu Succession Act 2005 के बाद यह कानून है।', 'Daughters have equal right in ancestral property — this is law after Hindu Succession Act 2005.'),
        t('Will/वसीयतनामा है तो Probate के लिए High Court में दाखिल करें।', 'If Will exists, file for Probate in High Court.'),
        t('Legal Aid से मुफ्त वकील लें — DLSA office जाएं, BPL card या low income वाले eligible हैं।', 'Get free lawyer from Legal Aid — go to DLSA office, those with BPL card or low income are eligible.'),
      ],
      docs: [
        t('मृत्यु प्रमाण पत्र (Death Certificate)', 'Death Certificate'),
        t('Family Tree Affidavit (नोटरी से)', 'Family Tree Affidavit (Notarized)'),
        t('संपत्ति के सभी कागज', 'All Property Documents'),
        t('Will / वसीयतनामा (अगर है)', 'Will (if exists)'),
        t('सभी वारिसों के Aadhaar', 'Aadhaar of all legal heirs'),
        t('पिछले कानूनी कागज — पुरानी Registry आदि', 'Previous legal documents — old Registry etc.'),
      ],
      rights: t('Hindu Succession Act 1956 (2005 में संशोधित) के तहत बेटियों को बेटों के बराबर पैतृक संपत्ति में हिस्सा मिलने का अधिकार है।', 'Under Hindu Succession Act 1956 (amended 2005), daughters have equal right to ancestral property as sons.'),
      helpline: '15100',
      law: 'Hindu Succession Act 1956 (2005 Amendment) | Partition Act 1893',
      url: 'https://services.ecourts.gov.in',
      urlLabel: t('eCourts — Case Status', 'eCourts — Case Status'),
    },
    {
      id: 3, icon: '🏗️',
      title: t('Builder ने धोखा दिया', 'Builder Fraud'),
      desc: t('पैसे लिए, flat/plot नहीं दिया या देरी कर रहा है', 'Took money, did not give flat/plot or is delaying'),
      steps: [
        t('RERA portal पर तुरंत complaint दर्ज करें — 60 दिन में सुनवाई होती है, जुर्माना और refund मिल सकता है।', 'Immediately file complaint on RERA portal — hearing within 60 days, can get penalty and refund.'),
        t('Builder को Registered Post से Legal Notice भेजें — 15 दिन का समय दें, फिर court जाएं।', 'Send Legal Notice to builder via Registered Post — give 15 days time, then go to court.'),
        t('Consumer Forum में complaint दर्ज करें — ₹50 लाख तक के cases District Forum में जाते हैं।', 'File complaint in Consumer Forum — cases up to ₹50 lakh go to District Forum.'),
        t('RERA registration check करें — unregistered builder के खिलाफ criminal case हो सकता है।', 'Check RERA registration — criminal case possible against unregistered builder.'),
        t('Police में FIR दर्ज करें — BNS Section 318 (धोखाधड़ी/Cheating) के तहत।', 'File FIR with Police under BNS Section 318 (Cheating/Fraud).'),
        t('High Court में Writ Petition दाखिल करें अगर RERA काम न करे।', 'File Writ Petition in High Court if RERA does not work.'),
      ],
      docs: [
        t('Agreement to Sale / Allotment Letter', 'Agreement to Sale / Allotment Letter'),
        t('सभी Payment Receipts', 'All Payment Receipts'),
        t('Builder का Brochure / Advertisement', 'Builder Brochure / Advertisement'),
        t('Builder से सभी Correspondence (emails, letters)', 'All Correspondence with Builder (emails, letters)'),
        t('RERA Registration Number', 'RERA Registration Number'),
        t('Bank statements (payments के लिए)', 'Bank statements (for payments)'),
      ],
      rights: t('RERA Act 2016 के तहत आपको समय पर possession पाने का अधिकार है। देरी पर builder को interest देना होता है। Refund का भी अधिकार है।', 'Under RERA Act 2016, you have right to get possession on time. Builder must pay interest for delay. You also have right to refund.'),
      helpline: '1800-180-3770',
      law: 'RERA Act 2016 | Consumer Protection Act 2019 | BNS 318',
      url: 'https://up-rera.in',
      urlLabel: t('UP RERA — Complaint Portal', 'UP RERA — Complaint Portal'),
    },
    {
      id: 4, icon: '📋',
      title: t('जमीन Registry / Mutation', 'Land Registry / Mutation'),
      desc: t('नई जमीन खरीदी, Mutation (दाखिल खारिज) नहीं हो रहा', 'Bought new land, Mutation not happening'),
      steps: [
        t('Tehsil office में Mutation application दें — Form भरें, Required documents लगाएं।', 'Submit Mutation application at Tehsil office — fill form, attach required documents.'),
        t('Online: UP Bhulekh portal पर application track करें।', 'Online: Track application on UP Bhulekh portal.'),
        t('30 दिन में Mutation होना चाहिए — न हो तो SDM को written complaint दें।', 'Mutation must happen in 30 days — if not, give written complaint to SDM.'),
        t('CM Helpline 1076 पर complaint करें — 24 घंटे में response आता है।', 'Complain on CM Helpline 1076 — response comes within 24 hours.'),
        t('RTI से application का status पूछें — 30 दिन में जवाब mandatory है।', 'Ask application status via RTI — reply mandatory in 30 days.'),
        t('Stamp Duty और Registration Fee सही भरी है या नहीं check करें।', 'Check if Stamp Duty and Registration Fee have been paid correctly.'),
      ],
      docs: [
        t('Registered Sale Deed की certified copy', 'Certified copy of Registered Sale Deed'),
        t('Aadhaar Card / Voter ID', 'Aadhaar Card / Voter ID'),
        t('पुरानी Khatauni (विक्रेता की)', 'Old Khatauni (of seller)'),
        t('Stamp Duty Receipt', 'Stamp Duty Receipt'),
        t('NOC from seller (अगर applicable)', 'NOC from seller (if applicable)'),
        t('Passport size photos', 'Passport size photos'),
      ],
      rights: t('Registration Act 1908 के तहत registered sale deed के बाद Mutation आपका कानूनी अधिकार है। 30 दिन में न हो तो अधिकारी जिम्मेदार है।', 'After registered sale deed, Mutation is your legal right under Registration Act 1908. If not done in 30 days, officer is responsible.'),
      helpline: '1076',
      law: 'Registration Act 1908 | UP Revenue Code 2006',
      url: 'https://upbhulekh.gov.in',
      urlLabel: t('UP Bhulekh Portal', 'UP Bhulekh Portal'),
    },
    {
      id: 5, icon: '🌾',
      title: t('सरकारी जमीन अधिग्रहण', 'Government Land Acquisition'),
      desc: t('सरकार ने जमीन ली, मुआवजा कम दिया या नहीं दिया', 'Government took land, gave less or no compensation'),
      steps: [
        t('Collector के यहां objection petition दाखिल करें — 30 दिन की समयसीमा है।', 'File objection petition at Collector office — deadline is 30 days.'),
        t('Reference Court में Reference case file करें — बाजार मूल्य से 4 गुना मुआवजे का अधिकार है।', 'File Reference case in Reference Court — right to 4x market value compensation.'),
        t('DLSA office से मुफ्त Legal Aid लें — BPL परिवारों को मुफ्त वकील मिलता है।', 'Get free Legal Aid from DLSA office — BPL families get free lawyer.'),
        t('Social Impact Assessment Report RTI से मांगें — यह public document है।', 'Request Social Impact Assessment Report via RTI — it is a public document.'),
        t('High Court में Writ Petition दाखिल करें अगर process गलत हो।', 'File Writ Petition in High Court if process is wrong.'),
        t('Gram Sabha की NOC जरूरी है — बिना उसके tribal land अधिग्रहण गैरकानूनी है।', 'Gram Sabha NOC is mandatory — tribal land acquisition without it is illegal.'),
      ],
      docs: [
        t('Award Notice की copy', 'Copy of Award Notice'),
        t('जमीन के सभी Records', 'All Land Records'),
        t('Market Value proof (nearby sales)', 'Market Value proof (nearby sales)'),
        t('RTI application copy', 'RTI application copy'),
        t('Objection petition की copy', 'Copy of objection petition'),
        t('Family ID / Ration Card', 'Family ID / Ration Card'),
      ],
      rights: t('RFCTLARR Act 2013 के तहत आपको उचित मुआवजा, पुनर्वास और पुनर्स्थापना का अधिकार है। बाजार मूल्य का 2-4 गुना मुआवजा मिलना चाहिए।', 'Under RFCTLARR Act 2013, you have right to fair compensation, rehabilitation and resettlement. Compensation should be 2-4 times market value.'),
      helpline: '1800-11-0031',
      law: 'RFCTLARR Act 2013 | Constitution Article 300A',
      url: 'https://rtionline.gov.in',
      urlLabel: t('RTI Online — File करें', 'RTI Online — File Now'),
    },
    {
      id: 6, icon: '🏠',
      title: t('किरायेदार बेदखली', 'Tenant Eviction'),
      desc: t('मकान मालिक बिना नोटिस घर खाली करवा रहा है', 'Landlord forcing to vacate without notice'),
      steps: [
        t('बिना 15 दिन के लिखित notice के बेदखली गैरकानूनी है — notice की demand करें।', 'Eviction without 15 days written notice is illegal — demand notice.'),
        t('Rent Controller के यहां complaint दें — यह District Court में होता है।', 'File complaint with Rent Controller — located in District Court.'),
        t('Police में शिकायत दें — BNS 329 के तहत जबरन बेदखली FIR-able offense है।', 'Complain to Police — forceful eviction is FIR-able offense under BNS 329.'),
        t('Civil Court में Injunction लें — मकान मालिक को रोका जा सकता है।', 'Get Injunction from Civil Court — landlord can be stopped.'),
        t('Legal Aid से मुफ्त वकील लें — DLSA office से।', 'Get free lawyer from Legal Aid — from DLSA office.'),
        t('किराया समय पर जमा करें और हमेशा receipt लें — यह आपकी सुरक्षा है।', 'Pay rent on time and always get receipt — this is your protection.'),
      ],
      docs: [
        t('Rent Agreement की copy', 'Copy of Rent Agreement'),
        t('सभी Rent Receipts', 'All Rent Receipts'),
        t('Aadhaar / Voter ID', 'Aadhaar / Voter ID'),
        t('मकान मालिक का notice (अगर दिया हो)', 'Landlord notice (if given)'),
        t('किराये के bank transfer records', 'Bank transfer records of rent'),
        t('Electricity/Water bill (निवास का proof)', 'Electricity/Water bill (proof of residence)'),
      ],
      rights: t('UP Urban Buildings Act 1972 के तहत किरायेदार को proper notice और court order के बिना नहीं निकाला जा सकता। आपको court में सुनवाई का अधिकार है।', 'Under UP Urban Buildings Act 1972, tenant cannot be evicted without proper notice and court order. You have right to hearing in court.'),
      helpline: '15100',
      law: 'UP Urban Buildings (Regulation of Letting) Act 1972 | BNS 329',
      url: 'https://services.ecourts.gov.in',
      urlLabel: t('Civil Court — Injunction', 'Civil Court — Injunction'),
    },
    {
      id: 7, icon: '🏦',
      title: t('Loan / ऋण संबंधी अधिकार', 'Loan / Debt Rights'),
      desc: t('Bank या NBFC से loan लिया है — नियम और अधिकार जानें', 'Took loan from Bank or NBFC — know rules and rights'),
      steps: [
        t('Loan लेते समय: सभी terms and conditions ध्यान से पढ़ें — Interest Rate, Processing Fee, Prepayment charges।', 'While taking loan: Read all terms and conditions carefully — Interest Rate, Processing Fee, Prepayment charges.'),
        t('EMI miss होने पर: Bank तुरंत contact करें — restructuring या moratorium का option मांगें।', 'On missing EMI: Contact bank immediately — ask for restructuring or moratorium option.'),
        t('Recovery agents के नियम: सुबह 7 बजे से शाम 7 बजे तक ही contact कर सकते हैं — रात को harassment गैरकानूनी है।', 'Recovery agent rules: Can contact only between 7 AM to 7 PM — harassment at night is illegal.'),
        t('SARFAESI के तहत property जब्त होने से पहले 60 दिन का notice mandatory है।', 'Under SARFAESI, 60 days notice is mandatory before property seizure.'),
        t('RBI Ombudsman में complaint करें — bank की गलती पर मुफ्त में सुनवाई होती है।', 'Complain to RBI Ombudsman — free hearing on bank mistakes.'),
        t('Loan settlement: Bank से One Time Settlement (OTS) का option मांगें — कम amount में settlement हो सकती है।', 'Loan settlement: Ask bank for One Time Settlement (OTS) option — can settle in lesser amount.'),
      ],
      docs: [
        t('Loan Agreement / Sanction Letter', 'Loan Agreement / Sanction Letter'),
        t('सभी EMI receipts / Bank statements', 'All EMI receipts / Bank statements'),
        t('Bank के सभी notices की copy', 'Copy of all bank notices'),
        t('Aadhaar / PAN Card', 'Aadhaar / PAN Card'),
        t('Property documents (अगर secured loan है)', 'Property documents (if secured loan)'),
        t('Recovery agent की harassment का proof (recording/screenshot)', 'Proof of recovery agent harassment (recording/screenshot)'),
      ],
      rights: t('RBI guidelines के तहत: (1) Recovery agent raat को harass नहीं कर सकता, (2) 60 दिन notice के बिना property नहीं ली जा सकती, (3) आपको loan account की पूरी statement का अधिकार है, (4) Credit score गलत है तो सुधरवाने का अधिकार है।', 'Under RBI guidelines: (1) Recovery agent cannot harass at night, (2) Property cannot be taken without 60 days notice, (3) You have right to complete loan account statement, (4) Right to correct wrong credit score.'),
      helpline: '14440',
      law: 'SARFAESI Act 2002 | RBI Guidelines | Consumer Protection Act 2019',
      url: 'https://cms.rbi.org.in',
      urlLabel: t('RBI Ombudsman — Complaint', 'RBI Ombudsman — Complaint'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>🏘️ {t('संपत्ति व Loan गाइड', 'Property & Loan Guide')}</Text>
          <Text style={{ color: '#AABBCC', fontSize: 11 }}>{t('Property & Loan Guide', 'संपत्ति और ऋण गाइड')}</Text>
        </View>
        <HeaderToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: isDark ? '#0D2A1B' : '#E8F5E9', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#00AA44' }}>
          <Text style={{ color: isDark ? '#88FFAA' : '#006622', fontWeight: 'bold', fontSize: 13 }}>
            ⚠️ {t('महत्वपूर्ण जानकारी', 'Important Information')}
          </Text>
          <Text style={{ color: isDark ? '#AACCBB' : '#444', fontSize: 12, marginTop: 4, lineHeight: 18 }}>
            {t('भारत में 66% civil cases संपत्ति से जुड़े हैं। अपनी समस्या चुनें और तुरंत क्या करना है जानें। सभी जानकारी Indian law पर आधारित है।', 'In India, 66% civil cases are property-related. Choose your problem and know what to do immediately. All information is based on Indian law.')}
          </Text>
        </View>

        {ISSUES.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: expanded === item.id ? 2 : 0.5, borderColor: expanded === item.id ? orange : (isDark ? 'rgba(255,255,255,0.08)' : '#E0E0E0') }}
            onPress={() => setExpanded(expanded === item.id ? null : item.id)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: subText, fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
              </View>
              <Text style={{ color: orange, fontSize: 16 }}>{expanded === item.id ? '▲' : '▼'}</Text>
            </View>

            {expanded === item.id && (
              <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>

                <View style={{ backgroundColor: isDark ? '#1a2a1a' : '#f0fff4', borderRadius: 8, padding: 10, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#22C55E' }}>
                  <Text style={{ color: isDark ? '#88FFAA' : '#166534', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>⚖️ {t('आपका अधिकार', 'Your Right')}</Text>
                  <Text style={{ color: isDark ? '#AACCBB' : '#166534', fontSize: 12, lineHeight: 18 }}>{item.rights}</Text>
                </View>

                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>📋 {t('तुरंत क्या करें:', 'Immediate Steps:')}</Text>
                {item.steps.map((step, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' }}>
                    <View style={{ backgroundColor: orange, borderRadius: 12, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0, marginTop: 1 }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{i + 1}</Text>
                    </View>
                    <Text style={{ color: subText, fontSize: 12, flex: 1, lineHeight: 19 }}>{step}</Text>
                  </View>
                ))}

                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginTop: 8, marginBottom: 6 }}>📂 {t('जरूरी दस्तावेज:', 'Required Documents:')}</Text>
                {item.docs.map((doc, i) => (
                  <Text key={i} style={{ color: subText, fontSize: 12, marginBottom: 4, lineHeight: 18 }}>• {doc}</Text>
                ))}

                <View style={{ backgroundColor: isDark ? '#243447' : '#F8F9FA', borderRadius: 8, padding: 10, marginTop: 10, marginBottom: 10 }}>
                  <Text style={{ color: isDark ? '#AABBCC' : '#666', fontSize: 11, fontStyle: 'italic' }}>
                    📜 {t('कानून:', 'Law:')} {item.law}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#CC0000', borderRadius: 8, padding: 10, alignItems: 'center' }}
                    onPress={() => Linking.openURL('tel:' + item.helpline)}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>📞 {item.helpline}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#1a237e', borderRadius: 8, padding: 10, alignItems: 'center' }}
                    onPress={() => Linking.openURL(item.url)}
                  >
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }} numberOfLines={1}>{item.urlLabel}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
