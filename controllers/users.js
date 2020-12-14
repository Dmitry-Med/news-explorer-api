const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AiuthError = require('../errors/auth-err');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  if (!email || !password) {
    throw new NotFoundError('Не передан email или password');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(`Ошибка валидации: ${Object.keys(err.errors).map((item) => err.errors[item].message).join(', ')}`);
        next(error);
      } else if (err.code === 11000) {
        const error = new ConflictError('Пользователь с таким email уже зарегистрирован');
        next(error);
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequestError('Не передан email');
  } if (!password || !password.trim() || password.trim().length < 8) {
    throw new BadRequestError('Поле пароль должно быть заполнено');
  }
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AiuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AiuthError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.send({ token });
        })
        .catch(() => {
          const error = new BadRequestError('Ошибка запроса пароля');
          next(error);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(`Ошибка валидации: ${Object.keys(err.errors).map((item) => err.errors[item].message).join(', ')}`);
        next(error);
      }
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUserInfo,
};
