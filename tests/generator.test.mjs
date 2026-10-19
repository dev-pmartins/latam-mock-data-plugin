// Executar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COUNTRIES, getCountry } from '../lib/countries/index.js';
import { generateProfile } from '../lib/generator.js';
import { NAMES } from '../lib/names.js';

const RUNS = 300;
const only = (s) => String(s).replace(/\D/g, '');
const field = (profile, key) => profile.fields.find((f) => f.key === key)?.value;
const raw = (code, key) => field(generateProfile(getCountry(code), { masked: false }), key);
const repeat = (fn) => { for (let i = 0; i < RUNS; i++) fn(); };

// Validadores independentes (escritos a partir das especificações oficiais).
const validCpf = (v) => {
  const d = only(v).split('').map(Number);
  const dv = (n) => { const s = d.slice(0, n).reduce((a, x, i) => a + x * (n + 1 - i), 0); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return d.length === 11 && dv(9) === d[9] && dv(10) === d[10];
};
const validCnpj = (v) => {
  const d = only(v).split('').map(Number);
  const dv = (n) => { let w = n - 7; let s = 0; for (let i = 0; i < n; i++) { s += d[i] * w--; if (w < 2) w = 9; } const r = s % 11; return r < 2 ? 0 : 11 - r; };
  return d.length === 14 && dv(12) === d[12] && dv(13) === d[13];
};
const validCuit = (v) => {
  const d = only(v).split('').map(Number);
  const s = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2].reduce((a, w, i) => a + w * d[i], 0);
  const r = 11 - (s % 11);
  return d.length === 11 && (r === 11 ? 0 : r) === d[10];
};
const validRut = (v) => {
  const body = v.slice(0, -1); const dv = v.slice(-1).toUpperCase();
  let m = 0; let s = 1;
  for (let t = Number(body); t; t = Math.floor(t / 10)) s = (s + (t % 10) * (9 - (m++ % 6))) % 11;
  return (s ? String(s - 1) : 'K') === dv;
};
const validNit = (v) => {
  const d = only(v); const body = d.slice(0, -1);
  const w = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const s = body.split('').reverse().reduce((a, x, i) => a + Number(x) * w[i], 0) % 11;
  return (s > 1 ? 11 - s : s) === Number(d.slice(-1));
};
const validRucPe = (v) => {
  const d = only(v).split('').map(Number);
  const s = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2].reduce((a, w, i) => a + w * d[i], 0);
  return d.length === 11 && (11 - (s % 11)) % 10 === d[10];
};
const validCiUy = (v) => {
  const d = only(v).padStart(8, '0').split('').map(Number);
  const s = [2, 9, 8, 7, 6, 3, 4].reduce((a, w, i) => a + w * d[i], 0);
  return (10 - (s % 10)) % 10 === d[7];
};
const validCedulaEc = (v) => {
  const d = only(v).split('').map(Number);
  if (d.length !== 10 || Number(v.slice(0, 2)) < 1 || Number(v.slice(0, 2)) > 24 || d[2] > 5) return false;
  const s = d.slice(0, 9).reduce((a, x, i) => { const p = x * (i % 2 ? 1 : 2); return a + (p > 9 ? p - 9 : p); }, 0);
  return (10 - (s % 10)) % 10 === d[9];
};
const validRif = (v) => {
  const letter = { V: 1, E: 2, J: 3, P: 4, G: 5 }[v[0]];
  const d = only(v).split('').map(Number);
  const s = letter * 4 + [3, 2, 7, 6, 5, 4, 3, 2].reduce((a, w, i) => a + w * d[i], 0);
  const r = 11 - (s % 11);
  return (r >= 10 ? 0 : r) === d[8];
};
const validLuhn = (v) => {
  const d = only(v).split('').reverse().map(Number);
  return d.reduce((a, x, i) => a + (i % 2 ? (x * 2 > 9 ? x * 2 - 9 : x * 2) : x), 0) % 10 === 0;
};
const validVin = (v) => {
  const t = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 };
  const w = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return false;
  const s = v.split('').reduce((a, c, i) => a + (/\d/.test(c) ? Number(c) : t[c]) * w[i], 0) % 11;
  return (s === 10 ? 'X' : String(s)) === v[8];
};

test('Brasil: CPF e CNPJ válidos', () => repeat(() => {
  assert.ok(validCpf(raw('BR', 'doc:cpf')));
  assert.ok(validCnpj(raw('BR', 'doc:cnpj')));
}));

test('Brasil: máscaras', () => {
  const p = generateProfile(getCountry('BR'), { masked: true });
  assert.match(field(p, 'doc:cpf'), /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  assert.match(field(p, 'doc:cnpj'), /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/);
  assert.match(field(p, 'postalCode'), /^\d{5}-\d{3}$/);
  assert.match(field(p, 'mobile'), /^\(\d{2}\) 9\d{4}-\d{4}$/);
});

test('Argentina: CUIL/CUIT válidos e CUIL contém o DNI', () => repeat(() => {
  const p = generateProfile(getCountry('AR'), { masked: false });
  assert.ok(validCuit(field(p, 'doc:cuil')));
  assert.ok(validCuit(field(p, 'doc:cuit')));
  assert.equal(field(p, 'doc:cuil').slice(2, 10), field(p, 'doc:dni'));
}));

test('Chile: RUT válido', () => repeat(() => {
  assert.ok(validRut(raw('CL', 'doc:rut')));
  assert.ok(validRut(raw('CL', 'doc:rutEmpresa')));
}));

test('Colômbia: NIT válido', () => repeat(() => assert.ok(validNit(raw('CO', 'doc:nit')))));

test('Peru: RUC válido', () => repeat(() => {
  assert.ok(validRucPe(raw('PE', 'doc:ruc')));
  assert.ok(validRucPe(raw('PE', 'doc:rucEmpresa')));
}));

test('Uruguai: CI válida', () => repeat(() => assert.ok(validCiUy(raw('UY', 'doc:ci')))));

test('Equador: cédula e RUC válidos', () => repeat(() => {
  const p = generateProfile(getCountry('EC'), { masked: false });
  assert.ok(validCedulaEc(field(p, 'doc:cedula')));
  assert.equal(field(p, 'doc:ruc'), field(p, 'doc:cedula') + '001');
}));

test('Venezuela: RIF válido', () => repeat(() => {
  assert.ok(validRif(raw('VE', 'doc:rif')));
  assert.ok(validRif(raw('VE', 'doc:rifEmpresa')));
}));

test('Todos os países: cartão (Luhn), VIN e nomes da região', () => {
  for (const c of COUNTRIES) {
    repeat(() => {
      const p = generateProfile(c, { masked: false });
      assert.ok(validLuhn(field(p, 'cardNumber')), `${c.code} cartão`);
      assert.ok(validVin(field(p, 'vin')), `${c.code} VIN ${field(p, 'vin')}`);
      const names = NAMES[c.code];
      const first = field(p, 'fullName');
      assert.ok([...names.male, ...names.female].some((n) => first.startsWith(n)), `${c.code} nome ${first}`);
      for (const f of p.fields) assert.ok(f.value !== undefined && f.value !== '', `${c.code} ${f.key} vazio`);
    });
  }
});

test('Mesma lista de campos a cada geração (menu de contexto estável)', () => {
  for (const c of COUNTRIES) {
    const keys = generateProfile(c).fields.map((f) => f.key).join();
    repeat(() => assert.equal(generateProfile(c).fields.map((f) => f.key).join(), keys, c.code));
  }
});
