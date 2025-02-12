<template>
  <div class="header">
    <!-- Górna sekcja: Nazwa aplikacji -->
    <div class="top-bar">
      <h2 class="app-name">Weather<span class="gradient-text">Pulse</span>.com</h2>
    </div>
    <!-- Slogan aplikacji -->
    <h1 class="slogan">
      Observe <span class="gradient-text">Weather</span> in cities you love<span class="gradient-text">!</span>
    </h1>

  </div>
</template>

<script lang="ts">
export default {
  name: 'Header',
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  padding-top: 20px;
}

/* Górna sekcja */
.top-bar {
  display: flex;
  justify-content: start;
  padding: 0 20px;
  position: absolute;
  top: 0;
  width: 100%;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

/* Stylizacja sloganu */
.slogan {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-top: 50px; /* 🔹 Odsunięcie w dół, aby nie kolidowało z logo */
}

.gradient-text {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
  -webkit-background-clip: text;
  color: transparent;
}

.gradient-bg {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
}

.city-list ul li {
  display: inline;
  margin: 8px;
  padding: 6px;
}
</style>
