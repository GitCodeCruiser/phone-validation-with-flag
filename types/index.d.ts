export interface Country {
  code: string;
  name: string;
  dial: string;
}

export interface PhoneValue {
  countryCode: string;
  countryName: string;
  dialCode: string;
  number: string;
  full: string;
}

export interface PhoneInputOptions {
  defaultCountry?: string;
  value?: { countryCode: string; number: string };
  placeholder?: string;
  searchPlaceholder?: string;
  theme?: 'auto' | 'light' | 'dark';
  disabled?: boolean;
  flagType?: 'image' | 'emoji' | 'none';
  flagsUrl?: string;
  onChange?: (value: PhoneValue) => void;
  onInput?: (value: PhoneValue) => void;
}

export declare class PhoneInput {
  constructor(target: string | HTMLElement, options?: PhoneInputOptions);
  getValue(): PhoneValue;
  setValue(countryCode?: string, number?: string): void;
  setCountry(code: string): void;
  setNumber(number: string): void;
  reset(): void;
  enable(): void;
  disable(): void;
  destroy(): void;
}

export declare const COUNTRIES: Country[];
