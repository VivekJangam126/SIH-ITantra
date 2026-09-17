import { TacticalScenario } from '../types';

export const PRESET_SCENARIOS: TacticalScenario[] = [
  {
    id: 'flood_marathi_tamil',
    title: 'Disaster Relief: Flood Inundation & Rescue',
    category: 'Flood Breach',
    description: 'First responders in Chiplun flood zone transmitting critical evacuation coordinates to NDRF rescue unit stationed at Tamil battalion post.',
    sourceLang: 'mr',
    targetLang: 'ta',
    sourceText: 'तीन लोक अडकले आहेत, मदतीची गरज आहे',
    translatedText: 'மூன்று பேர் சிக்கியுள்ளனர், உதவி தேவை',
    phoneticText: 'Moondru per sikkiyullanar, udhavi thevai',
    priority: 'EMERGENCY',
    confidence: 94,
    payloadBytes: 124,
    location: 'Sector 7B, Chiplun Riverside'
  },
  {
    id: 'triage_hindi_english',
    title: 'Medical Triage: Oxygen Depletion Alert',
    category: 'Medical Triage',
    description: 'Field clinic medic reporting critical medical supplies running out under collapsed cell tower coverage.',
    sourceLang: 'hi',
    targetLang: 'en',
    sourceText: 'ऑक्सीजन खत्म हो गया है, तुरंत एम्बुलेंस भेजें',
    translatedText: 'Oxygen depleted, dispatch ambulance immediately',
    phoneticText: 'Oxygen khatam ho gaya hai, turant ambulance bhejein',
    priority: 'EMERGENCY',
    confidence: 97,
    payloadBytes: 138,
    location: 'Forward Triage Unit Alpha'
  },
  {
    id: 'search_bengali_kannada',
    title: 'Search & Rescue: Avalanche Zone Survivor',
    category: 'Search & Rescue',
    description: 'Alpine reconnaissance team transmitting survivor beacon detection over 1.2 kbps VHF relay.',
    sourceLang: 'bn',
    targetLang: 'kn',
    sourceText: 'তিনজন লোক আটকা পড়েছে, সাহায্য দরকার',
    translatedText: 'ಮೂವರು ವ್ಯಕ್ತಿಗಳು ಸಿಲುಕಿಕೊಂಡಿದ್ದಾರೆ, ಸಹಾಯ ಬೇಕು',
    phoneticText: 'Moovaru vyaktigalu silukikondiddare, sahaya beku',
    priority: 'EMERGENCY',
    confidence: 92,
    payloadBytes: 118,
    location: 'Pass 4, Altitude 4200m'
  },
  {
    id: 'fire_telugu_marathi',
    title: 'Firefighting Evacuation: Structural Collapse Threat',
    category: 'Fire Evacuation',
    description: 'Emergency breach squad alerting perimeter defense of impending roof collapse.',
    sourceLang: 'te',
    targetLang: 'mr',
    sourceText: 'భవనంలో మంటలు చెలరేగాయి, పైకప్పు కూలే ప్రమాదం ఉంది',
    translatedText: 'इमारतीत आग लागली आहे, छप्पर कोसळण्याचा धोका आहे',
    phoneticText: 'Imaaratit aag laagli aahe, chhappar kosalnyacha dhoka aahe',
    priority: 'EMERGENCY',
    confidence: 95,
    payloadBytes: 152,
    location: 'Industrial Complex Bay 9'
  },
  {
    id: 'routine_patrol_clear',
    title: 'Perimeter Check: Sector 2 Clear & Secured',
    category: 'Disaster Relief',
    description: 'Routine mesh beacon confirmation transmitted with ultra-low power consumption.',
    sourceLang: 'mr',
    targetLang: 'ta',
    sourceText: 'पथक सुरक्षित आहे, क्षेत्र क्रमांक २ सुरक्षित केले आहे',
    translatedText: 'குழு பாதுகாப்பாக உள்ளது, பிரிவு 2 சோதிக்கப்பட்டது',
    phoneticText: 'Kuzhu paadhukaappaaga ulladhu, pirivu 2 sodhikkappattadhu',
    priority: 'ROUTINE',
    confidence: 99,
    payloadBytes: 96,
    location: 'Perimeter Checkpoint 2'
  }
];
