const router = require('express').Router();
const usersRoutes = require('./users.js');
const articlesRoutes = require('./articles.js');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
} = require('../controllers/users.js');
const {
  validateUserBody,
  validateAuthentication,
} = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);
router.use(auth);
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('Запрашиваемый ресурс не найден');
  next(err);
});

module.exports = router;
