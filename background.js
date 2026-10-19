import { COUNTRIES, getCountry } from './lib/countries/index.js';
import { generateProfile, GROUPS } from './lib/generator.js';
import { getSettings, setSettings, onSettingsChanged } from './lib/settings.js';
import { QUICK_ITEMS, DEFAULT_QUICK_ITEMS, resolveQuickField, quickTitle } from './lib/quick-menu.js';

const CONTEXTS = ['editable'];

const createMenu = (props) =>
  chrome.contextMenus.create({ contexts: CONTEXTS, ...props }, () => void chrome.runtime.lastError);

// Recria o menu de contexto para o país salvo. As chamadas são serializadas
// para evitar IDs duplicados quando várias mudanças chegam juntas.
let menuQueue = Promise.resolve();
function rebuildMenus() {
  menuQueue = menuQueue.then(buildMenus).catch((err) => console.error('Erro ao montar menu', err));
  return menuQueue;
}

async function buildMenus() {
  await chrome.contextMenus.removeAll();
  const settings = await getSettings();
  const country = getCountry(settings.country);
  const { fields } = generateProfile(country);

  createMenu({ id: 'root', title: `Gerar dados — ${country.flag} ${country.name}` });

  // Modo compacto: um único nível, só com os itens escolhidos no popup.
  if (settings.compact) {
    // Ignora itens que o país não tem (ex.: código postal na Bolívia); se nada sobrar, usa o padrão.
    const available = (ids) => QUICK_ITEMS.filter((item) =>
      ids.includes(item.id) && (item.action || resolveQuickField(item, fields)));
    let items = available(settings.quickItems);
    if (!items.length) items = available(DEFAULT_QUICK_ITEMS);
    for (const item of items) {
      createMenu({ id: `quick:${item.id}`, parentId: 'root', title: quickTitle(item, fields) });
    }
    return;
  }

  createMenu({ id: 'auto', parentId: 'root', title: 'Detectar campo automaticamente' });
  createMenu({ id: 'fill-form', parentId: 'root', title: 'Preencher formulário inteiro' });
  createMenu({ id: 'sep-1', parentId: 'root', type: 'separator' });

  for (const group of GROUPS) {
    const groupFields = fields.filter((f) => f.group === group);
    if (!groupFields.length) continue;
    createMenu({ id: `group:${group}`, parentId: 'root', title: group });
    for (const f of groupFields) {
      createMenu({ id: `field:${f.key}`, parentId: `group:${group}`, title: f.label });
    }
  }

  createMenu({ id: 'sep-2', parentId: 'root', type: 'separator' });
  createMenu({ id: 'country', parentId: 'root', title: 'Trocar país' });
  for (const c of COUNTRIES) {
    createMenu({ id: `country:${c.code}`, parentId: 'country', type: 'radio', checked: c.code === country.code, title: `${c.flag} ${c.name}` });
  }
  createMenu({ id: 'masked', parentId: 'root', type: 'checkbox', checked: settings.masked, title: 'Usar máscara (pontos, traços…)' });
}

async function newProfile() {
  const settings = await getSettings();
  return generateProfile(getCountry(settings.country), settings);
}

// Envia a mensagem ao content script; se a página foi aberta antes da
// instalação da extensão, injeta o script e tenta novamente.
async function sendToTab(tabId, message, frameId) {
  const options = frameId === undefined ? {} : { frameId };
  try {
    return await chrome.tabs.sendMessage(tabId, message, options);
  } catch {
    await chrome.scripting.executeScript({
      target: frameId === undefined ? { tabId, allFrames: true } : { tabId, frameIds: [frameId] },
      files: ['content.js'],
    });
    return chrome.tabs.sendMessage(tabId, message, options);
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const id = String(info.menuItemId);

  if (id.startsWith('country:')) return setSettings({ country: id.slice('country:'.length) });
  if (id === 'masked') return setSettings({ masked: info.checked });
  if (!tab?.id) return;

  const profile = await newProfile();
  let message;
  if (id.startsWith('quick:')) {
    const item = QUICK_ITEMS.find((i) => i.id === id.slice('quick:'.length));
    if (!item) return;
    if (item.action) {
      message = { type: item.action === 'auto' ? 'fill-auto' : 'fill-form', profile };
    } else {
      const field = resolveQuickField(item, profile.fields);
      if (!field) return;
      message = { type: 'fill-value', field };
    }
  } else if (id === 'auto') message = { type: 'fill-auto', profile };
  else if (id === 'fill-form') message = { type: 'fill-form', profile };
  else if (id.startsWith('field:')) {
    const field = profile.fields.find((f) => f.key === id.slice('field:'.length));
    if (!field) return;
    message = { type: 'fill-value', field };
  } else return;

  try {
    await sendToTab(tab.id, message, info.frameId ?? 0);
  } catch (err) {
    console.warn('Não foi possível preencher o campo nesta página:', err);
  }
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (!tab?.id) return;
  const profile = await newProfile();
  const type = command === 'fill-form' ? 'fill-form' : 'fill-auto';
  // Vai para todos os frames; só o frame com foco reage.
  try {
    await sendToTab(tab.id, { type, profile, requireFocus: true });
  } catch (err) {
    console.warn('Atalho indisponível nesta página:', err);
  }
});

onSettingsChanged((changes) => {
  if (['country', 'masked', 'compact', 'quickItems'].some((key) => key in changes)) rebuildMenus();
});

chrome.runtime.onInstalled.addListener(rebuildMenus);
chrome.runtime.onStartup.addListener(rebuildMenus);
