const router = require('express').Router();
const {
  getUsers, getCurrentUser, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

const {
  validationUserId, validationUpdateUser, validationUpdateAvatar,
} = require('../utils/validators/userValidator');

router.get('/users', getUsers);
router.get('/me', getCurrentUser);
router.get('/users/:userId', validationUserId, getUser);
router.patch('/users/me', validationUpdateUser, updateUser);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
