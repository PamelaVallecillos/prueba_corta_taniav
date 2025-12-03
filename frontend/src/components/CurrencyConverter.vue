<template>
  <div class="converter-root">
    <section class="card input-card">
      <div class="row inputs-row">
        <div class="col">
          <label class="label">Cantidad</label>
          <input v-model.number="amount" type="number" min="0" class="input" />
        </div>

        <div class="col">
          <label class="label">De (Origen)</label>
          <select v-model="from" class="select">
            <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div class="col">
          <label class="label">A (Destino)</label>
          <select v-model="to" class="select">
            <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="doConvert">Convertir</button>
        <div v-if="loading" class="loading">Convirtiendo...</div>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </section>

    <section class="card result-card" v-if="result !== null">
      <div class="result-left">
        <div class="result-amount">{{ amount.toFixed(2) }} {{ from }} = <span class="result-value">{{ result.toFixed(2) }} {{ to }}</span></div>
        <div class="rate">Tasa de cambio actual: 1 {{ from }} = {{ rate }} {{ to }}</div>
      </div>
    </section>

    <section class="history card">
      <h3>Historial de Conversiones (últimas 50)</h3>
      <ul class="history-list">
        <li v-for="h in history" :key="h._id" class="history-item">
          <div class="hist-title">{{ h.amount.toFixed(2) }} {{ h.from }} → {{ h.result.toFixed(2) }} {{ h.to }}</div>
          <div class="hist-meta">{{ new Date(h.createdAt).toLocaleString() }} · Tasa {{ h.rate }}</div>
        </li>
      </ul>
    </section>
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
/* Basic card layout to resemble the target design */
.converter-root { display:block; gap:20px; }
.card { background:white; border-radius:8px; box-shadow:0 8px 20px rgba(16,24,40,0.08); padding:18px; margin-bottom:18px; }

.input-card .inputs-row { display:flex; gap:16px; }
.input-card .col { flex:1; }
.label { display:block; font-size:13px; color:#334155; margin-bottom:6px; }
.input, .select { width:100%; padding:10px 12px; border:1px solid #e6eef8; border-radius:6px; font-size:14px; }

.actions { display:flex; align-items:center; gap:12px; margin-top:12px; }
.btn-primary { background:#2e8b57; color:white; border:none; padding:10px 18px; border-radius:6px; font-weight:600; }
.loading { color:#0b59a3; font-size:14px; }
.error { color:#c53030; }

.result-card { padding:20px 22px; }
.result-amount { font-size:20px; font-weight:700; color:#0b59a3; }
.result-value { color:#16a34a; margin-left:8px; }
.rate { color:#475569; margin-top:6px; }

.history h3 { margin:0 0 10px 0; }
.history-list { list-style:none; padding:0; margin:0; }
.history-item { padding:12px; border-top:1px solid #f1f5f9; }
.hist-title { font-weight:600; color:#0b59a3; }
.hist-meta { font-size:12px; color:#64748b; margin-top:6px; }
</style>
