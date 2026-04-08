export function getFlagUrl(code) {
  // Sub-national codes like GB-ENG → use 'gb' for flag
  const base = code.toLowerCase().split('-')[0];
  return `https://flagcdn.com/24x18/${base}.png`;
}

export function normalizeStr(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

let idCounter = 0;
export function uid() {
  return `pvf-${++idCounter}`;
}

export function injectStyles(css, id) {
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}
