const express = require('express');
const router = express.Router();
const { register, login, loginGoogle, getProfile } = require('../controllers/UserController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// POST /users/register — cadastro de usuário
router.post('/register', register);

// POST /users/login — autenticação
router.post('/login', login);

// POST /users/google — autenticação com Google
router.post('/google', loginGoogle);

// GET /users/profile — perfil do usuário autenticado
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
