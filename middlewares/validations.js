const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateArticleBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле link должно быть валидным url-адресом');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image должно быть валидным url-адресом');
    }),
  }),
});

const validateArticleParams = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateAuthentication,
  validateArticleBody,
  validateArticleParams,
};
