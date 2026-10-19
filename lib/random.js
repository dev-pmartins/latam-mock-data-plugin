// Funções utilitárias de aleatoriedade e formatação.

export const int = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = (arr) => arr[int(0, arr.length - 1)];

export const digits = (n) => Array.from({ length: n }, () => int(0, 9));

export const digitString = (n) => digits(n).join('');

export const letters = (n, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') =>
  Array.from({ length: n }, () => pick(alphabet)).join('');

export const chance = (p) => Math.random() < p;

export const pad = (value, size) => String(value).padStart(size, '0');

// Aplica uma máscara onde "#" é substituído pelos caracteres de `raw` em ordem.
export const mask = (raw, pattern) => {
  let i = 0;
  return pattern.replace(/#/g, () => raw[i++] ?? '');
};

// Remove acentos e caracteres especiais (útil para e-mails e usernames).
export const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// Agrupa milhares com ponto: 12345678 -> 12.345.678
export const thousands = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const onlyAlnum = (text) => String(text).replace(/[^0-9A-Za-z]/g, '');
