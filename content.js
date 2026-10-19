// Content script: identifica o campo clicado e insere os dados recebidos do
// service worker. Não gera dados — apenas detecta e preenche.
(() => {
  if (window.__mockDataGeneratorLoaded) return;
  window.__mockDataGeneratorLoaded = true;

  let lastTarget = null;
  document.addEventListener('contextmenu', (e) => { lastTarget = e.composedPath()[0]; }, true);

  const SKIP_TYPES = new Set(['hidden', 'submit', 'button', 'reset', 'checkbox', 'radio', 'file', 'image', 'range', 'color', 'search']);

  // Tokens do atributo HTML `autocomplete` -> chave do campo gerado.
  const AUTOCOMPLETE = {
    name: 'fullName', 'given-name': 'firstName', 'additional-name': 'firstName', 'family-name': 'lastName',
    email: 'email', tel: 'mobile', 'tel-national': 'mobile', bday: 'birthDate', sex: 'gender',
    'postal-code': 'postalCode', 'street-address': 'fullAddress', 'address-line1': 'street', 'address-line2': 'complement',
    'address-level1': 'state', 'address-level2': 'city', 'address-level3': 'neighborhood', country: 'country', 'country-name': 'country',
    organization: 'companyName', 'cc-number': 'cardNumber', 'cc-name': 'cardHolder', 'cc-exp': 'cardExpiry', 'cc-csc': 'cardCvv',
    username: 'username', 'new-password': 'password', 'current-password': 'password',
  };

  const normalize = (text) => String(text || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[_\-[\]().:*#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const deepActiveElement = () => {
    let el = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el;
  };

  const isEditable = (el) => {
    if (!el || el.disabled || el.readOnly) return false;
    if (el.isContentEditable) return true;
    if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
    return el.tagName === 'INPUT' && !SKIP_TYPES.has(el.type);
  };

  const isVisible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

  // ---------- Detecção ----------

  function labelText(el) {
    const parts = [];
    if (el.labels) for (const l of el.labels) parts.push(l.textContent);
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      for (const id of labelledBy.split(/\s+/)) parts.push(el.ownerDocument.getElementById(id)?.textContent);
    }
    return normalize(parts.join(' '));
  }

  // Sem <label> associado: procura um texto curto logo antes do campo,
  // parando ao encontrar outro campo (o texto seria dele).
  function nearbyText(el) {
    const FIELD = 'input, select, textarea';
    let node = el;
    for (let depth = 0; node && depth < 3; depth++, node = node.parentElement) {
      for (let sib = node.previousElementSibling; sib; sib = sib.previousElementSibling) {
        if (sib.matches(FIELD) || sib.querySelector(FIELD)) return '';
        const text = sib.textContent.trim();
        if (text) return text.length <= 60 ? normalize(text) : '';
      }
    }
    return '';
  }

  // Fontes de pistas, da mais confiável para a menos confiável.
  function haystacks(el) {
    const attr = (name) => el.getAttribute(name) || '';
    return [
      labelText(el),
      normalize([attr('placeholder'), attr('aria-label'), attr('title')].join(' ')),
      normalize([attr('name'), el.id, attr('formcontrolname'), attr('data-testid'), attr('data-field'), attr('ng-model'), attr('v-model')].join(' ')),
      nearbyText(el),
    ].filter(Boolean);
  }

  function detect(el, profile) {
    const byKey = (key) => profile.fields.find((f) => f.key === key);
    const type = (el.type || '').toLowerCase();
    if (type === 'email') return byKey('email');
    if (type === 'password') return byKey('password');
    if (type === 'date') return byKey('birthDate');

    const auto = (el.getAttribute('autocomplete') || '').toLowerCase().split(/\s+/).reverse()
      .find((token) => AUTOCOMPLETE[token]);
    if (auto) return byKey(AUTOCOMPLETE[auto]);

    const rules = profile.fields
      .filter((f) => f.match)
      .sort((a, b) => a.priority - b.priority)
      .map((f) => ({ field: f, re: new RegExp(f.match) }));

    for (const hay of haystacks(el)) {
      const hit = rules.find((r) => r.re.test(hay));
      if (hit) return hit.field;
    }
    if (type === 'tel') return byKey('mobile');
    return null;
  }

  // ---------- Preenchimento ----------

  function chooseOption(select, field) {
    const options = [...select.options].filter((o) => !o.disabled);
    if (!field) return null;
    const wanted = [field.formatted, field.raw, ...(field.alts || [])].map(normalize);
    const exact = options.find((o) => wanted.includes(normalize(o.text)) || wanted.includes(normalize(o.value)));
    if (exact) return exact;
    return options.find((o) => wanted.some((w) => w && normalize(o.text).startsWith(w))) || null;
  }

  function randomOption(select) {
    const options = [...select.options].filter((o) => !o.disabled && o.value !== '');
    return options[Math.floor(Math.random() * options.length)] || null;
  }

  // Usa o setter nativo para que React/Vue/Angular percebam a alteração.
  function setNativeValue(el, value) {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
      : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function fill(el, field, { randomSelect = false } = {}) {
    if (el.tagName === 'SELECT') {
      const option = chooseOption(el, field) || (randomSelect ? randomOption(el) : null);
      if (!option) return false;
      setNativeValue(el, option.value);
      return true;
    }
    if (!field) return false;

    if (el.isContentEditable) {
      el.focus();
      document.execCommand('selectAll', false);
      document.execCommand('insertText', false, field.value);
      return true;
    }

    let value = field.value;
    const type = (el.type || '').toLowerCase();
    if (type === 'date') {
      if (!field.iso) return false;
      value = field.iso;
    } else if (type === 'number') {
      value = value.replace(/\D/g, '');
    }

    // Se o valor formatado não cabe no maxlength, tenta sem máscara.
    if (el.maxLength > 0 && value.length > el.maxLength) {
      value = field.raw.length <= el.maxLength ? field.raw : field.raw.slice(0, el.maxLength);
    }

    el.focus();
    setNativeValue(el, value);
    return true;
  }

  function resolveTarget() {
    for (const candidate of [lastTarget, deepActiveElement()]) {
      if (!candidate) continue;
      const el = candidate.isContentEditable ? candidate : candidate.closest?.('input, textarea, select') || candidate;
      if (isEditable(el)) return el;
    }
    return null;
  }

  function fillForm(profile, anchor) {
    const scope = anchor?.closest?.('form') || document;
    const elements = [...scope.querySelectorAll('input, textarea, select')]
      .filter((el) => isEditable(el) && isVisible(el));
    let filled = 0;
    for (const el of elements) {
      if (fill(el, detect(el, profile), { randomSelect: true })) filled++;
    }
    return { filled, total: elements.length };
  }

  // ---------- Feedback visual ----------

  function toast(text, isError = false) {
    if (window !== window.top && !document.hasFocus()) return;
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;z-index:2147483647;right:16px;bottom:16px;pointer-events:none;';
    const shadow = host.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `<style>
      div{font:13px/1.4 system-ui,sans-serif;padding:10px 14px;border-radius:8px;color:#fff;
      background:${isError ? '#b42318' : '#1d4ed8'};box-shadow:0 6px 20px rgba(0,0,0,.25);
      max-width:320px;transition:opacity .3s;}
    </style><div></div>`;
    shadow.querySelector('div').textContent = text;
    document.documentElement.appendChild(host);
    setTimeout(() => { host.style.opacity = '0'; host.style.transition = 'opacity .3s'; }, 2200);
    setTimeout(() => host.remove(), 2600);
  }

  // ---------- Mensagens ----------

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.requireFocus && !document.hasFocus()) return;

    if (msg.type === 'fill-value') {
      const el = resolveTarget();
      if (!el) return sendResponse({ ok: false });
      fill(el, msg.field);
      return sendResponse({ ok: true });
    }

    if (msg.type === 'fill-auto') {
      const el = resolveTarget();
      if (!el) {
        if (msg.requireFocus) toast('Clique em um campo antes de usar o atalho.', true);
        return sendResponse({ ok: false });
      }
      const field = detect(el, msg.profile);
      if (!field) {
        toast('Campo não reconhecido. Use o submenu "Gerar dados" para escolher o tipo.', true);
        return sendResponse({ ok: false });
      }
      fill(el, field);
      toast(`${field.label}: ${field.value}`);
      return sendResponse({ ok: true, field: field.key });
    }

    if (msg.type === 'fill-form') {
      const result = fillForm(msg.profile, resolveTarget());
      toast(result.filled
        ? `${result.filled} de ${result.total} campos preenchidos.`
        : 'Nenhum campo reconhecido para preencher.', !result.filled);
      return sendResponse({ ok: true, ...result });
    }
  });
})();
