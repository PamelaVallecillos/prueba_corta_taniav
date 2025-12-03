const express = require('express');
const router = express.Router();
const axios = require('axios');
const Conversion = require('../models/Conversion');

const API_BASE = process.env.EXCHANGE_API_BASE; // https://v6.exchangerate-api.com/v6
const API_KEY = process.env.EXCHANGE_API_KEY;

// POST /api/convert
router.post('/', async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    if (!amount || !from || !to) {
      return res.status(400).json({ error: "Faltan parámetros." });
    }

    // Endpoint oficial de ExchangeRate-API
    // https://v6.exchangerate-api.com/v6/APIKEY/pair/USD/EUR/100
    const url = `${API_BASE}/${API_KEY}/pair/${from}/${to}/${amount}`;

    const response = await axios.get(url);

    if (response.data.result !== "success") {
      return res.status(500).json({ error: "Error al obtener conversión de la API." });
    }

    const rate = response.data.conversion_rate;
    const result = response.data.conversion_result;

    // Guardamos en MongoDB
    const doc = new Conversion({
      amount,
      from,
      to,
      result,
      rate
    });

    await doc.save();

    res.json({
      amount,
      from,
      to,
      result,
      rate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo convertir la moneda.' });
  }
});

module.exports = router;
