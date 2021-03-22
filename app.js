require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const {
  errors, celebrate, Joi, isCelebrateError,
} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const movieRouter = require('./routes/movie.js');
const usersRouter = require('./routes/user.js');
const {
  login, createUser,
} = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://api.mironenko.students.nomoredomains.icu',
    'https://www.api.mironenko.students.nomoredomains.icu',
    'https://mironenko.students.nomoredomains.icu',
    'https://www.mironenko.students.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};
app.use('*', cors(options));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const resourceNotFound = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
    name: Joi.string().required().min(2),
  }),
}), createUser);

app.use('/movies', auth, movieRouter);
app.use('/users', auth, usersRouter);

app.use(resourceNotFound);
app.use(errorLogger);

app.use((next) => {
  errors();
  next();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (isCelebrateError(err)) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
