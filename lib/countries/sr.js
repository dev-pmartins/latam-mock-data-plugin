import { int, pick, digitString, letters } from '../random.js';

const CITIES = [
  { city: 'Paramaribo', state: 'Paramaribo', abbr: 'PM' },
  { city: 'Lelydorp', state: 'Wanica', abbr: 'WA' },
  { city: 'Nieuw Nickerie', state: 'Nickerie', abbr: 'NI' },
  { city: 'Moengo', state: 'Marowijne', abbr: 'MA' },
  { city: 'Nieuw Amsterdam', state: 'Commewijne', abbr: 'CM' },
  { city: 'Groningen', state: 'Saramacca', abbr: 'SA' },
  { city: 'Albina', state: 'Marowijne', abbr: 'MA' },
];

const STREETS = ['Keizer', 'Heeren', 'Gravenstraat', 'Wagenweg', 'Domineestraat', 'Zwartenhovenbrug', 'Kwatta', 'Indira Gandhi', 'Hk. Mahonylaan', 'Tourtonne', 'Verlengde Gemenelands', 'Anton Dragten', 'Waterkant', 'Saramacca'];

function idNummer() {
  const raw = letters(2, 'ABCDEFGHJKLMNPRSTUVWXYZ') + digitString(6);
  return { raw, value: raw };
}

function crib() {
  const raw = digitString(9);
  return { raw, value: raw };
}

export default {
  code: 'SR',
  name: 'Suriname',
  flag: '🇸🇷',
  doubleSurname: false,
  ddi: '597',
  cities: CITIES,
  neighborhoods: ['Centrum', 'Zorg en Hoop', 'Flora', 'Blauwgrond', 'Rainville', 'Munder', 'Latour', 'Pontbuiten', 'Beekhuizen', 'Welgelegen'],
  street: () => {
    const s = pick(STREETS);
    return /(straat|weg|laan|brug|kant)$/i.test(s) ? s : `${s}${pick(['straat', 'weg', 'laan'])}`;
  },
  complement: () => pick(['', `Unit ${int(1, 20)}`, `Perceel ${int(1, 200)}`, `Apt ${letters(1, 'ABC')}${int(1, 9)}`]),
  postal: null,
  mobile() {
    const local = '8' + pick(['1', '2', '5', '6', '7', '8', '9']) + digitString(5);
    return { national: local, value: `${local.slice(0, 3)}-${local.slice(3)}` };
  },
  landline() {
    const local = pick(['4', '5']) + digitString(5);
    return { national: local, value: `${local.slice(0, 3)}-${local.slice(3)}` };
  },
  emailDomains: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'sr.net'],
  companySuffixes: ['N.V.', 'B.V.', 'V.O.F.'],
  companyWords: ['Handel', 'Services', 'Technologie', 'Distributie', 'Import', 'Transport', 'Consultancy', 'Voeding', 'Bouw', 'Verzekeringen'],
  plate() {
    const raw = letters(2) + digitString(4);
    return { raw, value: `${raw.slice(0, 2)} ${raw.slice(2, 4)}-${raw.slice(4)}` };
  },
  vinWmi: ['JTD', 'JN1', 'KMH', 'MA3', 'JHM', 'LGW'],
  documents: [
    { key: 'idNummer', label: 'ID-nummer', kind: 'person', main: true, match: '\\b(id nummer|identiteit|id number|identidade|documento)\\b', gen: idNummer },
    { key: 'crib', label: 'CRIB-nummer', kind: 'company', main: true, match: '\\b(crib|fiscaal|tin)\\b', gen: crib },
  ],
};
