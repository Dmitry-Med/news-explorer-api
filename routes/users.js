const router = require('express').Router();
const { getUserInfo } = require('../controllers/users.js');

router.get('/me', getUserInfo);

module.exports = router;
