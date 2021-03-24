const router = require('express').Router();
const moviesRouter = require('./movie.js');
const usersRouter = require('./user.js');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
