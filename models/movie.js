const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return v.match(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:\\/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/g);
      },
      message: 'Невалидная ссылка',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return v.match(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:\\/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/g);
      },
      message: 'Невалидная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return v.match(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:\\/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/g);
      },
      message: 'Невалидная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movies', cardSchema);
