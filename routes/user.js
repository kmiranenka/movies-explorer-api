const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { sendUser, updateUserInfo } = require('../controllers/user');

router.get('/me', sendUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

module.exports = router;
