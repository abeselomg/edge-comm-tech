/*
 * Amharic dictionary.
 *
 * MACHINE-DRAFTED -- needs review by a native Amharic speaker before it is
 * relied on. Brand and product names ("Edge Comm-Tech") and industry acronyms
 * (ICT, AI) stay in Latin, as they are normally written in Amharic text.
 *
 * HOW TO ADD A STRING
 *   1. Wrap the English text where it is rendered:  <Tr>Some English text</Tr>
 *      (or <Tr>{cmsValue}</Tr> for a string that comes from the CMS).
 *   2. Add one entry below. The KEY is the English string, character for
 *      character -- same punctuation, same apostrophe, same arrow. The value
 *      is the Amharic.
 *
 * A <Tr> whose text has no entry here renders exactly as it did before, so
 * wrapping first and translating later is safe, and a CMS edit that changes an
 * English string simply drops that one back to English until the key is updated.
 *
 * This is a stop-gap for a demonstration, not the long-term design: only the
 * English text is in the server HTML. See Tr for the limits.
 */

export const AM: Readonly<Record<string, string>> = {
  /* Main navigation (SiteSettings.nav labels) */
  Solutions: "መፍትሔዎች",
  Projects: "ፕሮጀክቶች",
  Clients: "ደንበኞች",
  Partners: "አጋሮች",
  Resources: "ግብዓቶች",
  Blog: "ብሎግ",
  Careers: "የሥራ ዕድሎች",
  About: "ስለ እኛ",
  "Contact us": "ያግኙን",
  Contact: "ያግኙን",

  /* Home hero (PageCopy.homeHero) */
  "Addis Ababa · Serving Ethiopia and beyond": "አዲስ አበባ · ኢትዮጵያንና ከዚያም ባሻገር እያገለገልን",
  "Accelerating Africa's digital transformation": "የአፍሪካን ዲጂታል ሽግግር ማፋጠን",
  "Edge Comm-Tech designs, delivers, and supports secure, scalable, intelligent, and future-ready technology solutions for financial institutions, government organizations, educational institutions, and enterprises.":
    "Edge Comm-Tech ለፋይናንስ ተቋማት፣ ለመንግሥት ድርጅቶች፣ ለትምህርት ተቋማት እና ለኩባንያዎች ደኅንነቱ የተጠበቀ፣ ሊስፋፋ የሚችል፣ ብልህ እና ለወደፊት ዝግጁ የሆነ የቴክኖሎጂ መፍትሔዎችን ይቀርጻል፣ ያቀርባል፣ ይደግፋል።",
  "Explore our solutions": "መፍትሔዎቻችንን ይመልከቱ",
  "View our projects": "ፕሮጀክቶቻችንን ይመልከቱ",

  /* Home hero card */
  Headquarters: "ዋና መሥሪያ ቤት",
  "Ethiopia's trusted end-to-end technology solutions and systems-integration partner.":
    "የኢትዮጵያ ታማኝ ከጫፍ እስከ ጫፍ የቴክኖሎጂ መፍትሔዎችና የሲስተም ውህደት አጋር።",
  "Call or write →": "ይደውሉ ወይም ይጻፉ →",

  /* Footer */
  Company: "ድርጅት",
  "Professional services": "ሙያዊ አገልግሎቶች",
};
