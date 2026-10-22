import { COUNTRIES, getCountry } from '../lib/countries/index.js';
import { generateProfile, GROUPS, COUNTRY_ALTS } from '../lib/generator.js';
import { getSettings, setSettings } from '../lib/settings.js';
import { QUICK_ITEMS } from '../lib/quick-menu.js';

const $ = (id) => document.getElementById(id);
const normalize = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

let settings;
let profile;

// O perfil exibido fica salvo na sessão: o popup fecha ao clicar na página,
// e ao reabri-lo os mesmos dados continuam disponíveis para copiar.
async function loadProfile({ fresh = false } = {}) {
  if (!fresh) {
    const { lastProfile } = await chrome.storage.session.get('lastProfile');
    if (lastProfile?.country === settings.country) {
      profile = lastProfile;
      return;
    }
  }
  profile = generateProfile(getCountry(settings.country), settings);
  await chrome.storage.session.set({ lastProfile: profile });
}

const displayValue = (field) => (settings.masked ? field.formatted : field.raw);

// Perfil com os valores no formato atual (máscara ligada/desligada).
const currentProfile = () => ({
  ...profile,
  fields: profile.fields.map((f) => ({ ...f, value: displayValue(f) })),
});

function showStatus(text) {
  const el = $('status');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(showStatus.timer);
  showStatus.timer = setTimeout(() => el.classList.remove('show'), 1600);
}

// ---------- País ----------

function renderCountryButton() {
  const country = getCountry(settings.country);
  $('country-flag').textContent = country.flag;
  $('country-name').textContent = country.name;
}

let activeIndex = 0;

function filteredCountries() {
  const query = normalize($('country-search').value);
  if (!query) return COUNTRIES;
  return COUNTRIES.filter((c) =>
    [c.name, c.code, ...(COUNTRY_ALTS[c.code] || [])].some((name) => normalize(name).includes(query)));
}

function renderCountryList() {
  const list = $('country-list');
  const countries = filteredCountries();
  activeIndex = Math.min(activeIndex, Math.max(countries.length - 1, 0));
  list.replaceChildren();
  if (!countries.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Nenhum país encontrado';
    list.append(li);
    return;
  }
  countries.forEach((c, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(c.code === settings.country));
    li.classList.toggle('active', i === activeIndex);
    li.innerHTML = '<span class="flag"></span><span class="name"></span><span class="code"></span>';
    li.querySelector('.flag').textContent = c.flag;
    li.querySelector('.name').textContent = c.name;
    li.querySelector('.code').textContent = c.code;
    li.addEventListener('click', () => selectCountry(c.code));
    list.append(li);
  });
}

function toggleCountryPanel(open) {
  $('country-panel').hidden = !open;
  $('country-button').setAttribute('aria-expanded', String(open));
  if (open) {
    $('country-search').value = '';
    activeIndex = Math.max(COUNTRIES.findIndex((c) => c.code === settings.country), 0);
    renderCountryList();
    $('country-search').focus();
  }
}

async function selectCountry(code) {
  toggleCountryPanel(false);
  if (code === settings.country) return;
  settings.country = code;
  await setSettings({ country: code });
  renderCountryButton();
  await loadProfile({ fresh: true });
  renderFields();
  showStatus(`Dados de ${getCountry(code).name}`);
}

// ---------- Campos ----------

function renderFields() {
  const container = $('fields');
  const query = normalize($('filter').value);
  container.replaceChildren();

  for (const group of GROUPS) {
    const fields = profile.fields.filter((f) => f.group === group &&
      (!query || normalize(`${f.label} ${group} ${f.hint || ''}`).includes(query)));
    if (!fields.length) continue;

    const section = document.createElement('section');
    section.className = 'group';
    const title = document.createElement('h2');
    title.textContent = group;
    section.append(title);

    for (const field of fields) {
      const row = document.createElement('button');
      row.className = 'row';
      row.title = 'Clique para copiar';
      row.innerHTML = '<span class="label"></span><span class="value"></span><span class="copy">copiar</span>';
      row.querySelector('.label').textContent = field.hint ? `${field.label} (${field.hint})` : field.label;
      row.querySelector('.value').textContent = displayValue(field);
      row.addEventListener('click', () => copy(displayValue(field), row));
      section.append(row);
    }
    container.append(section);
  }

  if (!container.children.length) {
    container.innerHTML = '<p class="empty-state">Nenhum campo corresponde ao filtro.</p>';
  }
}

async function copy(text, row) {
  await navigator.clipboard.writeText(text);
  if (row) {
    row.classList.add('copied');
    row.querySelector('.copy').textContent = 'copiado!';
    setTimeout(() => {
      row.classList.remove('copied');
      row.querySelector('.copy').textContent = 'copiar';
    }, 1200);
  } else {
    showStatus('Copiado!');
  }
}

// ---------- Ações ----------

async function fillPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  const message = { type: 'fill-form', profile: currentProfile() };
  try {
    let response;
    try {
      response = await chrome.tabs.sendMessage(tab.id, message, { frameId: 0 });
    } catch {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      response = await chrome.tabs.sendMessage(tab.id, message, { frameId: 0 });
    }
    showStatus(response?.filled ? `${response.filled} campos preenchidos` : 'Nenhum campo reconhecido');
  } catch {
    showStatus('Não é possível preencher esta página');
  }
}

// ---------- Menu rápido (Compact mode) ----------

function renderQuickItems() {
  const list = $('quick-list');
  list.replaceChildren();
  for (const item of QUICK_ITEMS) {
    const label = document.createElement('label');
    if (item.action) label.className = 'wide';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = settings.quickItems.includes(item.id);
    input.addEventListener('change', () => toggleQuickItem(item.id, input));
    label.append(input, item.label.charAt(0).toUpperCase() + item.label.slice(1));
    list.append(label);
  }
}

async function toggleQuickItem(id, input) {
  const selected = new Set(settings.quickItems);
  if (input.checked) selected.add(id);
  else selected.delete(id);
  if (!selected.size) {
    input.checked = true;
    showStatus('Mantenha ao menos um item');
    return;
  }
  // Salva na ordem da lista, que é a ordem do menu.
  settings.quickItems = QUICK_ITEMS.map((i) => i.id).filter((i) => selected.has(i));
  await setSettings({ quickItems: settings.quickItems });
}

async function init() {
  settings = await getSettings();
  $('version').textContent = chrome.runtime.getManifest().version;
  $('masked').checked = settings.masked;
  $('compact').checked = settings.compact;
  $('quick-items').hidden = !settings.compact;
  renderQuickItems();
  $('email-domain').value = settings.emailDomain;
  renderCountryButton();
  await loadProfile();
  renderFields();

  $('country-button').addEventListener('click', () => toggleCountryPanel($('country-panel').hidden));
  $('country-search').addEventListener('input', () => { activeIndex = 0; renderCountryList(); });
  $('country-search').addEventListener('keydown', (e) => {
    const countries = filteredCountries();
    if (e.key === 'ArrowDown') { activeIndex = Math.min(activeIndex + 1, countries.length - 1); renderCountryList(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { activeIndex = Math.max(activeIndex - 1, 0); renderCountryList(); e.preventDefault(); }
    if (e.key === 'Enter' && countries[activeIndex]) selectCountry(countries[activeIndex].code);
    if (e.key === 'Escape') { toggleCountryPanel(false); $('country-button').focus(); e.preventDefault(); }
  });
  document.addEventListener('click', (e) => {
    if (!$('country-panel').hidden && !e.target.closest('.country-picker')) toggleCountryPanel(false);
  });

  $('regenerate').addEventListener('click', async () => {
    await loadProfile({ fresh: true });
    renderFields();
  });

  $('masked').addEventListener('change', async (e) => {
    settings.masked = e.target.checked;
    await setSettings({ masked: settings.masked });
    renderFields();
  });

  $('filter').addEventListener('input', renderFields);

  $('compact').addEventListener('change', async (e) => {
    settings.compact = e.target.checked;
    $('quick-items').hidden = !settings.compact;
    await setSettings({ compact: settings.compact });
    showStatus(settings.compact ? 'Menu de contexto compacto' : 'Menu de contexto completo');
  });

  $('email-domain').addEventListener('change', async (e) => {
    settings.emailDomain = e.target.value.trim().replace(/^@/, '');
    e.target.value = settings.emailDomain;
    await setSettings({ emailDomain: settings.emailDomain });
    await loadProfile({ fresh: true });
    renderFields();
    showStatus('Domínio de e-mail salvo');
  });

  $('copy-json').addEventListener('click', () => {
    const data = Object.fromEntries(profile.fields.map((f) => [f.label, displayValue(f)]));
    copy(JSON.stringify({ pais: getCountry(settings.country).name, ...data }, null, 2));
  });

  $('fill-page').addEventListener('click', fillPage);
}

init();
