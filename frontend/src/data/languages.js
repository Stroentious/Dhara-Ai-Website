/**
 * Indian Constitution Eighth Schedule Languages (22 Languages) + English
 * Complete metadata registry with native script names, ISO codes, and region notes.
 */
export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India / Global', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'उत्तर एवं मध्य भारत', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'ਪੰਜਾਬ', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'পশ্চিমবঙ্গ / ত্রিপুরা', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'ఆంధ్రప్రదేశ్ / తెలంగాణ', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'தமிழ்நாடு / புதுச்சேரி', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'महाराष्ट्र', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'ગુજરાત', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'ಕರ್ನಾಟಕ', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'കേരളം / ലക്ഷദ്വീപ്', dir: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'ଓଡ଼ିଶା', dir: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'অসম', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'پورا بھارت', dir: 'rtl' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'अखिल-भारतम्', dir: 'ltr' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'मिथिला / बिहार / झारखंड', dir: 'ltr' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', region: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ / ᱯᱚᱪᱷᱤᱢ ᱵᱟᱝᱞᱟ / ᱳᱰᱤᱥᱟ', dir: 'ltr' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'كٲشُر / कॉशुर', region: 'جۆم تہٕ کٔشیٖر / जम्मू-कश्मीर', dir: 'ltr' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'सिक्किम / पश्चिम बंगाल', dir: 'ltr' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', region: 'गोंय / गोवा / कोंकण', dir: 'ltr' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिंधी', region: 'ڀارت / भारत', dir: 'ltr' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', region: 'जम्मू ते कश्मीर', dir: 'ltr' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্ / মণিপুরী', region: 'মণিপুর', dir: 'ltr' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\' / बड़ो', region: 'बड\'लेन्द / असम', dir: 'ltr' },
];

export const getLanguageByCode = (code) => {
  return INDIAN_LANGUAGES.find((lang) => lang.code === code) || INDIAN_LANGUAGES[0];
};
