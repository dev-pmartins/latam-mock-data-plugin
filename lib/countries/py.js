import { int, pick, digitString, letters, thousands } from '../random.js';

// Algoritmo "Módulo 11" da SET (base máxima 11).
function rucDv(body) {
  let sum = 0;
  let k = 2;
  for (const d of String(body).split('').reverse()) {
    sum += Number(d) * k;
    k = k === 11 ? 2 : k + 1;
  }
  const r = sum % 11;
  return r > 1 ? 11 - r : 0;
}

function ci() {
  const num = int(1000000, 7999999);
  return { raw: String(num), value: thousands(num) };
}

function ruc(ctx) {
  const body = ctx.docs.ci ?? String(int(1000000, 7999999));
  const dv = rucDv(body);
  return { raw: `${body}${dv}`, value: `${body}-${dv}` };
}

function rucEmpresa() {
  const body = String(int(80000000, 80129999));
  const dv = rucDv(body);
  return { raw: `${body}${dv}`, value: `${body}-${dv}` };
}

const CITIES = [
  { city: 'Asunción', state: 'Distrito Capital', abbr: 'ASU', area: '21', cp: ['1209', '1302', '1410', '1536', '1712'] },
  { city: 'San Lorenzo', state: 'Central', abbr: 'CEN', area: '21', cp: ['2160'] },
  { city: 'Luque', state: 'Central', abbr: 'CEN', area: '21', cp: ['2060'] },
  { city: 'Fernando de la Mora', state: 'Central', abbr: 'CEN', area: '21', cp: ['2300'] },
  { city: 'Ciudad del Este', state: 'Alto Paraná', abbr: 'APN', area: '61', cp: ['7000'] },
  { city: 'Encarnación', state: 'Itapúa', abbr: 'ITA', area: '71', cp: ['6000'] },
  { city: 'Pedro Juan Caballero', state: 'Amambay', abbr: 'AMA', area: '336', cp: ['5600'] },
  { city: 'Coronel Oviedo', state: 'Caaguazú', abbr: 'CAA', area: '521', cp: ['3300'] },
];

const STREETS = ['Mariscal López', 'España', 'Eusebio Ayala', 'Aviadores del Chaco', 'Santa Teresa', 'Artigas', 'Palma', 'Estrella', 'Brasilia', 'Mcal. Estigarribia', 'Sacramento', 'Perú', 'Venezuela', 'Colón', 'Independencia Nacional'];

export default {
  code: 'PY',
  name: 'Paraguai',
  flag: '🇵🇾',
  doubleSurname: true,
  ddi: '595',
  cities: CITIES,
  neighborhoods: ['Villa Morra', 'Carmelitas', 'Recoleta', 'Las Mercedes', 'Sajonia', 'Mburucuyá', 'Herrera', 'Los Laureles', 'Centro', 'San Vicente'],
  street: () => `${pick(['Avda.', 'Calle', 'Avda.'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Dpto. ${int(1, 20)}${letters(1, 'ABCD')}`, `Piso ${int(1, 15)}`, `Casa ${int(1, 40)}`, `c/ ${pick(STREETS)}`]),
  postal(city) {
    const raw = pick(city.cp);
    return { raw, value: raw };
  },
  mobile() {
    const local = '9' + pick(['61', '71', '72', '73', '75', '76', '81', '82', '83', '84', '85', '86', '91', '92', '94', '95']) + digitString(6);
    return { national: '0' + local, value: `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` };
  },
  landline(city) {
    const local = String(int(2, 9)) + digitString(8 - city.area.length - 1);
    return { national: '0' + city.area + local, value: `(0${city.area}) ${local}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'tigo.com.py'],
  companySuffixes: ['S.A.', 'S.R.L.', 'E.A.S.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Inversiones', 'Transportes', 'Consultora', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(4) + digitString(3);
    return { raw, value: `${raw.slice(0, 4)} ${raw.slice(4)}` };
  },
  vinWmi: ['9BW', '8AG', 'KMH', 'MA3', 'JTD', 'LGW'],
  documents: [
    { key: 'ci', label: 'Cédula de identidad', kind: 'person', main: true, match: '\\b(ci|cedula|identidad|documento)\\b', gen: ci },
    { key: 'ruc', label: 'RUC (persona física)', kind: 'person', match: '\\bruc\\b.*\\b(persona|fisica)\\b', gen: ruc },
    { key: 'rucEmpresa', label: 'RUC (empresa)', kind: 'company', main: true, match: '\\bruc\\b', gen: rucEmpresa },
  ],
};
