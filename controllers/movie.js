const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Данные не найдены');
      }
      res.send({ data: movie });
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  console.log(req.params.movieId);
  Movie.findOneAndDelete(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Данные не найдены');
      }
      res.send({ data: movie });
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new ValidationError('Переданы некорректные данные');
      }
      res.send({ data: movie });
    })
    .catch(next);
};
