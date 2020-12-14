const Article = require('../models/article');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const { _id } = req.user;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: _id,
  })
    .then((article) => {
      res.send({
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
        _id: article._id,
      });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.name === 'ValidationError') {
        const error = new BadRequestError(`Ошибка валидации: ${Object.keys(err.errors).map((item) => err.errors[item].message).join(', ')}`);
        next(error);
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.findById(articleId)
    .orFail(() => {
      throw new NotFoundError('Статья не найдена');
    })
    .select('+owner')
    .then((article) => {
      if (article.owner.toString() === userId) {
        Article.findByIdAndRemove(articleId).then((newArticle) => {
          res.send(newArticle);
        });
      } else {
        throw new ConflictError('Нельзя удалять чужую сохранённую статью');
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.name === 'ValidationError') {
        const error = new BadRequestError(`Ошибка валидации: ${Object.keys(err.errors).map((item) => err.errors[item].message).join(', ')}`);
        next(error);
      }
      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
