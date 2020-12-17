const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const {
  validateArticleBody,
  validateArticleParams,
} = require('../middlewares/validations');

router.get('/', getArticles);

router.post('/', validateArticleBody, createArticle);

router.delete('/:articleId', validateArticleParams, deleteArticle);

module.exports = router;
