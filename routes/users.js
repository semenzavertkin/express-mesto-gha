const router = require('express').Router();
const {
  createUser, getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
