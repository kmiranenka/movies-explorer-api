const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');

module.exports.sendUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Данные не найдены');
      }
      const userData = {
        name: user.name,
        email: user.email,
      };
      res.send({ data: userData });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        throw new ValidationError('Переданы некорректные данные');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError('Переданы некорректные данные');
      }

      const userData = {
        name: user.name,
        _id: user._id,
        email: user.email,
      };
      res.send({ data: userData });
    })
    .catch(() => next(new ConflictError('Пользователь уже создан')));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ValidationError('Переданы некорректные данные');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
