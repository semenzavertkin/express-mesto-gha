const Cards = require('../models/card');
const { DATA_ERROR, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
