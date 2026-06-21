const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportsByLocation,
  updateStatus,
  deleteReport,
} = require('../controllers/ReportController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../services/uploadService');

// GET /reports — listar Ocorrência do usuário (admin vê todas)
router.get('/', authMiddleware, getAllReports);

// GET /reports/nearby — buscar por proximidade (filtra por dono; admin vê todas)
router.get('/nearby', authMiddleware, getReportsByLocation);

// POST /reports — criar denúncia (autenticado, com upload opcional)
router.post('/', authMiddleware, upload.single('imagem'), createReport);

// PATCH /reports/:id/status — atualizar status (somente admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateStatus);

// DELETE /reports/:id — remover denúncia (dono ou admin)
router.delete('/:id', authMiddleware, deleteReport);

module.exports = router;