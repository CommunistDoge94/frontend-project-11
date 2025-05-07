import * as yup from 'yup';

export default (url, existingFeeds) => {
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .notOneOf([...existingFeeds], 'RSS уже существует');

  return schema.validate(url);
};
