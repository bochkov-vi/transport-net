import ru from './ru-RU/index.json';
import rudtf from './ru-RU/datetime-format';
import runf from './ru-RU/number-format';

export default defineI18nConfig(() => ({
  legacy: false,
  langDir: './locales',
  messages: {ru},
  baseUrl: import.meta.env.VITE_BASE_URL,
  locale: 'ru',
  fallbackLocale: 'ru',
  datetimeFormats: {
    ru: rudtf
  },
  numberFormats: {
    ru: runf
  },
  locales: [
    {
      code: 'ru',
      iso: 'ru-RU',
    }
  ],
}));
type MessageSchema = typeof ru
type NumberSchema = typeof runf

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {
  }

  // define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      day: string
      month: string
      year: string
    };
    long: {
      day: string
      month: string
      year: string
      hour: string
      minute: string
      second: string
      hour24: boolean
      timeZoneName: 'short'
    };
    time: {
      hour: 'numeric'
      minute: 'numeric'
      second: 'numeric'
    };
  }

  // define the number format schema
  export interface DefineNumberFormat extends NumberSchema {
  }
}
