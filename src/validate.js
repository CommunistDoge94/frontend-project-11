import * as yup from 'yup'

import i18n from './i18n.js'

yup.setLocale({
  string: {
    url: i18n.t('form.errors.url'),
  },
  mixed: {
    notOneOf: i18n.t('form.errors.duplicate'),
    required: i18n.t('form.errors.required'),
  },
})

export default (url, existingFeeds) => {
  const schema = yup.string().required().url().notOneOf([...existingFeeds])
  return schema.validate(url)
}
