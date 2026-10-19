import { int, pick, digitString, letters, thousands } from '../random.js';

const RIF_LETTER = { V: 1, E: 2, J: 3, P: 4, G: 5 };

function rifDv(letter, body8) {
  const sum = RIF_LETTER[letter] * 4 + body8.split('').reduce((acc, d, i) => acc + Number(d) * [3, 2, 7, 6, 5, 4, 3, 2][i], 0);
  const r = 11 - (sum % 11);
  return r >= 10 ? 0 : r;
}

function cedula() {
  const num = int(5000000, 32999999);
  return { raw: String(num), value: `V-${thousands(num)}` };
}

function rifPersona(ctx) {
  const body = (ctx.docs.cedula ?? String(int(5000000, 32999999))).padStart(8, '0');
  const dv = rifDv('V', body);
  return { raw: `V${body}${dv}`, value: `V-${body}-${dv}` };
}

function rifEmpresa() {
  const body = String(int(29000000, 50999999)).padStart(8, '0');
  const dv = rifDv('J', body);
  return { raw: `J${body}${dv}`, value: `J-${body}-${dv}` };
}

const CITIES = [
  { city: 'Caracas', state: 'Distrito Capital', abbr: 'DC', area: '212', cp: ['1010', '1050', '1060', '1071'] },
  { city: 'Maracaibo', state: 'Zulia', abbr: 'ZU', area: '261', cp: ['4001', '4002'] },
  { city: 'Valencia', state: 'Carabobo', abbr: 'CA', area: '241', cp: ['2001'] },
  { city: 'Barquisimeto', state: 'Lara', abbr: 'LA', area: '251', cp: ['3001'] },
  { city: 'Maracay', state: 'Aragua', abbr: 'AR', area: '243', cp: ['2101'] },
  { city: 'Puerto La Cruz', state: 'Anzoátegui', abbr: 'AN', area: '281', cp: ['6023'] },
  { city: 'Mérida', state: 'Mérida', abbr: 'ME', area: '274', cp: ['5101'] },
  { city: 'San Cristóbal', state: 'Táchira', abbr: 'TA', area: '276', cp: ['5001'] },
];

const STREETS = ['Francisco de Miranda', 'Libertador', 'Urdaneta', 'Bolívar', 'Andrés Bello', 'Principal de Las Mercedes', 'Río de Janeiro', 'Venezuela', 'Universidad', 'Las Delicias', 'Cedeño', 'Los Próceres'];

export default {
  code: 'VE',
  name: 'Venezuela',
  flag: '🇻🇪',
  doubleSurname: true,
  ddi: '58',
  cities: CITIES,
  neighborhoods: ['Altamira', 'Chacao', 'Las Mercedes', 'El Paraíso', 'La Candelaria', 'Los Palos Grandes', 'Bella Vista', 'El Recreo', 'Sabana Grande', 'La Castellana'],
  street: () => `${pick(['Av.', 'Calle', 'Av.', 'Transversal'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Edif. ${pick(STREETS)}, Piso ${int(1, 15)}, Apto ${int(1, 15)}${letters(1, 'ABCD')}`, `Quinta ${pick(['Mi Casa', 'Las Rosas', 'Don José', 'La Esperanza'])}`, `Local ${int(1, 30)}`]),
  postal(city) {
    const raw = pick(city.cp);
    return { raw, value: raw };
  },
  mobile() {
    const op = pick(['412', '414', '416', '422', '424', '426']);
    const local = digitString(7);
    return { national: '0' + op + local, value: `0${op}-${local.slice(0, 3)}-${local.slice(3)}` };
  },
  landline(city) {
    const local = String(int(2, 9)) + digitString(6);
    return { national: '0' + city.area + local, value: `0${city.area}-${local.slice(0, 3)}-${local.slice(3)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'cantv.net'],
  companySuffixes: ['C.A.', 'S.A.', 'S.R.L.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Inversiones', 'Transportes', 'Consultores', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(2) + digitString(3) + letters(2);
    return { raw, value: raw };
  },
  vinWmi: ['8XA', '8Z1', '9BW', 'KMH', 'JTD', '8AG'],
  documents: [
    { key: 'cedula', label: 'Cédula de identidad', kind: 'person', main: true, match: '\\b(cedula|ci|identidad|documento)\\b', gen: cedula },
    { key: 'rif', label: 'RIF (persona)', kind: 'person', match: '\\brif\\b.*\\b(persona|natural)\\b', gen: rifPersona },
    { key: 'rifEmpresa', label: 'RIF (empresa)', kind: 'company', main: true, match: '\\brif\\b', gen: rifEmpresa },
  ],
};
