import { createSignal, createEffect } from 'solid-js';
import { translator, flatten } from '@solid-primitives/i18n';
import en from '../locales/en.json';
import th from '../locales/th.json';

export type Locale = 'en' | 'th';

export const defaultLocale: Locale = 'en';

export const locales = {
  en: { name: 'English', flag: '🇺🇸' },
  th: { name: 'ไทย', flag: '🇹🇭' }
} as const;

export const rawTranslations = {
  en,
  th
} as const;

const [locale, setLocale] = createSignal<Locale>(defaultLocale);
const [translations, setTranslations] = createSignal(flatten(rawTranslations[defaultLocale]));

export const t = translator(() => translations());

createEffect(() => {
  const currentLocale = locale();
  setTranslations(flatten(rawTranslations[currentLocale]));
});

export const getCurrentLocale = () => locale();

export const changeLocale = (newLocale: Locale) => {
  setLocale(newLocale);
  localStorage.setItem('qr-studio-locale', newLocale);
};

export const initializeLocale = () => {
  const savedLocale = localStorage.getItem('qr-studio-locale') as Locale;
  if (savedLocale && (savedLocale === 'en' || savedLocale === 'th')) {
    setLocale(savedLocale);
    return savedLocale;
  }
  
  const browserLang = navigator.language.split('-')[0] as Locale;
  if (browserLang === 'th') {
    setLocale('th');
    return 'th';
  }
  
  setLocale(defaultLocale);
  return defaultLocale;
};