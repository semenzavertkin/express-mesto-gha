const Cards = require('../models/card');
const DataError = require('../utils/errors/dataError');
const ForbiddenError = require('../utils/errors/forbiddenError');
const NotFoundError = require('../utils/errors/notFoundError');
const { SUCCESS_CREATED } = require('../utils/constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => res.status(SUCCESS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(SUCCESS_CREATED).send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Cards.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Cards.deleteOne(card)
          .then(() => res.status(SUCCESS_CREATED).send(card));
      } else {
        next(new ForbiddenError('В доступе отказано'));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(SUCCESS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные при создании пользователя'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(' Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(SUCCESS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для снятия лайка'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(' Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
