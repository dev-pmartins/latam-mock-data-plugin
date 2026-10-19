import { int, pick, digitString, letters } from '../random.js';

function rucDv(base10) {
  const sum = base10.split('').reduce((acc, d, i) => acc + Number(d) * [5, 4, 3, 2, 7, 6, 5, 4, 3, 2][i], 0);
  const r = 11 - (sum % 11);
  return r === 10 ? 0 : r === 11 ? 1 : r;
}

function dni() {
  const raw = digitString(8);
  return { raw, value: raw };
}

function rucPersona(ctx) {
  const base = '10' + (ctx.docs.dni ?? digitString(8));
  const raw = base + rucDv(base);
  return { raw, value: raw };
}

function rucEmpresa() {
  const base = '20' + digitString(8);
  const raw = base + rucDv(base);
  return { raw, value: raw };
}

const CITIES = [
  { city: 'Lima', state: 'Lima', abbr: 'LIM', area: '1', cp: ['15001', '15046', '15074', '15036', '15073', '15047'] },
  { city: 'Callao', state: 'Callao', abbr: 'CAL', area: '1', cp: ['07001', '07021'] },
  { city: 'Arequipa', state: 'Arequipa', abbr: 'ARE', area: '54', cp: ['04001'] },
  { city: 'Trujillo', state: 'La Libertad', abbr: 'LAL', area: '44', cp: ['13001'] },
  { city: 'Chiclayo', state: 'Lambayeque', abbr: 'LAM', area: '74', cp: ['14001'] },
  { city: 'Piura', state: 'Piura', abbr: 'PIU', area: '73', cp: ['20001'] },
  { city: 'Cusco', state: 'Cusco', abbr: 'CUS', area: '84', cp: ['08001'] },
  { city: 'Huancayo', state: 'Junín', abbr: 'JUN', area: '64', cp: ['12001'] },
  { city: 'Iquitos', state: 'Loreto', abbr: 'LOR', area: '65', cp: ['16001'] },
];

const STREETS = ['Arequipa', 'Javier Prado', 'Larco', 'Benavides', 'Pardo', 'La Marina', 'Brasil', 'Arenales', 'Petit Thouars', 'Angamos', 'Salaverry', 'Tacna', 'Grau', 'Bolognesi', 'Ayacucho', 'Ucayali'];

export default {
  code: 'PE',
  name: 'Peru',
  flag: '🇵🇪',
  doubleSurname: true,
  ddi: '51',
  cities: CITIES,
  neighborhoods: ['Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina', 'San Borja', 'Jesús María', 'Lince', 'Magdalena', 'Pueblo Libre', 'Cercado'],
  street: () => `${pick(['Av.', 'Jr.', 'Calle', 'Pasaje'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Dpto. ${int(101, 1802)}`, `Int. ${int(1, 20)}`, `Mz. ${letters(1, 'ABCDEFG')} Lt. ${int(1, 30)}`, `Oficina ${int(201, 1201)}`]),
  postal(city) {
    const raw = pick(city.cp);
    return { raw, value: raw };
  },
  mobile() {
    const local = '9' + digitString(8);
    return { national: local, value: `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` };
  },
  landline(city) {
    const local = String(int(2, 7)) + digitString(city.area === '1' ? 6 : 5);
    return { national: city.area + local, value: `(0${city.area}) ${local.slice(0, 3)} ${local.slice(3)}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.es', 'hotmail.es'],
  companySuffixes: ['S.A.C.', 'S.A.', 'E.I.R.L.', 'S.R.L.'],
  companyWords: ['Comercial', 'Servicios', 'Tecnología', 'Distribuidora', 'Inversiones', 'Transportes', 'Consultores', 'Alimentos', 'Constructora', 'Seguros'],
  plate() {
    const raw = letters(1) + pick([letters(1), String(int(0, 9))]) + letters(1) + digitString(3);
    return { raw, value: `${raw.slice(0, 3)}-${raw.slice(3)}` };
  },
  vinWmi: ['9BW', 'KMH', 'MA3', 'JTD', 'LGW', '9BG'],
  documents: [
    { key: 'dni', label: 'DNI', kind: 'person', main: true, match: '\\b(dni|documento nacional)\\b', gen: dni },
    { key: 'ruc', label: 'RUC (persona natural)', kind: 'person', match: '\\bruc\\b.*\\b(persona|natural)\\b', gen: rucPersona },
    { key: 'rucEmpresa', label: 'RUC (empresa)', kind: 'company', main: true, match: '\\bruc\\b', gen: rucEmpresa },
  ],
};
