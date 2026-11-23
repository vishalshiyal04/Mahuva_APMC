// સુરક્ષા પ્રશ્નો (પાસવર્ડ ભુલાઈ જાય ત્યારે ઓળખ માટે). ક્લાયન્ટ અને સર્વર બંને આ જ યાદી વાપરે છે.
// નવો પ્રશ્ન ઉમેરો તો નવો id આપો, જૂના id બદલશો નહીં (જૂના યુઝરના પ્રશ્ન તૂટી જાય).
export const SECURITY_QUESTIONS = [
  { id: "school", text: "તમે જે પહેલી શાળામાં ભણ્યા તેનું નામ શું છે?" },
  { id: "friend", text: "તમારા બાળપણના સૌથી નજીકના મિત્રનું નામ શું છે?" },
  { id: "mamaghar", text: "તમારા મોસાળ (મામાના ગામ)નું નામ શું છે?" },
  { id: "firstphone", text: "તમારા પહેલા મોબાઈલ ફોનની કંપની કઈ હતી?" },
  { id: "teacher", text: "તમારા પ્રિય શિક્ષકનું નામ શું છે?" },
  { id: "festival", text: "તમારો સૌથી મનપસંદ તહેવાર કયો છે?" },
  { id: "firstvehicle", text: "તમારા પહેલા વાહનની કંપની/નામ શું હતું?" },
  { id: "dish", text: "તમારી મનપસંદ વાનગી કઈ છે?" },
];

export const questionById = (id) => SECURITY_QUESTIONS.find((q) => q.id === id);

// જવાબ સરખાવતા પહેલાં: મોટા-નાના અક્ષર, વધારાની જગ્યા, પૂર્ણવિરામ ગણતરીમાં ન લેવા
export const normalizeAnswer = (s) =>
  String(s ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[.,;:!?'"()\-_/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
