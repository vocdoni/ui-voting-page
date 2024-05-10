import { Locale } from 'date-fns'

import ca from './ca.json'
import es from './es.json'

import { ca as dca, es as des } from 'date-fns/locale'

export const translations: { [key: string]: any } = {
  ca,
  es,
}

export const dateLocales: { [key: string]: Locale } = {
  ca: dca,
  es: des,
}

export const datesLocale = (lang?: string) => {
  if (!lang) return
  if (!dateLocales.hasOwnProperty(lang)) return

  return dateLocales[lang]
}
