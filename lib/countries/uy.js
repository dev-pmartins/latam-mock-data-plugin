import { int, pick, digitString, letters, thousands } from '../random.js';

function ci() {
  const body = int(1000000, 6999999);
  const sum = String(body).split('').reduce((acc, d, i) => acc + Number(d) * [2, 9, 8, 7, 6, 3, 4][i], 0);
  const dv = (10 - (sum % 10)) % 10;
  return { raw: `${body}${dv}`, value: `${thousands(body)}-${dv}` };
}

function rut() {
  for (;;) {
    const base = String(int(1, 21)).padStart(2, '0') + digitString(6) + '001';
    const sum = base.split('').reduce((acc, d, i) => acc + Number(d) * [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2][i], 0);
    let dv = 11 - (sum % 11);
    if (dv === 11) dv = 0;
    if (dv === 10) continue;
    const raw = base + dv;
    return { raw, value: raw };
  }
}

const CITIES = [
  { city: 'Montevideo', state: 'Montevideo', abbr: 'MO', cp: ['11000', '11100', '11200', '11300', '11400', '11500', '11600'] },
  { city: 'Ciudad de la Costa', state: 'Canelones', abbr: 'CA', cp: ['15000'] },
  { city: 'Canelones', state: 'Canelones', abbr: 'CA', cp: ['90000'] },
  { city: 'Punta del Este', state: 'Maldonado', abbr: 'MA', cp: ['20100'] },
  { city: 'Maldonado', state: 'Maldonado', abbr: 'MA', cp: ['20000'] },
  { city: 'Salto', state: 'Salto', abbr: 'SA', cp: ['50000'] },
  { city: 'Paysandú', state: 'Paysandú', abbr: 'PA', cp: ['60000'] },
  { city: 'Rivera', state: 'Rivera', abbr: 'RV', cp: ['40000'] },
  { city: 'Colonia del Sacramento', state: 'Colonia', abbr: 'CO', cp: ['70000'] },
];

const STREETS = ['18 de Julio', 'Rivera', 'Italia', 'Brasil', 'Sarmiento', 'Agraciada', 'Artigas', 'Garibaldi', 'Millán', 'Bulevar España', 'Luis Alberto de Herrera', 'Colonia', 'Mercedes', 'Rambla Gandhi', 'Soriano', 'Canelones'];

export default {
  code: 'UY',
  name: 'Uruguai',
  flag: '🇺🇾',
  doubleSurname: false,
  ddi: '598',
  cities: CITIES,
  neighborhoods: ['Pocitos', 'Punta Carretas', 'Carrasco', 'Cordón', 'Centro', 'Ciudad Vieja', 'Malvín', 'Buceo', 'Parque Rodó', 'Prado', 'La Blanqueada'],
  street: () => `${pick(['Av.', 'Calle', 'Bulevar'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Apto ${int(101, 1203)}`, `Piso ${int(1, 12)}`, `Local ${int(1, 30)}`]),
  postal(city) {
    const raw = pick(city.cp);
    return { raw, value: raw };
  },
  mobile() {
    const local = '9' + int(1, 9) + digitString(6);
    return { national: '0' + local, value: `0${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}` };
  },
  landline(city) {
    const local = (city.city === 'Montevideo' ? '2' : '4') + digitString(7);
    return { national: local, value: `${local.slice(0, 4)} ${local.slice(4)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'adinet.com.uy', 'yahoo.com'],
  companySuffixes: ['S.A.', 'S.R.L.', 'S.A.S.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Inversiones', 'Transportes', 'Consultores', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(3) + digitString(4);
    return { raw, value: `${raw.slice(0, 3)} ${raw.slice(3)}` };
  },
  vinWmi: ['9BW', '8AG', 'KMH', 'MA3', 'JTD', 'LGW'],
  documents: [
    { key: 'ci', label: 'Cédula de identidad', kind: 'person', main: true, match: '\\b(ci|cedula|identidad|documento)\\b', gen: ci },
    { key: 'rut', label: 'RUT', kind: 'company', main: true, match: '\\brut\\b', gen: rut },
  ],
};
