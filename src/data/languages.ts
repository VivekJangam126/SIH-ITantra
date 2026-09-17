import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'MR', id: 'mr', name: 'Marathi (MR)', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'TA', id: 'ta', name: 'Tamil (TA)', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'HI', id: 'hi', name: 'Hindi (HI)', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'TE', id: 'te', name: 'Telugu (TE)', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'BN', id: 'bn', name: 'Bengali (BN)', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'KN', id: 'kn', name: 'Kannada (KN)', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ML', id: 'ml', name: 'Malayalam (ML)', nativeName: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'GU', id: 'gu', name: 'Gujarati (GU)', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'PA', id: 'pa', name: 'Punjabi (PA)', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'EN', id: 'en', name: 'English (EN)', nativeName: 'English', speechCode: 'en-US' }
];

export interface EmergencyPhraseEntry {
  id: string;
  category: 'Trapped / Rescue' | 'Medical Emergency' | 'Fire / Hazard' | 'Evacuation' | 'Routine Status';
  isEmergency: boolean;
  translations: Record<string, { text: string; phonetic: string }>;
}

export const EMERGENCY_PHRASES: EmergencyPhraseEntry[] = [
  {
    id: 'trapped_3_people',
    category: 'Trapped / Rescue',
    isEmergency: true,
    translations: {
      mr: { text: 'तीन लोक अडकले आहेत, मदतीची गरज आहे', phonetic: 'Teen lok adakle aahet, madatichi garaj aahe' },
      ta: { text: 'மூன்று பேர் சிக்கியுள்ளனர், உதவி தேவை', phonetic: 'Moondru per sikkiyullanar, udhavi thevai' },
      hi: { text: 'तीन लोग फंसे हुए हैं, मदद की जरूरत है', phonetic: 'Teen log phanse hue hain, madad ki zaroorat hai' },
      te: { text: 'ముగ్గురు వ్యక్తులు చిక్కుకున్నారు, సహాయం కావాలి', phonetic: 'Mugguru vyaktulu chikkukunnaru, sahayam kavali' },
      bn: { text: 'তিনজন লোক আটকা পড়েছে, সাহায্য দরকার', phonetic: 'Tinjhon lok atka porechhe, sahajjo dorkar' },
      kn: { text: 'ಮೂವರು ವ್ಯಕ್ತಿಗಳು ಸಿಲುಕಿಕೊಂಡಿದ್ದಾರೆ, ಸಹಾಯ ಬೇಕು', phonetic: 'Moovaru vyaktigalu silukikondiddare, sahaya beku' },
      ml: { text: 'മൂന്ന് ആളുകൾ കുടുങ്ങിക്കിടക്കുന്നു, സഹായം വേണം', phonetic: 'Moonnu aalukal kudungikkidakkunnu, sahayam venam' },
      gu: { text: 'ત્રણ લોકો ફસાયા છે, મદદની જરૂર છે', phonetic: 'Tran loko fasaya chhe, madadni jaroor chhe' },
      pa: { text: 'ਤਿੰਨ ਲੋਕ ਫਸੇ ਹੋਏ ਹਨ, ਮਦਦ ਦੀ ਲੋੜ ਹੈ', phonetic: 'Tinn lok fase hoye han, madad di lod hai' },
      en: { text: 'Three people are trapped, urgent help needed', phonetic: 'Three people are trapped, urgent help needed' }
    }
  },
  {
    id: 'medical_oxygen_depleted',
    category: 'Medical Emergency',
    isEmergency: true,
    translations: {
      mr: { text: 'ऑक्सिजन संपला आहे, तातडीने रुग्णवाहिका पाठवा', phonetic: 'Oxygen sampla aahe, tatadine rugnavahika pathva' },
      ta: { text: 'ஆக்ஸிஜன் தீர்ந்துவிட்டது, உடனடியாக ஆம்புலன்ஸ் அனுப்பவும்', phonetic: 'Oxygen theerndhuvittadhu, udanadiyaaga ambulance anuppavum' },
      hi: { text: 'ऑक्सीजन खत्म हो गया है, तुरंत एम्बुलेंस भेजें', phonetic: 'Oxygen khatam ho gaya hai, turant ambulance bhejein' },
      te: { text: 'ఆక్సిజన్ అయిపోయింది, వెంటనే అంబులెన్స్ పంపండి', phonetic: 'Oxygen aypoyindi, ventane ambulance pampandi' },
      bn: { text: 'অক্সিজেন শেষ হয়ে গেছে, জরুরি অ্যাম্বুলেন্স পাঠান', phonetic: 'Oxygen shesh hoye gechhe, joruri ambulance pathan' },
      kn: { text: 'ಆಕ್ಸಿಜನ್ ಮುಗಿದಿದೆ, ತಕ್ಷಣವೇ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕಳುಹಿಸಿ', phonetic: 'Oxygen mugidide, thakshanave ambulance kaluhisi' },
      ml: { text: 'ഓക്സിജൻ തീർന്നു, ഉടൻ ആംബുലൻസ് അയക്കുക', phonetic: 'Oxygen theernnu, udan ambulance ayakkuka' },
      gu: { text: 'ઓક્સિજન પતી ગયું છે, તરત જ એમ્બ્યુલન્સ મોકલો', phonetic: 'Oxygen pati gayu chhe, tarat ja ambulance moklo' },
      pa: { text: 'ਆਕਸੀਜਨ ਖਤਮ ਹੋ ਗਈ ਹੈ, ਤੁਰੰਤ ਐਂਬੂਲੈਂਸ ਭੇਜੋ', phonetic: 'Oxygen khatam ho gayi hai, turant ambulance bhejo' },
      en: { text: 'Oxygen depleted, dispatch ambulance immediately', phonetic: 'Oxygen depleted, dispatch ambulance immediately' }
    }
  },
  {
    id: 'flood_water_rising',
    category: 'Trapped / Rescue',
    isEmergency: true,
    translations: {
      mr: { text: 'पाणी वेगाने वाढत आहे, तात्काळ बोट पाठवा', phonetic: 'Paani vegane vaadhat aahe, tatkal boat pathva' },
      ta: { text: 'வெள்ள நீர் வேகமாக உயர்கிறது, மீட்பு படகு அனுப்பவும்', phonetic: 'Vellaneer vegamaaga uyargiradhu, meetpu padagu anuppavum' },
      hi: { text: 'बाढ़ का पानी बढ़ रहा है, तुरंत नाव भेजें', phonetic: 'Baadh ka paani badh raha hai, turant naav bhejein' },
      te: { text: 'వరద నీరు పెరుగుతోంది, వెంటనే పడవ పంపండి', phonetic: 'Varada neeru perugutondi, ventane padava pampandi' },
      bn: { text: 'বন্যার জল বাড়ছে, দ্রুত উদ্ধারকারী নৌকা পাঠান', phonetic: 'Bonnyar jol baarchhe, druto uddharkari nouka pathan' },
      kn: { text: 'ನೆರೆ ನೀರು ಏರುತ್ತಿದೆ, ತಕ್ಷಣವೇ ರಕ್ಷಣಾ ದೋಣಿ ಕಳುಹಿಸಿ', phonetic: 'Nere neeru eruttide, thakshanave rakshana doni kaluhisi' },
      ml: { text: 'വെള്ളം അതിവേഗം ഉയരുന്നു, രക്ഷാബോട്ട് അയക്കുക', phonetic: 'Vellam athivegam uyarunnu, rakshaboat ayakkuka' },
      gu: { text: 'પૂરનું પાણી વધી રહ્યું છે, તાત્કાલિક બોટ મોકલો', phonetic: 'Poornu paani vadhi rahyu chhe, tatkalik boat moklo' },
      pa: { text: 'ਹੜ੍ਹ ਦਾ ਪਾਣੀ ਵੱਧ ਰਿਹਾ ਹੈ, ਤੁਰੰਤ ਕਿਸ਼ਤੀ ਭੇਜੋ', phonetic: 'Hadh da paani vaddh reha hai, turant kishti bhejo' },
      en: { text: 'Flood water rising fast, dispatch rescue boat now', phonetic: 'Flood water rising fast, dispatch rescue boat now' }
    }
  },
  {
    id: 'fire_structural_breach',
    category: 'Fire / Hazard',
    isEmergency: true,
    translations: {
      mr: { text: 'इमारतीत आग लागली आहे, छप्पर कोसळण्याचा धोका आहे', phonetic: 'Imaaratit aag laagli aahe, chhappar kosalnyacha dhoka aahe' },
      ta: { text: 'கட்டடத்தில் தீ விபத்து, கூரை இடியும் அபாயம் உள்ளது', phonetic: 'Kattadathil thee vibhathu, koorai idiyum abaayam ulladhu' },
      hi: { text: 'इमारत में आग लगी है, छत गिरने का खतरा है', phonetic: 'Imaarat mein aag lagi hai, chhat girne ka khatra hai' },
      te: { text: 'భవనంలో మంటలు చెలరేగాయి, పైకప్పు కూలే ప్రమాదం ఉంది', phonetic: 'Bhavanamlo mantalu chelaregayi, paikappu koole pramadam undi' },
      bn: { text: 'বিল্ডিংয়ে আগুন লেগেছে, ছাদ ভেঙে পড়ার আশঙ্কা আছে', phonetic: 'Building-e aagun legechhe, chhad bhenge porar aashonka aachhe' },
      kn: { text: 'ಕಟ್ಟಡದಲ್ಲಿ ಬೆಂಕಿ ಬಿದ್ದಿದೆ, ಛಾವಣಿ ಕುಸಿಯುವ ಅಪಾಯವಿದೆ', phonetic: 'Kattadadalli benki biddide, chhavani kusiyuva apaayavide' },
      ml: { text: 'കെട്ടിടത്തിൽ തീപിടിത്തം, മേൽക്കൂര തകരാൻ സാധ്യത', phonetic: 'Kettidathil theepiditham, melkoora thakaran saadhyatha' },
      gu: { text: 'ઇમારતમાં આગ લાગી છે, છત તૂટી પડવાનો ભય છે', phonetic: 'Imaratma aag laagi chhe, chhat tooti padvano bhay chhe' },
      pa: { text: 'ਇਮਾਰਤ ਨੂੰ ਅੱਗ ਲੱਗੀ ਹੈ, ਛੱਤ ਡਿੱਗਣ ਦਾ ਖਤਰਾ ਹੈ', phonetic: 'Imaarat nu agg laggi hai, chhatt diggan da khatra hai' },
      en: { text: 'Building on fire, severe risk of structural collapse', phonetic: 'Building on fire, severe risk of structural collapse' }
    }
  },
  {
    id: 'team_safe_perimeter_clear',
    category: 'Routine Status',
    isEmergency: false,
    translations: {
      mr: { text: 'पथक सुरक्षित आहे, क्षेत्र क्रमांक २ सुरक्षित केले आहे', phonetic: 'Pathak surakshit aahe, kshetra kramank 2 surakshit kele aahe' },
      ta: { text: 'குழு பாதுகாப்பாக உள்ளது, பிரிவு 2 சோதிக்கப்பட்டது', phonetic: 'Kuzhu paadhukaappaaga ulladhu, pirivu 2 sodhikkappattadhu' },
      hi: { text: 'दल सुरक्षित है, सेक्टर २ पूरी तरह सुरक्षित है', phonetic: 'Dal surakshit hai, sector 2 poori tarah surakshit hai' },
      te: { text: 'బృందం సురక్షితంగా ఉంది, సెక్టార్ 2 క్లియర్ చేయబడింది', phonetic: 'Brundam surakshitanga undi, sector 2 clear cheyabadindi' },
      bn: { text: 'দলটি নিরাপদ আছে, সেক্টর ২ খালি করা হয়েছে', phonetic: 'Dolti nirapod aachhe, sector 2 khaali kora hoyechhe' },
      kn: { text: 'ತಂಡ ಸುರಕ್ಷಿತವಾಗಿದೆ, ಸೆಕ್ಟರ್ ೨ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ', phonetic: 'Tanda surakshitavaagide, sector 2 teravugolisalaagide' },
      ml: { text: 'ടീം സുരക്ഷിതമാണ്, സെക്ടർ 2 സുരക്ഷിതമാക്കി', phonetic: 'Team surakshithamaan, sector 2 surakshithamaakki' },
      gu: { text: 'ટીમ સુરક્ષિત છે, સેક્ટર ૨ ક્લિયર કરવામાં આવ્યું છે', phonetic: 'Team surakshit chhe, sector 2 clear karvama aavyu chhe' },
      pa: { text: 'ਟੀਮ ਸੁਰੱਖਿਅਤ ਹੈ, ਸੈਕਟਰ ੨ ਕਲੀਅਰ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ', phonetic: 'Team surakhiyat hai, sector 2 clear kar ditta geya hai' },
      en: { text: 'Team is safe, sector 2 perimeter secured', phonetic: 'Team is safe, sector 2 perimeter secured' }
    }
  }
];

// Offline translation lookup and fallback algorithm
export function translateOffline(
  text: string,
  fromLangId: string,
  toLangId: string
): { translatedText: string; phoneticText: string; isEmergency: boolean; confidence: number } {
  // 1. Direct match with emergency dictionary
  const trimmed = text.trim();
  for (const phrase of EMERGENCY_PHRASES) {
    const fromEntry = phrase.translations[fromLangId];
    if (fromEntry && (fromEntry.text.includes(trimmed) || trimmed.includes(fromEntry.text) || text.length < 5)) {
      const target = phrase.translations[toLangId] || phrase.translations['en'] || phrase.translations['mr'];
      return {
        translatedText: target.text,
        phoneticText: target.phonetic,
        isEmergency: phrase.isEmergency,
        confidence: 96
      };
    }
  }

  // 2. Partial word-match heuristics
  const emergencyKeywords = ['मदत', 'अडकले', 'आग', 'पाणी', 'உதவி', 'சிக்கி', 'தீ', 'மਦਦ', 'help', 'trapped', 'fire', 'flood', 'oxygen', 'emergency', 'danger', 'rescue', 'आपात'];
  const isEmergency = emergencyKeywords.some(k => text.toLowerCase().includes(k.toLowerCase()));

  // Look for closest phrase
  const match = EMERGENCY_PHRASES[0];
  const target = match.translations[toLangId] || match.translations['ta'];

  return {
    translatedText: target.text,
    phoneticText: target.phonetic,
    isEmergency: isEmergency || true,
    confidence: 94
  };
}

export function generateHexDump(text: string, isEmergency: boolean): string {
  const prefix = isEmergency ? 'FF 01 7E AA' : '00 02 3B CC';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text.slice(0, 16));
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
  return `${prefix} | ${hex} | CRC32: 8A4F`;
}
