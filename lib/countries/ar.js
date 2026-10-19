import { int, pick, digitString, letters, mask, thousands } from '../random.js';

function cuitDv(prefix, body) {
  const n = (prefix + body).split('').map(Number);
  const sum = n.reduce((acc, d, i) => acc + d * [5, 4, 3, 2, 7, 6, 5, 4, 3, 2][i], 0);
  const r = 11 - (sum % 11);
  if (r === 11) return 0;
  if (r === 10) return null;
  return r;
}

function dni() {
  const num = int(20000000, 49999999);
  return { raw: String(num), value: thousands(num) };
}

function cuil(ctx) {
  const prefixes = ctx.gender === 'F' ? ['27', '23'] : ['20', '23'];
  for (;;) {
    const body = ctx.docs.dni ?? String(int(20000000, 49999999));
    for (const prefix of prefixes) {
      const dv = cuitDv(prefix, body);
      if (dv !== null) {
        const raw = prefix + body + dv;
        return { raw, value: mask(raw, '##-########-#') };
      }
    }
    ctx.docs.dni = null;
  }
}

function cuit() {
  for (;;) {
    const prefix = pick(['30', '33']);
    const body = digitString(8);
    const dv = cuitDv(prefix, body);
    if (dv === null) continue;
    const raw = prefix + body + dv;
    return { raw, value: mask(raw, '##-########-#') };
  }
}

const CITIES = [
  { city: 'Buenos Aires', state: 'Ciudad Autónoma de Buenos Aires', abbr: 'CABA', area: '11', cp: ['1000', '1405', '1414', '1425', '1428', '1406'] },
  { city: 'La Plata', state: 'Buenos Aires', abbr: 'BA', area: '221', cp: ['1900'] },
  { city: 'Mar del Plata', state: 'Buenos Aires', abbr: 'BA', area: '223', cp: ['7600'] },
  { city: 'Córdoba', state: 'Córdoba', abbr: 'CB', area: '351', cp: ['5000'] },
  { city: 'Rosario', state: 'Santa Fe', abbr: 'SF', area: '341', cp: ['2000'] },
  { city: 'Santa Fe', state: 'Santa Fe', abbr: 'SF', area: '342', cp: ['3000'] },
  { city: 'Mendoza', state: 'Mendoza', abbr: 'MZ', area: '261', cp: ['5500'] },
  { city: 'San Miguel de Tucumán', state: 'Tucumán', abbr: 'TM', area: '381', cp: ['4000'] },
  { city: 'Salta', state: 'Salta', abbr: 'SA', area: '387', cp: ['4400'] },
  { city: 'Neuquén', state: 'Neuquén', abbr: 'NQ', area: '299', cp: ['8300'] },
  { city: 'Bahía Blanca', state: 'Buenos Aires', abbr: 'BA', area: '291', cp: ['8000'] },
];

const STREETS = ['San Martín', 'Belgrano', 'Rivadavia', 'Sarmiento', 'Mitre', '9 de Julio', '25 de Mayo', 'Moreno', 'Corrientes', 'Santa Fe', 'Callao', 'Pueyrredón', 'Alem', 'Libertador', 'Las Heras', 'Güemes', 'Lavalle', 'Urquiza'];

function phone(city, mobile) {
  const localLen = 10 - city.area.length;
  const local = String(int(2, 6)) + digitString(localLen - 1);
  const split = local.length - 4;
  const formatted = `${local.slice(0, split)}-${local.slice(split)}`;
  if (mobile) {
    return { national: city.area + local, intl: '9' + city.area + local, value: `(${city.area}) 15-${formatted}` };
  }
  return { national: city.area + local, value: `(0${city.area}) ${formatted}` };
}

export default {
  code: 'AR',
  name: 'Argentina',
  flag: '🇦🇷',
  doubleSurname: false,
  ddi: '54',
  cities: CITIES,
  neighborhoods: ['Palermo', 'Recoleta', 'Belgrano', 'Caballito', 'San Telmo', 'Villa Crespo', 'Almagro', 'Núñez', 'Centro', 'Barrio Norte', 'Nueva Córdoba', 'Fisherton'],
  street: () => `${pick(['Calle', 'Av.', 'Av.', 'Pasaje'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Piso ${int(1, 15)} Depto ${letters(1, 'ABCDEF')}`, `Depto ${int(1, 20)}`, `PB ${letters(1, 'ABC')}`]),
  postal(city) {
    const raw = pick(city.cp);
    return { raw, value: raw };
  },
  mobile: (city) => phone(city, true),
  landline: (city) => phone(city, false),
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.ar', 'hotmail.com.ar', 'live.com.ar'],
  companySuffixes: ['S.A.', 'S.R.L.', 'S.A.S.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Industrias', 'Transportes', 'Consultora', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(2) + digitString(3) + letters(2);
    return { raw, value: `${raw.slice(0, 2)} ${raw.slice(2, 5)} ${raw.slice(5)}` };
  },
  vinWmi: ['8AW', '8AF', '8AG', '8AP', '8AD', '8AJ', '8A1'],
  documents: [
    { key: 'dni', label: 'DNI', kind: 'person', main: true, match: '\\b(dni|documento nacional)\\b', gen: dni },
    { key: 'cuil', label: 'CUIL', kind: 'person', match: '\\bcuil\\b', gen: cuil },
    { key: 'cuit', label: 'CUIT', kind: 'company', main: true, match: '\\bcuit\\b', gen: cuit },
  ],
};
