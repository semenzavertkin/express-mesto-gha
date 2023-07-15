const { Joi, celebrate } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const DataError = require('../errors/dataError');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new DataError('Некорректный адрес URL');
};

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validationUrl),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationCreateCard,
  validationCardId,
};
