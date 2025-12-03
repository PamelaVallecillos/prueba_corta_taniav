<template>
  <div>
    <div class="mb-3">
      <label>Cantidad</label>
      <input v-model.number="amount" type="number" min="0" />
    </div>

    <div class="mb-3">
      <label>Desde</label>
      <select v-model="from">
        <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="mb-3">
      <label>Hacia</label>
      <select v-model="to">
        <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="mb-3">
      <button @click="doConvert">Convertir</button>
    </div>

    <div v-if="loading">Convirtiendo...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="result !== null" class="mt-4">
      <strong>Resultado:</strong> {{ result }} {{ to }} (tasa: {{ rate }})
    </div>

    <hr class="my-4"/>

    <h3>Historial (últimas 50)</h3>
    <ul>
      <li v-for="h in history" :key="h._id">
        {{ new Date(h.createdAt).toLocaleString() }} — {{ h.amount }} {{ h.from }} → {{ h.result.toFixed(4) }} {{ h.to }} (rate: {{ h.rate }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

// Ajusta el baseURL si tu backend corre en otro puerto
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const amount = ref(1);
const from = ref('USD');
const to = ref('EUR');
const currencies = ref(['USD','EUR','GBP','JPY','CAD','AUD']); // lista inicial; la puedes poblar desde API
const result = ref(null);
const rate = ref(null);
const loading = ref(false);
const error = ref(null);
const history = ref([]);

const fetchHistory = async () => {
  try {
    const r = await axios.get(`${API_BASE}/history`);
    history.value = r.data;
  } catch (err) {
    console.error('hist error', err);
  }
};

const doConvert = async () => {
  loading.value = true;
  error.value = null;
  try {
    const r = await axios.post(`${API_BASE}/convert`, { amount: amount.value, from: from.value, to: to.value });
    result.value = r.data.result;
    rate.value = r.data.rate;
    await fetchHistory();
  } catch (err) {
    console.error(err);
    error.value = err?.response?.data?.error || 'Error al convertir';
  } finally {
    loading.value = false;
  }
};

// Actualizar valores en "tiempo real" al cambiar monedas: convertimos automáticamente
watch([from, to], () => {
  if (amount.value > 0) doConvert();
});

onMounted(() => {
  fetchHistory();
});
</script>

<style>
/* estilo básico, puedes usar Tailwind si lo prefieres */
input, select { padding: 6px; margin-top: 4px; display:block; }
button { padding: 8px 12px; }
</style>
