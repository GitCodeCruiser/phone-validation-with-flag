import { COUNTRIES } from './data/countries.js';
import { PHONE_LENGTHS } from './data/phoneLengths.js';
import { getFlagUrl, normalizeStr, uid, injectStyles } from './utils.js';
import { STYLES } from './styles.js';

const STYLE_ID = 'pvf-styles';
const DEFAULT_COUNTRY = 'US';

export class PhoneInput {
  constructor(target, options = {}) {
    this._el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._el) throw new Error(`PhoneInput: element not found — "${target}"`);

    this._opts = {
      defaultCountry: DEFAULT_COUNTRY,
      value: null,             // { countryCode, number }
      placeholder: 'Phone number',
      searchPlaceholder: 'Search country or dial code...',
      theme: 'auto',           // 'auto' | 'light' | 'dark'
      disabled: false,
      flagType: 'image',       // 'image' | 'emoji' | 'none'
      flagsUrl: 'https://flagcdn.com/24x18/{code}.png',
      onChange: null,
      onInput: null,
      ...options,
    };

    this._countries = COUNTRIES;
    this._id = uid();
    this._isOpen = false;
    this._focusIndex = -1;

    // Determine initial country
    const initCode = this._opts.value?.countryCode || this._opts.defaultCountry;
    this._selected = this._countries.find(c => c.code === initCode) || this._countries.find(c => c.code === DEFAULT_COUNTRY);
    this._number = this._opts.value?.number || '';

    injectStyles(STYLES, STYLE_ID);
    this._render();
    this._bind();
  }

  // ─── Rendering ────────────────────────────────────────────────

  _render() {
    this._el.innerHTML = '';
    this._wrapper = document.createElement('div');
    this._wrapper.className = 'pvf-wrapper';
    this._wrapper.dataset.theme = this._opts.theme;
    this._wrapper.setAttribute('role', 'combobox');
    this._wrapper.setAttribute('aria-expanded', 'false');

    this._wrapper.innerHTML = `
      <div class="pvf-input-row">
        <button class="pvf-flag-btn" type="button" aria-label="Select country" ${this._opts.disabled ? 'disabled' : ''}>
          ${this._renderFlagImg(this._selected)}
          <span class="pvf-dial">${this._selected.dial}</span>
          <span class="pvf-chevron">▼</span>
        </button>
        <input
          class="pvf-number-input"
          type="tel"
          inputmode="numeric"
          placeholder="${this._opts.placeholder}"
          value="${this._number}"
          autocomplete="tel-national"
          ${this._opts.disabled ? 'disabled' : ''}
        />
      </div>
      <div class="pvf-dropdown" role="listbox">
        <div class="pvf-search-wrap">
          <input
            class="pvf-search"
            type="text"
            placeholder="${this._opts.searchPlaceholder}"
            autocomplete="off"
            spellcheck="false"
          />
        </div>
        <div class="pvf-list"></div>
      </div>
    `;

    this._el.appendChild(this._wrapper);
    this._flagBtn   = this._wrapper.querySelector('.pvf-flag-btn');
    this._numInput  = this._wrapper.querySelector('.pvf-number-input');
    this._dropdown  = this._wrapper.querySelector('.pvf-dropdown');
    this._search    = this._wrapper.querySelector('.pvf-search');
    this._list      = this._wrapper.querySelector('.pvf-list');

    this._renderList(this._countries);
  }

  _renderFlagImg(country) {
    if (this._opts.flagType === 'none') return '';
    const url = this._opts.flagsUrl.replace('{code}', country.code.toLowerCase().split('-')[0]);
    return `<img class="pvf-flag-img" src="${url}" alt="${country.name}" loading="lazy" />`;
  }

  _renderList(countries) {
    if (!countries.length) {
      this._list.innerHTML = `<div class="pvf-no-results">No countries found</div>`;
      return;
    }
    this._list.innerHTML = countries.map((c, i) => `
      <div class="pvf-item ${c.code === this._selected.code ? 'pvf-selected' : ''}"
           role="option"
           data-code="${c.code}"
           data-index="${i}"
           aria-selected="${c.code === this._selected.code}">
        ${this._renderFlagImg(c)}
        <span class="pvf-item-name">${c.name}</span>
        <span class="pvf-item-dial">${c.dial}</span>
      </div>
    `).join('');
  }

  _updateFlagBtn() {
    const flagEl = this._flagBtn.querySelector('.pvf-flag-img, .pvf-flag-emoji');
    const dialEl = this._flagBtn.querySelector('.pvf-dial');
    if (flagEl) flagEl.src = this._opts.flagsUrl.replace('{code}', this._selected.code.toLowerCase().split('-')[0]);
    if (flagEl) flagEl.alt = this._selected.name;
    if (dialEl) dialEl.textContent = this._selected.dial;
  }

  // ─── Event Binding ────────────────────────────────────────────

  _bind() {
    // Toggle dropdown
    this._flagBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._isOpen ? this._close() : this._open();
    });

    // Close on outside click
    this._outsideHandler = (e) => {
      if (!this._wrapper.contains(e.target)) this._close();
    };
    document.addEventListener('click', this._outsideHandler);

    // Search
    this._search.addEventListener('input', () => {
      const q = normalizeStr(this._search.value);
      const filtered = this._countries.filter(c =>
        normalizeStr(c.name).includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
      );
      this._renderList(filtered);
      this._focusIndex = -1;
    });

    // Select country via click
    this._list.addEventListener('click', (e) => {
      const item = e.target.closest('.pvf-item');
      if (!item) return;
      this._selectCountry(item.dataset.code);
    });

    // Keyboard nav
    this._search.addEventListener('keydown', (e) => this._onKey(e));

    // Number input
    this._numInput.addEventListener('input', () => {
      this._number = this._numInput.value;
      this._showValidation(this._number);
      const val = this._getValue();
      if (typeof this._opts.onInput === 'function') this._opts.onInput(val);
      if (typeof this._opts.onChange === 'function') this._opts.onChange(val);
    });

    // Escape closes
    this._wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });
  }

  _onKey(e) {
    const items = [...this._list.querySelectorAll('.pvf-item')];
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusIndex = Math.min(this._focusIndex + 1, items.length - 1);
      items[this._focusIndex]?.classList.add('pvf-active');
      items[this._focusIndex]?.scrollIntoView({ block: 'nearest' });
      items.forEach((el, i) => el.classList.toggle('pvf-active', i === this._focusIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._focusIndex = Math.max(this._focusIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle('pvf-active', i === this._focusIndex));
      items[this._focusIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && this._focusIndex >= 0) {
      const code = items[this._focusIndex]?.dataset.code;
      if (code) this._selectCountry(code);
    }
  }

  // ─── State ────────────────────────────────────────────────────

  _open() {
    this._isOpen = true;
    this._wrapper.classList.add('pvf-open');
    this._wrapper.setAttribute('aria-expanded', 'true');
    this._renderList(this._countries);
    this._search.value = '';
    setTimeout(() => this._search.focus(), 10);
    // Scroll selected into view
    requestAnimationFrame(() => {
      const sel = this._list.querySelector('.pvf-selected');
      sel?.scrollIntoView({ block: 'center' });
    });
  }

  _close() {
    this._isOpen = false;
    this._wrapper.classList.remove('pvf-open');
    this._wrapper.setAttribute('aria-expanded', 'false');
    this._focusIndex = -1;
  }

  _selectCountry(code) {
    const country = this._countries.find(c => c.code === code);
    if (!country) return;
    this._selected = country;
    this._updateFlagBtn();
    this._renderList(this._countries);
    this._close();
    this._numInput.focus();
    const val = this._getValue();
    if (typeof this._opts.onChange === 'function') this._opts.onChange(val);
  }

  _validate(number, code) {
    const digits = number.replace(/\D/g, '');
    if (!digits) return { valid: false, error: null }; // empty = no error shown
    const len = PHONE_LENGTHS[code];
    if (!len) return { valid: true, error: null }; // unknown country = skip
    const [min, max] = len;
    if (digits.length < min) return { valid: false, error: `Too short — need ${min} digit${min !== 1 ? 's' : ''}` };
    if (digits.length > max) return { valid: false, error: `Too long — max ${max} digit${max !== 1 ? 's' : ''}` };
    return { valid: true, error: null };
  }

  _showValidation(number) {
    const { valid, error } = this._validate(number, this._selected.code);
    const digits = number.replace(/\D/g, '');
    let errorEl = this._wrapper.querySelector('.pvf-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'pvf-error';
      this._wrapper.appendChild(errorEl);
    }
    if (error && digits.length > 0) {
      this._wrapper.querySelector('.pvf-input-row').classList.add('pvf-invalid');
      this._wrapper.querySelector('.pvf-input-row').classList.remove('pvf-valid');
      errorEl.textContent = error;
      errorEl.style.display = 'block';
    } else if (valid && digits.length > 0) {
      this._wrapper.querySelector('.pvf-input-row').classList.remove('pvf-invalid');
      this._wrapper.querySelector('.pvf-input-row').classList.add('pvf-valid');
      errorEl.style.display = 'none';
    } else {
      this._wrapper.querySelector('.pvf-input-row').classList.remove('pvf-invalid', 'pvf-valid');
      errorEl.style.display = 'none';
    }
  }

  _getValue() {
    const { valid } = this._validate(this._number, this._selected.code);
    return {
      countryCode: this._selected.code,
      countryName: this._selected.name,
      dialCode: this._selected.dial,
      number: this._number,
      full: this._number ? `${this._selected.dial}${this._number}` : '',
      isValid: this._number ? valid : false,
    };
  }

  // ─── Public API ───────────────────────────────────────────────

  getValue() { return this._getValue(); }

  setValue(countryCode, number) {
    if (countryCode) {
      const c = this._countries.find(x => x.code === countryCode);
      if (c) { this._selected = c; this._updateFlagBtn(); }
    }
    if (number !== undefined) {
      this._number = String(number);
      this._numInput.value = this._number;
    }
    this._renderList(this._countries);
  }

  setCountry(code) {
    this.setValue(code, undefined);
  }

  setNumber(number) {
    this._number = String(number);
    this._numInput.value = this._number;
  }

  reset() {
    const def = this._countries.find(c => c.code === this._opts.defaultCountry) || this._countries[0];
    this._selected = def;
    this._number = '';
    this._numInput.value = '';
    this._updateFlagBtn();
    this._renderList(this._countries);
    if (typeof this._opts.onChange === 'function') this._opts.onChange(this._getValue());
  }

  enable() {
    this._opts.disabled = false;
    this._flagBtn.disabled = false;
    this._numInput.disabled = false;
  }

  disable() {
    this._opts.disabled = true;
    this._flagBtn.disabled = true;
    this._numInput.disabled = true;
  }

  destroy() {
    document.removeEventListener('click', this._outsideHandler);
    this._el.innerHTML = '';
  }
}
