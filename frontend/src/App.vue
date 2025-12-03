<template>
  <div id="app-root">
    <header class="site-header">
      <h1>Conversor de Monedas</h1>
    </header>

    <main class="container">
      <CurrencyConverter />
    </main>
  </div>
</template>

<script setup>
import CurrencyConverter from './components/CurrencyConverter.vue'
</script>

<style>
/* Page layout */
#app-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f3f6fb; min-height:100vh; }
.site-header { text-align:center; padding:48px 16px 12px; }
.site-header h1 { margin:0; font-size:36px; color:#0b59a3; letter-spacing:0.5px; border-bottom:4px solid #0b59a3; display:inline-block; padding-bottom:12px; }
.container { max-width:880px; margin:24px auto; padding:0 16px 48px; }

/* Utility */
button { cursor:pointer; }
</style>
