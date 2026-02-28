const express = require('express');
const router = express.Router();
const { getUsers, updateProfile, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', adminOnly, getUsers);
router.put('/profile', updateProfile);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;
