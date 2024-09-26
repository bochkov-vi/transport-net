import {DefineDateTimeFormat} from 'vue-i18n';

export default {
  short: {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  },
  long: {
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour24: true,
    // timeZoneName: 'short',
  },
  time: {
    hour: 'numeric',
    minute: 'numeric',
  },
} as DefineDateTimeFormat;
