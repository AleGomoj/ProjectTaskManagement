const express = require('express');
const { register, login, update } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/:id', authMiddleware, update);

module.exports = router;
