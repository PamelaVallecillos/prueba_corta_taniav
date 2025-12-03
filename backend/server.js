require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch(err => console.error("Error conectando Mongo:", err));

// Rutas (ejemplo)
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

// Rutas API
const convertRoute = require('./routes/convert');
const historyRoute = require('./routes/history');

app.use('/api/convert', convertRoute);
app.use('/api/history', historyRoute);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
