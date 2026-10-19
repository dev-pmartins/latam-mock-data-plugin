import { int, pick, digitString, letters } from '../random.js';

function cedulaFor(province) {
  const base = province + String(int(0, 5)) + digitString(6);
  const sum = base.split('').reduce((acc, d, i) => {
    let p = Number(d) * (i % 2 === 0 ? 2 : 1);
    if (p >= 10) p -= 9;
    return acc + p;
  }, 0);
  return base + ((10 - (sum % 10)) % 10);
}

function cedula(ctx) {
  const raw = cedulaFor(ctx.city.province);
  return { raw, value: raw };
}

function rucPersona(ctx) {
  const raw = (ctx.docs.cedula ?? cedulaFor(ctx.city.province)) + '001';
  return { raw, value: raw };
}

function rucSociedad(ctx) {
  for (;;) {
    const base = ctx.city.province + '9' + digitString(6);
    const sum = base.split('').reduce((acc, d, i) => acc + Number(d) * [4, 3, 2, 7, 6, 5, 4, 3, 2][i], 0);
    let dv = 11 - (sum % 11);
    if (dv === 11) dv = 0;
    if (dv === 10) continue;
    const raw = base + dv + '001';
    return { raw, value: raw };
  }
}

const CITIES = [
  { city: 'Quito', state: 'Pichincha', abbr: 'P', province: '17', area: '2', cp: ['170'] },
  { city: 'Guayaquil', state: 'Guayas', abbr: 'G', province: '09', area: '4', cp: ['090'] },
  { city: 'Cuenca', state: 'Azuay', abbr: 'A', province: '01', area: '7', cp: ['010'] },
  { city: 'Ambato', state: 'Tungurahua', abbr: 'T', province: '18', area: '3', cp: ['180'] },
  { city: 'Manta', state: 'Manabí', abbr: 'M', province: '13', area: '5', cp: ['130'] },
  { city: 'Loja', state: 'Loja', abbr: 'L', province: '11', area: '7', cp: ['110'] },
  { city: 'Machala', state: 'El Oro', abbr: 'O', province: '07', area: '7', cp: ['070'] },
  { city: 'Ibarra', state: 'Imbabura', abbr: 'I', province: '10', area: '6', cp: ['100'] },
];

const STREETS = ['Amazonas', '10 de Agosto', '6 de Diciembre', 'República de El Salvador', 'Naciones Unidas', 'Shyris', 'Eloy Alfaro', '9 de Octubre', 'Malecón Simón Bolívar', 'Francisco de Orellana', 'Solano', 'Huayna Cápac', 'Colón', 'Patria', 'Orellana'];

export default {
  code: 'EC',
  name: 'Equador',
  flag: '🇪🇨',
  doubleSurname: true,
  ddi: '593',
  cities: CITIES,
  neighborhoods: ['La Carolina', 'La Floresta', 'Cumbayá', 'González Suárez', 'Urdesa', 'Kennedy', 'Samborondón', 'El Batán', 'Centro Histórico', 'Iñaquito'],
  street: () => `${pick(['Av.', 'Calle', 'Av.'])} ${pick(STREETS)}`,
  number: () => `${letters(1, 'NSEO')}${int(10, 60)}-${int(1, 250)}`,
  complement: () => pick(['', `Edificio ${pick(STREETS)}, Of. ${int(101, 1201)}`, `Dpto. ${int(1, 15)}${letters(1, 'ABC')}`, `Casa ${int(1, 40)}`]),
  postal(city) {
    const prefix = pick(city.cp);
    const raw = prefix + digitString(3);
    return { raw, value: raw };
  },
  mobile() {
    const local = '9' + int(5, 9) + digitString(7);
    return { national: '0' + local, value: `0${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}` };
  },
  landline(city) {
    const local = String(int(2, 6)) + digitString(6);
    return { national: '0' + city.area + local, value: `(0${city.area}) ${local.slice(0, 3)} ${local.slice(3)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.es', 'hotmail.es'],
  companySuffixes: ['S.A.', 'Cía. Ltda.', 'S.A.S.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Importadora', 'Transportes', 'Consultores', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(3) + digitString(4);
    return { raw, value: `${raw.slice(0, 3)}-${raw.slice(3)}` };
  },
  vinWmi: ['9BW', '9GA', 'KMH', 'MA3', 'JTD', 'LGW', '8LD'],
  documents: [
    { key: 'cedula', label: 'Cédula', kind: 'person', main: true, match: '\\b(cedula|ci|identidad|documento)\\b', gen: cedula },
    { key: 'ruc', label: 'RUC (persona natural)', kind: 'person', match: '\\bruc\\b.*\\b(persona|natural)\\b', gen: rucPersona },
    { key: 'rucEmpresa', label: 'RUC (sociedad)', kind: 'company', main: true, match: '\\bruc\\b', gen: rucSociedad },
  ],
};
