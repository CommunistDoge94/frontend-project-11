import * as yup from 'yup';
import i18n from './i18n.js';

yup.setLocale({
  string: {
    url: i18n.t('form.errors.url'),
  },
  mixed: {
    notOneOf: i18n.t('form.errors.duplicate'),
  },
});

export default (url, existingFeeds) => {
  const schema = yup.string().url().notOneOf([...existingFeeds]);
  return schema.validate(url);
};