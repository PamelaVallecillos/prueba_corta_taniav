const express = require('express');
const router = express.Router();
const Conversion = require('../models/Conversion');

// GET /api/history
router.get('/', async (req, res) => {
  try {
    const items = await Conversion.find().sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo obtener historial' });
  }
});

module.exports = router;
