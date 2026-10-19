import { int, pick, digitString, letters, thousands } from '../random.js';

function nitDv(body) {
  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const sum = String(body).split('').reverse().reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
  const r = sum % 11;
  return r > 1 ? 11 - r : r;
}

function cedula() {
  const num = pick([int(10000000, 99999999), int(1000000000, 1199999999)]);
  return { raw: String(num), value: thousands(num) };
}

function nit() {
  const body = int(800000000, 999999999);
  const dv = nitDv(body);
  return { raw: `${body}${dv}`, value: `${thousands(body)}-${dv}` };
}

const CITIES = [
  { city: 'Bogotá', state: 'Bogotá D.C.', abbr: 'DC', area: '601', cp: ['110', '111'] },
  { city: 'Medellín', state: 'Antioquia', abbr: 'ANT', area: '604', cp: ['050'] },
  { city: 'Cali', state: 'Valle del Cauca', abbr: 'VAC', area: '602', cp: ['760'] },
  { city: 'Barranquilla', state: 'Atlántico', abbr: 'ATL', area: '605', cp: ['080'] },
  { city: 'Cartagena', state: 'Bolívar', abbr: 'BOL', area: '605', cp: ['130'] },
  { city: 'Bucaramanga', state: 'Santander', abbr: 'SAN', area: '607', cp: ['680'] },
  { city: 'Pereira', state: 'Risaralda', abbr: 'RIS', area: '606', cp: ['660'] },
  { city: 'Manizales', state: 'Caldas', abbr: 'CAL', area: '606', cp: ['170'] },
  { city: 'Santa Marta', state: 'Magdalena', abbr: 'MAG', area: '605', cp: ['470'] },
  { city: 'Cúcuta', state: 'Norte de Santander', abbr: 'NSA', area: '607', cp: ['540'] },
];

export default {
  code: 'CO',
  name: 'Colômbia',
  flag: '🇨🇴',
  doubleSurname: true,
  ddi: '57',
  cities: CITIES,
  neighborhoods: ['Chapinero', 'Usaquén', 'Teusaquillo', 'El Poblado', 'Laureles', 'Envigado', 'San Fernando', 'El Prado', 'Bocagrande', 'Cabecera', 'Centro'],
  street: () => {
    const type = pick(['Calle', 'Carrera', 'Avenida', 'Transversal', 'Diagonal']);
    return `${type} ${int(1, 180)}${pick(['', '', 'A', 'B', 'Bis'])}`;
  },
  number: () => `# ${int(1, 150)}-${int(1, 99)}`,
  complement: () => pick(['', `Apto ${int(101, 2504)}`, `Torre ${int(1, 8)} Apto ${int(101, 1504)}`, `Oficina ${int(201, 1201)}`, `Casa ${int(1, 60)}`]),
  postal(city) {
    const prefix = pick(city.cp);
    const raw = prefix + digitString(6 - prefix.length);
    return { raw, value: raw };
  },
  mobile() {
    const local = '3' + pick(['00', '01', '02', '04', '05', '10', '11', '12', '13', '14', '15', '16', '17', '18', '20', '21', '23', '50']) + digitString(7);
    return { national: local, value: `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` };
  },
  landline(city) {
    const local = String(int(2, 8)) + digitString(6);
    return { national: city.area + local, value: `(${city.area}) ${local.slice(0, 3)} ${local.slice(3)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.es', 'hotmail.es'],
  companySuffixes: ['S.A.S.', 'S.A.', 'Ltda.'],
  companyWords: ['Comercializadora', 'Servicios', 'Tecnología', 'Distribuidora', 'Inversiones', 'Transportes', 'Consultores', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(3) + digitString(3);
    return { raw, value: `${raw.slice(0, 3)}-${raw.slice(3)}` };
  },
  vinWmi: ['9FB', '9GA', '9BW', 'KMH', 'MA3', '3N1'],
  documents: [
    { key: 'cc', label: 'Cédula de ciudadanía', kind: 'person', main: true, match: '\\b(cedula|cc|ciudadania|numero de identificacion|documento)\\b', gen: cedula },
    { key: 'nit', label: 'NIT', kind: 'company', main: true, match: '\\bnit\\b', gen: nit },
  ],
};
