const User = require('../models/user');
const { DATA_ERROR, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createUser, getUsers, getUser, updateUser, updateAvatar,
};
