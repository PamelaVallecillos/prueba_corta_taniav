require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const convertRouter = require('./routes/convert');
const historyRouter = require('./routes/history');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/convert', convertRouter);
app.use('/api/history', historyRouter);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Mongo conectado');
    app.listen(PORT, ()=> console.log(`Backend corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error conectando Mongo:', err);
    process.exit(1);
  });
