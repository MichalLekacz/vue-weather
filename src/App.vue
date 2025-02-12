<template>
  <div id="app">
    <!-- Tylko router-view, bez Header -->
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Styl pozostaje taki sam */
#app {
  min-height: 100vh;
  background-color: #212121;
  color: #f1f1f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
