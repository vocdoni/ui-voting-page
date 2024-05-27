import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import languages from './languages.mjs'
import { translations } from './locales'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ca',
    debug: import.meta.env.DEV,
    defaultNS: 'translation',
    lng: 'ca',
  })

// load translations
for (const lang of languages) {
  if (typeof translations[lang] !== 'undefined') {
    i18n.addResourceBundle(lang, 'translation', translations[lang])
  }
}

export default i18n
