import { int, pick, digitString, letters, thousands } from '../random.js';

function rutDv(body) {
  let sum = 0;
  let w = 2;
  for (const d of String(body).split('').reverse()) {
    sum += Number(d) * w;
    w = w === 7 ? 2 : w + 1;
  }
  const r = 11 - (sum % 11);
  return r === 11 ? '0' : r === 10 ? 'K' : String(r);
}

const rut = (min, max) => () => {
  const body = int(min, max);
  const dv = rutDv(body);
  return { raw: `${body}${dv}`, value: `${thousands(body)}-${dv}` };
};

const CITIES = [
  { city: 'Santiago', state: 'Región Metropolitana', abbr: 'RM', area: '2', cp: ['83', '75', '76', '77'] },
  { city: 'Providencia', state: 'Región Metropolitana', abbr: 'RM', area: '2', cp: ['750'] },
  { city: 'Las Condes', state: 'Región Metropolitana', abbr: 'RM', area: '2', cp: ['755', '756'] },
  { city: 'Valparaíso', state: 'Región de Valparaíso', abbr: 'V', area: '32', cp: ['236', '237'] },
  { city: 'Viña del Mar', state: 'Región de Valparaíso', abbr: 'V', area: '32', cp: ['252', '254'] },
  { city: 'Concepción', state: 'Región del Biobío', abbr: 'VIII', area: '41', cp: ['403', '407'] },
  { city: 'La Serena', state: 'Región de Coquimbo', abbr: 'IV', area: '51', cp: ['170'] },
  { city: 'Antofagasta', state: 'Región de Antofagasta', abbr: 'II', area: '55', cp: ['124', '127'] },
  { city: 'Temuco', state: 'Región de La Araucanía', abbr: 'IX', area: '45', cp: ['478', '479'] },
  { city: 'Puerto Montt', state: 'Región de Los Lagos', abbr: 'X', area: '65', cp: ['548', '550'] },
];

const STREETS = ['Libertador Bernardo O\'Higgins', 'Providencia', 'Apoquindo', 'Vicuña Mackenna', 'Irarrázaval', 'Los Leones', 'Manuel Montt', 'Pedro de Valdivia', 'Matta', 'Grecia', 'Arturo Prat', 'Esmeralda', 'Balmaceda', 'Colón', 'Los Carrera'];

export default {
  code: 'CL',
  name: 'Chile',
  flag: '🇨🇱',
  doubleSurname: true,
  ddi: '56',
  cities: CITIES,
  neighborhoods: ['Ñuñoa', 'Bellavista', 'Lastarria', 'Barrio Italia', 'El Golf', 'Vitacura', 'La Florida', 'Maipú', 'San Miguel', 'Centro'],
  street: () => `${pick(['Calle', 'Avenida', 'Av.', 'Pasaje'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Depto ${int(101, 2210)}`, `Oficina ${int(101, 1500)}`, `Casa ${letters(1, 'ABCD')}`]),
  postal(city) {
    const prefix = pick(city.cp);
    const raw = prefix + digitString(7 - prefix.length);
    return { raw, value: raw };
  },
  mobile() {
    const local = digitString(8);
    return { national: '9' + local, value: `9 ${local.slice(0, 4)} ${local.slice(4)}` };
  },
  landline(city) {
    // Santiago (2) usa 8 dígitos locais iniciando em 2; demais regiões, 7.
    const local = (city.area === '2' ? '2' : '') + String(int(2, 9)) + digitString(6);
    const national = city.area + local;
    return { national, value: `(${city.area}) ${local.slice(0, local.length - 4)} ${local.slice(-4)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.cl', 'vtr.net'],
  companySuffixes: ['SpA', 'Ltda.', 'S.A.', 'E.I.R.L.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Inversiones', 'Transportes', 'Asesorías', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(4, 'BCDFGHJKLPRSTVWXYZ') + digitString(2);
    return { raw, value: `${raw.slice(0, 2)}·${raw.slice(2, 4)}·${raw.slice(4)}` };
  },
  vinWmi: ['9BW', '8AG', 'KMH', 'MA3', 'JTD', 'LGW'],
  documents: [
    { key: 'rut', label: 'RUT / RUN', kind: 'person', main: true, match: '\\b(rut|run|rol unico)\\b', gen: rut(8000000, 25999999) },
    { key: 'rutEmpresa', label: 'RUT empresa', kind: 'company', main: true, match: '\\brut\\b.*\\b(empresa|compania|sociedad)\\b|\\b(empresa|compania|sociedad)\\b.*\\brut\\b', gen: rut(76000000, 77999999) },
  ],
};
