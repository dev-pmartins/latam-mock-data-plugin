import { int, pick, digits, digitString, letters, mask } from '../random.js';

const mod11Dv = (nums, weights) => {
  const sum = nums.reduce((acc, n, i) => acc + n * weights[i], 0);
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
};

function cpf() {
  const n = digits(9);
  n.push(mod11Dv(n, [10, 9, 8, 7, 6, 5, 4, 3, 2]));
  n.push(mod11Dv(n, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]));
  const raw = n.join('');
  return { raw, value: mask(raw, '###.###.###-##') };
}

function cnpj() {
  const n = [...digits(8), 0, 0, 0, 1];
  n.push(mod11Dv(n, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]));
  n.push(mod11Dv(n, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]));
  const raw = n.join('');
  return { raw, value: mask(raw, '##.###.###/####-##') };
}

// RG no padrão SSP-SP (dígito pode ser "X").
function rg() {
  const n = digits(8);
  const r = n.reduce((acc, d, i) => acc + d * (i + 2), 0) % 11;
  const dv = r === 10 ? 'X' : String(r);
  const raw = n.join('') + dv;
  return { raw, value: mask(raw, '##.###.###-#') };
}

function cnh() {
  for (;;) {
    const n = digits(9);
    const dv1 = n.reduce((acc, d, i) => acc + d * (9 - i), 0) % 11;
    if (dv1 >= 10) continue;
    const x = n.reduce((acc, d, i) => acc + d * (i + 1), 0) % 11;
    const dv2 = x >= 10 ? 0 : x;
    const raw = n.join('') + dv1 + dv2;
    return { raw, value: raw };
  }
}

function pis() {
  const n = digits(10);
  const sum = n.reduce((acc, d, i) => acc + d * [3, 2, 9, 8, 7, 6, 5, 4, 3, 2][i], 0);
  const r = 11 - (sum % 11);
  n.push(r >= 10 ? 0 : r);
  const raw = n.join('');
  return { raw, value: mask(raw, '###.#####.##-#') };
}

function renavam() {
  const n = digits(10);
  const sum = n.reduce((acc, d, i) => acc + d * [3, 2, 9, 8, 7, 6, 5, 4, 3, 2][i], 0);
  const dv = (sum * 10) % 11;
  const raw = n.join('') + (dv === 10 ? 0 : dv);
  return { raw, value: raw };
}

function tituloEleitor() {
  const seq = digitString(8).split('').map(Number);
  const uf = int(1, 28);
  const ufDigits = String(uf).padStart(2, '0').split('').map(Number);
  let dv1 = seq.reduce((acc, d, i) => acc + d * (i + 2), 0) % 11;
  if (dv1 === 10) dv1 = 0;
  if (dv1 === 0 && (uf === 1 || uf === 2)) dv1 = 1;
  let dv2 = (ufDigits[0] * 7 + ufDigits[1] * 8 + dv1 * 9) % 11;
  if (dv2 === 10) dv2 = 0;
  if (dv2 === 0 && (uf === 1 || uf === 2)) dv2 = 1;
  const raw = seq.join('') + ufDigits.join('') + dv1 + dv2;
  return { raw, value: mask(raw, '#### #### ####') };
}

const CITIES = [
  { city: 'São Paulo', state: 'São Paulo', abbr: 'SP', ddd: ['11'], cep: ['01', '02', '03', '04', '05', '08'] },
  { city: 'Campinas', state: 'São Paulo', abbr: 'SP', ddd: ['19'], cep: ['130', '131'] },
  { city: 'Rio de Janeiro', state: 'Rio de Janeiro', abbr: 'RJ', ddd: ['21'], cep: ['20', '21', '22', '23'] },
  { city: 'Niterói', state: 'Rio de Janeiro', abbr: 'RJ', ddd: ['21'], cep: ['240', '241'] },
  { city: 'Belo Horizonte', state: 'Minas Gerais', abbr: 'MG', ddd: ['31'], cep: ['30', '31'] },
  { city: 'Uberlândia', state: 'Minas Gerais', abbr: 'MG', ddd: ['34'], cep: ['384'] },
  { city: 'Vitória', state: 'Espírito Santo', abbr: 'ES', ddd: ['27'], cep: ['290'] },
  { city: 'Curitiba', state: 'Paraná', abbr: 'PR', ddd: ['41'], cep: ['80', '81', '82'] },
  { city: 'Londrina', state: 'Paraná', abbr: 'PR', ddd: ['43'], cep: ['860'] },
  { city: 'Florianópolis', state: 'Santa Catarina', abbr: 'SC', ddd: ['48'], cep: ['880'] },
  { city: 'Joinville', state: 'Santa Catarina', abbr: 'SC', ddd: ['47'], cep: ['892'] },
  { city: 'Porto Alegre', state: 'Rio Grande do Sul', abbr: 'RS', ddd: ['51'], cep: ['90', '91'] },
  { city: 'Salvador', state: 'Bahia', abbr: 'BA', ddd: ['71'], cep: ['40', '41'] },
  { city: 'Recife', state: 'Pernambuco', abbr: 'PE', ddd: ['81'], cep: ['50', '51', '52'] },
  { city: 'Fortaleza', state: 'Ceará', abbr: 'CE', ddd: ['85'], cep: ['60'] },
  { city: 'Natal', state: 'Rio Grande do Norte', abbr: 'RN', ddd: ['84'], cep: ['590'] },
  { city: 'João Pessoa', state: 'Paraíba', abbr: 'PB', ddd: ['83'], cep: ['580'] },
  { city: 'Maceió', state: 'Alagoas', abbr: 'AL', ddd: ['82'], cep: ['570'] },
  { city: 'Aracaju', state: 'Sergipe', abbr: 'SE', ddd: ['79'], cep: ['490'] },
  { city: 'São Luís', state: 'Maranhão', abbr: 'MA', ddd: ['98'], cep: ['650'] },
  { city: 'Teresina', state: 'Piauí', abbr: 'PI', ddd: ['86'], cep: ['640'] },
  { city: 'Belém', state: 'Pará', abbr: 'PA', ddd: ['91'], cep: ['660'] },
  { city: 'Manaus', state: 'Amazonas', abbr: 'AM', ddd: ['92'], cep: ['690'] },
  { city: 'Goiânia', state: 'Goiás', abbr: 'GO', ddd: ['62'], cep: ['740'] },
  { city: 'Brasília', state: 'Distrito Federal', abbr: 'DF', ddd: ['61'], cep: ['70', '71', '72'] },
  { city: 'Campo Grande', state: 'Mato Grosso do Sul', abbr: 'MS', ddd: ['67'], cep: ['790'] },
  { city: 'Cuiabá', state: 'Mato Grosso', abbr: 'MT', ddd: ['65'], cep: ['780'] },
];

const NEIGHBORHOODS = ['Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'Santa Cruz', 'Jardim Paulista', 'Vila Mariana', 'Copacabana', 'Savassi', 'Batel', 'Moinhos de Vento', 'Barra', 'Boa Viagem', 'Aldeota', 'Jardim das Flores', 'São José', 'Santo Antônio', 'Liberdade', 'Bela Vista', 'Cidade Nova'];

const STREETS = ['das Flores', 'São João', 'Brasil', 'Paulista', 'XV de Novembro', 'Sete de Setembro', 'Tiradentes', 'Dom Pedro II', 'Santos Dumont', 'Rui Barbosa', 'Getúlio Vargas', 'Marechal Deodoro', 'José Bonifácio', 'Castro Alves', 'Machado de Assis', 'das Palmeiras', 'dos Andradas', 'Barão do Rio Branco', 'Princesa Isabel', 'Monteiro Lobato'];

export default {
  code: 'BR',
  name: 'Brasil',
  flag: '🇧🇷',
  ddi: '55',
  cities: CITIES,
  neighborhoods: NEIGHBORHOODS,
  street: () => `${pick(['Rua', 'Rua', 'Avenida', 'Travessa', 'Alameda'])} ${pick(STREETS)}`,
  complement: () => pick(['', `Apto ${int(1, 30)}${int(0, 1)}${int(1, 4)}`, `Casa ${int(1, 5)}`, `Bloco ${letters(1, 'ABCD')} Apto ${int(11, 154)}`, `Sala ${int(101, 1210)}`]),
  postal(city) {
    const prefix = pick(city.cep);
    const raw = prefix + digitString(8 - prefix.length);
    return { raw, value: mask(raw, '#####-###') };
  },
  mobile(city) {
    const ddd = pick(city.ddd);
    const local = '9' + int(6, 9) + digitString(7);
    return { national: ddd + local, value: `(${ddd}) ${mask(local, '#####-####')}` };
  },
  landline(city) {
    const ddd = pick(city.ddd);
    const local = String(int(2, 5)) + digitString(7);
    return { national: ddd + local, value: `(${ddd}) ${mask(local, '####-####')}` };
  },
  emailDomains: ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br', 'bol.com.br', 'terra.com.br'],
  companySuffixes: ['Ltda', 'S.A.', 'ME', 'EPP', 'Ltda'],
  companyWords: ['Comércio', 'Serviços', 'Tecnologia', 'Distribuidora', 'Indústria', 'Transportes', 'Consultoria', 'Alimentos', 'Construtora', 'Seguros'],
  plate() {
    const raw = letters(3) + int(0, 9) + letters(1) + digitString(2);
    return { raw, value: raw };
  },
  vinWmi: ['9BW', '9BD', '9BG', '93H', '9BR', '93Y', '9BF', '936'],
  documents: [
    { key: 'cpf', label: 'CPF', kind: 'person', main: true, match: '\\bcpf\\b', gen: cpf },
    { key: 'rg', label: 'RG', kind: 'person', match: '\\b(rg|identidade|registro geral)\\b', gen: rg },
    { key: 'cnh', label: 'CNH', kind: 'person', match: '\\b(cnh|habilitacao|carteira de motorista)\\b', gen: cnh },
    { key: 'pis', label: 'PIS/PASEP', kind: 'person', match: '\\b(pis|pasep|nit|nis)\\b', gen: pis },
    { key: 'titulo', label: 'Título de eleitor', kind: 'person', match: '\\b(titulo|eleitor)\\b', gen: tituloEleitor },
    { key: 'cnpj', label: 'CNPJ', kind: 'company', main: true, match: '\\bcnpj\\b', gen: cnpj },
  ],
  vehicleDocuments: [
    { key: 'renavam', label: 'RENAVAM', match: '\\brenavam\\b', gen: renavam },
  ],
};
