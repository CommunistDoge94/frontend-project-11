import i18next from 'i18next'

import ru from './locales/ru.js'

const i18n = i18next.createInstance()

const initI18n = () => i18n.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
})

export { i18n, initI18n }
