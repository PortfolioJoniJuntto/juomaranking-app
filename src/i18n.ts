import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, fi} from '../locales';
import {TRANSLATION_FALLBACK_LANGUAGE} from './constants';
import * as RNLocalize from 'react-native-localize';
const language = RNLocalize.getLocales()[0].languageCode;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {translation: en},
    fi: {translation: fi},
  },
  supportedLngs: ['en', 'fi'],
  lng: language,
  fallbackLng: TRANSLATION_FALLBACK_LANGUAGE,
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
