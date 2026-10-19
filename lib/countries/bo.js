import { int, pick, digitString, letters } from '../random.js';

const CITIES = [
  { city: 'La Paz', state: 'La Paz', abbr: 'LP', area: '2' },
  { city: 'El Alto', state: 'La Paz', abbr: 'LP', area: '2' },
  { city: 'Santa Cruz de la Sierra', state: 'Santa Cruz', abbr: 'SC', area: '3' },
  { city: 'Cochabamba', state: 'Cochabamba', abbr: 'CB', area: '4' },
  { city: 'Sucre', state: 'Chuquisaca', abbr: 'CH', area: '4' },
  { city: 'Oruro', state: 'Oruro', abbr: 'OR', area: '2' },
  { city: 'Potosí', state: 'Potosí', abbr: 'PT', area: '2' },
  { city: 'Tarija', state: 'Tarija', abbr: 'TJ', area: '4' },
  { city: 'Trinidad', state: 'Beni', abbr: 'BN', area: '3' },
  { city: 'Cobija', state: 'Pando', abbr: 'PD', area: '3' },
];

const STREETS = ['16 de Julio', 'Arce', 'Ballivián', 'Camacho', 'Montes', 'Busch', 'Monseñor Rivero', 'Cristo Redentor', 'Heroínas', 'América', 'Ayacucho', 'Sucre', 'Potosí', 'Junín', 'Murillo'];

function ci(ctx) {
  const num = digitString(7);
  const ext = ctx.city.abbr;
  return { raw: num, value: `${num} ${ext}` };
}

function nit() {
  const raw = String(int(100000000, 499999999)) + pick(['0', '1', '2']) + digitString(1);
  return { raw, value: raw };
}

export default {
  code: 'BO',
  name: 'Bolívia',
  flag: '🇧🇴',
  doubleSurname: true,
  ddi: '591',
  cities: CITIES,
  neighborhoods: ['Sopocachi', 'Miraflores', 'Calacoto', 'San Miguel', 'Obrajes', 'Equipetrol', 'Las Palmas', 'Queru Queru', 'Centro', 'Villa Fátima'],
  street: () => `${pick(['Calle', 'Av.', 'Av.', 'Pasaje'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Edif. ${pick(STREETS)} Dpto. ${int(1, 15)}${letters(1, 'ABCD')}`, `Piso ${int(1, 12)}`, `Zona ${pick(['Sur', 'Norte', 'Central'])}`]),
  postal: null,
  mobile() {
    const local = pick(['6', '7']) + digitString(7);
    return { national: local, value: `${local.slice(0, 4)} ${local.slice(4)}` };
  },
  landline(city) {
    const local = city.area + String(int(2, 4)) + digitString(5);
    return { national: local, value: `(${city.area}) ${local.slice(1, 4)} ${local.slice(4)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.es'],
  companySuffixes: ['S.R.L.', 'S.A.', 'Ltda.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Importadora', 'Transportes', 'Consultora', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = digitString(4) + letters(3);
    return { raw, value: `${raw.slice(0, 4)} ${raw.slice(4)}` };
  },
  vinWmi: ['9BW', 'KMH', 'MA3', 'JTD', 'LGW', '8AG'],
  documents: [
    { key: 'ci', label: 'Cédula de identidad', kind: 'person', main: true, match: '\\b(ci|cedula|identidad|documento)\\b', gen: ci },
    { key: 'nit', label: 'NIT', kind: 'company', main: true, match: '\\bnit\\b', gen: nit },
  ],
};
