const router = require('express').Router();

const {
  validationUpdateUser, validationUpdateAvatar, validationUserId,
} = require('../middlewares/validation');

const {
  getUsers, getCurrentUser, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserId, getUser);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
