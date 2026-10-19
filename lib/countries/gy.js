import { int, pick, digitString, letters } from '../random.js';

const CITIES = [
  { city: 'Georgetown', state: 'Demerara-Mahaica', abbr: 'DM' },
  { city: 'Linden', state: 'Upper Demerara-Berbice', abbr: 'UD' },
  { city: 'New Amsterdam', state: 'East Berbice-Corentyne', abbr: 'EB' },
  { city: 'Anna Regina', state: 'Pomeroon-Supenaam', abbr: 'PM' },
  { city: 'Bartica', state: 'Cuyuni-Mazaruni', abbr: 'CU' },
  { city: 'Corriverton', state: 'East Berbice-Corentyne', abbr: 'EB' },
  { city: 'Rose Hall', state: 'East Berbice-Corentyne', abbr: 'EB' },
];

const STREETS = ['Regent', 'Robb', 'Camp', 'Main', 'Brickdam', 'Sheriff', 'Vlissengen', 'Church', 'Middle', 'Water', 'Charlotte', 'Croal', 'Lamaha', 'Duke'];

function nationalId() {
  const raw = digitString(9);
  return { raw, value: raw };
}

function tin() {
  const raw = '0' + digitString(8);
  return { raw, value: raw };
}

function passport() {
  const raw = 'R' + digitString(7);
  return { raw, value: raw };
}

export default {
  code: 'GY',
  name: 'Guiana',
  flag: '🇬🇾',
  doubleSurname: false,
  ddi: '592',
  cities: CITIES,
  neighborhoods: ['Kitty', 'Campbellville', 'Bel Air Park', 'Queenstown', 'Lacytown', 'Alberttown', 'Prashad Nagar', 'Subryanville', 'Lodge', 'Stabroek'],
  street: () => `${pick(STREETS)} ${pick(['Street', 'Street', 'Road', 'Avenue'])}`,
  numberFirst: true,
  complement: () => pick(['', `Lot ${int(1, 300)}`, `Apt ${int(1, 20)}`, `Unit ${letters(1, 'ABCD')}`]),
  postal: null,
  mobile() {
    const local = '6' + digitString(6);
    return { national: local, value: `${local.slice(0, 3)}-${local.slice(3)}` };
  },
  landline() {
    const local = pick(['2', '3']) + digitString(6);
    return { national: local, value: `${local.slice(0, 3)}-${local.slice(3)}` };
  },
  emailDomains: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
  companySuffixes: ['Inc.', 'Ltd.', '& Sons Ltd.'],
  companyWords: ['Trading', 'Services', 'Technologies', 'Distributors', 'Enterprises', 'Transport', 'Consulting', 'Foods', 'Construction', 'Insurance'],
  plate() {
    const raw = 'P' + letters(2) + digitString(4);
    return { raw, value: `${raw.slice(0, 3)} ${raw.slice(3)}` };
  },
  vinWmi: ['JTD', 'JN1', 'KMH', 'MA3', 'JHM'],
  documents: [
    { key: 'nationalId', label: 'National ID', kind: 'person', main: true, match: '\\b(national id|id card|id number|identity|identidade|documento)\\b', gen: nationalId },
    { key: 'passport', label: 'Passport', kind: 'person', match: '\\b(passport|passaporte)\\b', gen: passport },
    { key: 'tin', label: 'TIN', kind: 'company', main: true, match: '\\b(tin|tax)\\b', gen: tin },
  ],
};
