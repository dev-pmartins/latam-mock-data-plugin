import { int, pick, chance, pad, digitString, slug, letters } from './random.js';
import { NAMES } from './names.js';

// Grupos exibidos no popup e no menu de contexto (na ordem).
export const GROUPS = ['Pessoa', 'Documentos', 'Contato', 'Endereço', 'Empresa', 'Veículo', 'Pagamento', 'Acesso'];

export const COUNTRY_ALTS = {
  AR: ['Argentina'], BO: ['Bolivia', 'Bolívia'], BR: ['Brasil', 'Brazil'], CL: ['Chile'],
  CO: ['Colombia', 'Colômbia'], EC: ['Ecuador', 'Equador'], GY: ['Guyana', 'Guiana'], PE: ['Perú', 'Peru'],
  PY: ['Paraguay', 'Paraguai'], SR: ['Suriname'], UY: ['Uruguay', 'Uruguai'], VE: ['Venezuela'],
};

// Regras de detecção dos campos comuns. `priority` menor é testado primeiro
// (do mais específico para o mais genérico).
const COMMON = {
  email: { priority: 10, match: '\\b(e ?mail|correo|email)\\b' },
  cardCvv: { priority: 12, match: '\\b(cvv|cvc|csc|cvv2|codigo de seguranca|codigo de seguridad|security code)\\b' },
  cardExpiry: { priority: 12, match: '\\b(validade|expir\\w*|vencimiento|exp date|expiry|mm ?aa|mm ?yy)\\b' },
  cardHolder: { priority: 13, match: '\\b(nome (impresso )?no cartao|titular|card ?holder|name on card|nombre en la tarjeta)\\b' },
  cardNumber: { priority: 14, match: '\\b(cartao|card|tarjeta|cc ?num\\w*|credit)\\b' },
  motherName: { priority: 15, match: '\\b(mae|mother|madre|filiacao)\\b' },
  renavam: { priority: 28 },
  vin: { priority: 29, match: '\\b(chassi|chassis|chasis|vin|serie do veiculo)\\b' },
  plate: { priority: 30, match: '\\b(placa|plate|patente|matricula|license|licence|nummerbord)\\b' },
  password: { priority: 32, match: '\\b(senha|password|passwd|contrasena|clave|wachtwoord)\\b' },
  username: { priority: 33, match: '\\b(usuario|username|login|user|nick\\w*)\\b' },
  companyName: { priority: 35, match: '\\b(empresa|razao social|razon social|company|companhia|compania|organiza\\w*|employer|nome fantasia|business)\\b' },
  lastName: { priority: 40, match: '\\b(sobrenome|apellidos?|last ?name|surname|family ?name|achternaam|lname)\\b' },
  firstName: { priority: 41, match: '\\b(primeiro nome|first ?name|given ?name|nombres|forename|voornaam|fname)\\b' },
  birthDate: { priority: 45, match: '\\b(nascimento|nasc|birth\\w*|nacimiento|dob|aniversario|bday|geboortedatum)\\b' },
  gender: { priority: 46, match: '\\b(sexo|genero|gender|sex|geslacht)\\b' },
  fullName: { priority: 50, match: '\\b(nome|name|nombre|naam|full ?name)\\b' },
  phoneIntl: { priority: 54, match: '\\b(internacional|international|e164)\\b' },
  mobile: { priority: 55, match: '\\b(celular|cel|mobile|movil|whats\\w*|cell\\w*|mobiel)\\b' },
  phone: { priority: 56, match: '\\b(telefone|fone|phone|telefono|tel|fijo|landline|telefoon)\\b' },
  postalCode: { priority: 60, match: '\\b(cep|zip|postal|codigo postal|cp|postcode|zipcode)\\b' },
  fullAddress: { priority: 61, match: '\\b(endereco completo|full address|direccion completa)\\b' },
  number: { priority: 62, match: '\\b(numero|number|nro|num|huisnummer)\\b' },
  complement: { priority: 63, match: '\\b(complemento|complement|apto|apartamento|apartment|piso|suite|address ?line ?2|address2)\\b' },
  neighborhood: { priority: 64, match: '\\b(bairro|barrio|neighbou?rhood|district|distrito|comuna|colonia|urbanizacion|wijk)\\b' },
  city: { priority: 65, match: '\\b(cidade|city|ciudad|municipio|localidade|localidad|town|plaats|stad)\\b' },
  stateAbbr: { priority: 66, match: '\\b(uf|sigla)\\b' },
  state: { priority: 67, match: '\\b(estado|state|provincia|departamento|region|province|distrikt)\\b' },
  country: { priority: 68, match: '\\b(pais|country|land)\\b' },
  street: { priority: 70, match: '\\b(rua|logradouro|endereco|street|address|direccion|calle|domicilio|straat|adres)\\b' },
};

function buildPerson(country) {
  const names = NAMES[country.code];
  const gender = chance(0.5) ? 'M' : 'F';
  const first = pick(gender === 'M' ? names.male : names.female);
  const surnames = [];

  if (country.code === 'BR') {
    // Brasil: nome + (nome do meio) + sobrenome materno + sobrenome paterno
    if (chance(0.3)) surnames.push(pick(names.surnames));
    surnames.push(pick(names.surnames));
    while (surnames.length < 2 && chance(0.6)) {
      const s = pick(names.surnames);
      if (!surnames.includes(s)) surnames.push(s);
    }
  } else if (country.doubleSurname) {
    // Países hispânicos: apellido paterno + apellido materno
    const paterno = pick(names.surnames);
    let materno = pick(names.surnames);
    while (materno === paterno) materno = pick(names.surnames);
    surnames.push(paterno, materno);
  } else {
    surnames.push(pick(names.surnames));
    if (['AR', 'UY'].includes(country.code) && chance(0.2)) surnames.push(pick(names.surnames));
  }

  const middle = country.code === 'BR' && chance(0.35)
    ? pick((gender === 'M' ? names.middleMale : names.middleFemale).filter((m) => m !== first))
    : '';
  const firstFull = middle ? `${first} ${middle}` : first;

  // Mãe: compartilha um dos sobrenomes do filho, como é comum na região.
  let motherSurnames;
  if (country.doubleSurname) {
    motherSurnames = [surnames[1], pick(names.surnames)];
  } else if (country.code === 'BR') {
    motherSurnames = [pick(names.surnames), surnames[0]];
  } else {
    motherSurnames = [pick(names.surnames)];
  }
  const mother = `${pick(names.female)} ${motherSurnames.join(' ')}`;

  return { gender, first: firstFull, last: surnames.join(' '), full: `${firstFull} ${surnames.join(' ')}`, mother };
}

function birthDate() {
  const today = new Date();
  const age = int(18, 75);
  const d = new Date(today.getFullYear() - age, int(0, 11), int(1, 28));
  const dd = pad(d.getDate(), 2);
  const mm = pad(d.getMonth() + 1, 2);
  const yyyy = d.getFullYear();
  return { value: `${dd}/${mm}/${yyyy}`, raw: `${dd}${mm}${yyyy}`, iso: `${yyyy}-${mm}-${dd}` };
}

function password() {
  const sets = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!@#$%&*?'];
  const chars = sets.map((s) => pick(s));
  while (chars.length < 12) chars.push(pick(sets.join('')));
  return chars.sort(() => Math.random() - 0.5).join('');
}

const luhnComplete = (partial) => {
  let sum = 0;
  const reversed = partial.split('').reverse();
  reversed.forEach((d, i) => {
    let n = Number(d);
    if (i % 2 === 0) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  });
  return partial + ((10 - (sum % 10)) % 10);
};

function card() {
  const brand = pick(['visa', 'master']);
  const prefix = brand === 'visa' ? '4' : String(int(51, 55));
  const number = luhnComplete(prefix + digitString(15 - prefix.length));
  const exp = new Date();
  exp.setMonth(exp.getMonth() + int(6, 60));
  const mm = pad(exp.getMonth() + 1, 2);
  const yy = pad(exp.getFullYear() % 100, 2);
  return {
    number: { raw: number, value: number.replace(/(\d{4})(?=\d)/g, '$1 ') },
    expiry: { raw: mm + yy, value: `${mm}/${yy}` },
    cvv: digitString(3),
    brand: brand === 'visa' ? 'Visa' : 'Mastercard',
  };
}

const VIN_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
const VIN_TRANSLIT = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 };
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const VIN_YEARS = 'LMNPRST'; // códigos de ano-modelo 2020..2026

function vin(country) {
  const chars = (pick(country.vinWmi) + letters(5, VIN_CHARS) + '0' + pick(VIN_YEARS) + letters(1, VIN_CHARS) + digitString(6)).split('');
  const sum = chars.reduce((acc, c, i) => acc + (/\d/.test(c) ? Number(c) : VIN_TRANSLIT[c]) * VIN_WEIGHTS[i], 0);
  const r = sum % 11;
  chars[8] = r === 10 ? 'X' : String(r);
  const raw = chars.join('');
  return { raw, value: raw };
}

function companyName(country, person) {
  const names = NAMES[country.code];
  const word = pick(country.companyWords);
  const suffix = pick(country.companySuffixes);
  const s1 = person.last.split(' ')[0];
  const s2 = pick(names.surnames);
  return pick([
    `${s1} ${word} ${suffix}`,
    `${word} ${s2} ${suffix}`,
    `${s1} & ${s2} ${word} ${suffix}`,
  ]);
}

function email(person, country, customDomain) {
  const first = slug(person.first.split(' ')[0]);
  const last = slug(person.last.split(' ')[0]);
  const user = pick([`${first}.${last}`, `${first}${last}`, `${first}_${last}`, `${first[0]}${last}`]) + (chance(0.6) ? int(1, 999) : '');
  const domain = (customDomain || '').replace(/^@/, '').trim() || pick(country.emailDomains);
  return `${user}@${domain}`;
}

function phoneValues(p, country) {
  const intlBody = p.intl ?? p.national.replace(/^0/, '');
  return {
    local: { value: p.value, raw: p.national },
    intl: { value: `+${country.ddi} ${intlBody}`, raw: `+${country.ddi}${intlBody}` },
  };
}

/**
 * Gera um perfil coerente (mesma pessoa, endereço, empresa…) para o país.
 * Retorna uma lista de campos { key, label, group, value, ... } já formatados
 * conforme a opção `masked`.
 */
export function generateProfile(country, { masked = true, emailDomain = '' } = {}) {
  const person = buildPerson(country);
  const city = pick(country.cities);
  const fields = [];
  // Cada campo guarda as versões com e sem máscara; `value` é a escolhida.
  const add = (key, label, group, data, extra = {}) => {
    const formatted = typeof data === 'string' ? data : data.value;
    const raw = typeof data === 'string' ? data : data.raw;
    fields.push({ key, label, group, formatted, raw, value: masked ? formatted : raw, ...COMMON[key], ...extra });
  };

  // Pessoa
  add('fullName', 'Nome completo', 'Pessoa', person.full);
  add('firstName', 'Primeiro nome', 'Pessoa', person.first);
  add('lastName', 'Sobrenome', 'Pessoa', person.last);
  add('gender', 'Sexo', 'Pessoa', person.gender === 'M' ? 'Masculino' : 'Feminino', {
    alts: person.gender === 'M' ? ['M', 'Masculino', 'Male', 'Hombre', 'Man', 'H'] : ['F', 'Feminino', 'Female', 'Mujer', 'Femenino', 'Vrouw', 'V'],
  });
  const bd = birthDate();
  add('birthDate', 'Data de nascimento', 'Pessoa', bd, { iso: bd.iso });
  add('motherName', 'Nome da mãe', 'Pessoa', person.mother);

  // Documentos (pessoa e empresa) — o contexto permite documentos derivados (ex.: CUIL a partir do DNI).
  const ctx = { gender: person.gender, city, docs: {} };
  for (const doc of country.documents) {
    const result = doc.gen(ctx);
    ctx.docs[doc.key] = result.raw;
    const group = doc.kind === 'company' ? 'Empresa' : 'Documentos';
    const priority = doc.main ? (doc.kind === 'company' ? 22 : 25) : 20;
    add(`doc:${doc.key}`, doc.label, group, result, { match: doc.match, priority, doc: true, main: !!doc.main, kind: doc.kind });
  }

  // Contato
  add('email', 'E-mail', 'Contato', email(person, country, emailDomain));
  const mobile = phoneValues(country.mobile(city), country);
  add('mobile', 'Celular', 'Contato', mobile.local);
  add('phoneIntl', 'Celular (internacional)', 'Contato', mobile.intl);
  add('phone', 'Telefone fixo', 'Contato', phoneValues(country.landline(city), country).local);

  // Endereço
  const postal = country.postal ? country.postal(city) : null;
  const street = country.street();
  const number = country.number ? country.number() : String(int(1, 3500));
  const complement = country.complement();
  const neighborhood = pick(country.neighborhoods);
  if (postal) add('postalCode', country.code === 'BR' ? 'CEP' : 'Código postal', 'Endereço', postal);
  add('street', 'Logradouro', 'Endereço', street);
  add('number', 'Número', 'Endereço', number);
  let complementField = complement;
  while (!complementField) complementField = country.complement();
  add('complement', 'Complemento', 'Endereço', complementField);
  add('neighborhood', 'Bairro', 'Endereço', neighborhood);
  add('city', 'Cidade', 'Endereço', city.city);
  add('state', 'Estado / Província', 'Endereço', city.state, { alts: [city.state, city.abbr] });
  add('stateAbbr', country.code === 'BR' ? 'UF' : 'Sigla do estado', 'Endereço', city.abbr, { alts: [city.abbr, city.state] });
  add('country', 'País', 'Endereço', COUNTRY_ALTS[country.code][0], { alts: [country.code, ...COUNTRY_ALTS[country.code], country.name] });

  const line1 = country.numberFirst ? `${number} ${street}` : `${street}, ${number}`;
  const parts = [complement ? `${line1} - ${complement}` : line1, neighborhood];
  if (country.code === 'BR') {
    parts.push(`${city.city} - ${city.abbr}`);
  } else {
    parts.push(city.city, city.state);
  }
  if (postal) parts.push(postal.value);
  add('fullAddress', 'Endereço completo', 'Endereço', parts.join(', '));

  // Empresa
  add('companyName', 'Razão social', 'Empresa', companyName(country, person));

  // Veículo
  add('plate', 'Placa', 'Veículo', country.plate());
  add('vin', 'Chassi (VIN)', 'Veículo', vin(country));
  for (const doc of country.vehicleDocuments ?? []) {
    add(doc.key, doc.label, 'Veículo', doc.gen(), { match: doc.match });
  }

  // Pagamento (números de teste, válidos apenas pelo algoritmo de Luhn)
  const cc = card();
  add('cardNumber', 'Cartão de crédito', 'Pagamento', cc.number, { hint: cc.brand });
  add('cardHolder', 'Nome no cartão', 'Pagamento', slug(person.first.split(' ')[0]).toUpperCase() + ' ' + slug(person.last.split(' ').pop()).toUpperCase());
  add('cardExpiry', 'Validade', 'Pagamento', cc.expiry);
  add('cardCvv', 'CVV', 'Pagamento', cc.cvv);

  // Acesso
  add('username', 'Usuário', 'Acesso', `${slug(person.first.split(' ')[0])}.${slug(person.last.split(' ')[0])}${int(1, 99)}`);
  add('password', 'Senha', 'Acesso', password());

  return { country: country.code, fields };
}
