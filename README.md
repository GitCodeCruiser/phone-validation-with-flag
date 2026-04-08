# phone-validation-with-flag 📞

[![npm version](https://img.shields.io/npm/v/phone-validation-with-flag.svg)](https://www.npmjs.com/package/phone-validation-with-flag)
[![license](https://img.shields.io/npm/l/phone-validation-with-flag.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/phone-validation-with-flag)](https://bundlephobia.com/package/phone-validation-with-flag)

A **lightweight, zero-dependency** international phone number input with country flag selector and dial code.  
Works everywhere — Vanilla JS, React, Vue, or any framework.

- ✅ **Zero dependencies** — no jQuery, no libphonenumber, nothing
- 🌍 **253 countries & territories** with dial codes
- 🏳 **Real flag images** — via flagcdn.com (works on all browsers including Windows)
- 🔍 **Searchable** — search by country name, code, or dial code (+92, pak...)
- ✅ **Built-in validation** — per-country digit length validation with red/green feedback
- 🌙 **Dark mode** — auto-detects system preference
- 📐 **TypeScript** — full type definitions included
- 📦 **ESM + CJS + UMD** — works everywhere

---

## Installation

```bash
npm install phone-validation-with-flag
# or
yarn add phone-validation-with-flag
# or
pnpm add phone-validation-with-flag
```

---

## Quick Start

### Vanilla JS

```js
import { PhoneInput } from 'phone-validation-with-flag';

const phone = new PhoneInput('#my-phone', {
  defaultCountry: 'US',
  onChange: (value) => {
    console.log(value.full);      // '+13001234567'
    console.log(value.isValid);   // true / false
  },
});
```

### React

```jsx
import { PhoneInputComponent } from 'phone-validation-with-flag/react';

function MyForm() {
  const [phone, setPhone] = useState(null);

  return (
    <PhoneInputComponent
      defaultCountry="PK"
      theme="auto"
      onChange={setPhone}
    />
  );
}
// phone = { countryCode, dialCode, number, full, isValid }
```

### Vue 3

```vue
<script setup>
import { ref } from 'vue';
import PhoneInput from 'phone-validation-with-flag/vue';
const phone = ref(null);
</script>

<template>
  <PhoneInput v-model="phone" default-country="PK" theme="auto" />
</template>
```

### CDN (no build step)

```html
<script src="https://unpkg.com/phone-validation-with-flag/dist/index.umd.js"></script>
<div id="my-phone"></div>
<script>
  const { PhoneInput } = window.PhoneValidationWithFlag;
  new PhoneInput('#my-phone', {
    defaultCountry: 'US',
    onChange: (val) => console.log(val.full),
  });
</script>
```

---

## onChange Value

Every time the user interacts, `onChange` fires with:

```js
{
  countryCode: 'PK',           // ISO 3166-1 alpha-2
  countryName: 'Pakistan',
  dialCode: '+92',
  number: '3001234567',        // local number typed by user
  full: '+923001234567',       // ready to store / submit
  isValid: true,               // false if too short / too long
}
```

---

## Validation

Built-in digit-length validation per country — no extra dependencies needed.

| Behavior | Result |
|----------|--------|
| Empty field | No indicator |
| Too short | 🔴 Red border + "Too short — need 10 digits" |
| Too long | 🔴 Red border + "Too long — max 10 digits" |
| Correct length | 🟢 Green border, `isValid: true` |

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultCountry` | `string` | `'US'` | ISO code of the pre-selected country |
| `value` | `{ countryCode, number }` | `null` | Initial value |
| `placeholder` | `string` | `'Phone number'` | Input placeholder text |
| `searchPlaceholder` | `string` | `'Search country...'` | Dropdown search placeholder |
| `theme` | `'auto'\|'light'\|'dark'` | `'auto'` | Color theme |
| `disabled` | `boolean` | `false` | Disable the component |
| `flagType` | `'image'\|'none'` | `'image'` | How to render flags |
| `flagsUrl` | `string` | flagcdn.com | URL template for flags (`{code}` replaced) |
| `onChange` | `function` | `null` | Fired on country change or number input |
| `onInput` | `function` | `null` | Fired only on number input |

---

## Public API

```js
const phone = new PhoneInput('#el', options);

phone.getValue();                    // → { countryCode, dialCode, number, full, isValid }
phone.setValue('GB', '7911123456'); // set country + number programmatically
phone.setCountry('PK');             // change country only
phone.setNumber('3001234567');      // change number only
phone.reset();                      // clear to default
phone.enable();
phone.disable();
phone.destroy();                    // cleanup DOM + events
```

---

## TypeScript

Full TypeScript types included — no `@types/` package needed.

```ts
import { PhoneInput, PhoneInputOptions, PhoneValue } from 'phone-validation-with-flag';

const options: PhoneInputOptions = {
  defaultCountry: 'PK',
  onChange: (val: PhoneValue) => console.log(val.full),
};

const phone = new PhoneInput('#el', options);
```

---

## License

MIT © [GitCodeCruiser](https://github.com/GitCodeCruiser)
