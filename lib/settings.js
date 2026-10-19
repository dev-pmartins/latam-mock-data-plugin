import { DEFAULT_COUNTRY } from './countries/index.js';
import { DEFAULT_QUICK_ITEMS } from './quick-menu.js';

// Preferências sincronizadas: o país escolhido vale para popup, menu e atalhos
// até ser trocado.
export const DEFAULTS = {
  country: DEFAULT_COUNTRY,
  masked: true,
  emailDomain: '',
  compact: true,
  quickItems: DEFAULT_QUICK_ITEMS,
};

export const getSettings = async () => ({ ...DEFAULTS, ...(await chrome.storage.sync.get(DEFAULTS)) });

export const setSettings = (patch) => chrome.storage.sync.set(patch);

export function onSettingsChanged(callback) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') callback(changes);
  });
}
