<template>
  <div class="header">
    <!-- Górna sekcja: Nazwa aplikacji -->
    <div class="top-bar">
      <h2 class="app-name">Weather<span class="gradient-text">Pulse</span>.com</h2>

      <!-- Przycisk wylogowania -->
      <button 
        @click="logout"
        class="btn btn-danger logout-btn">
        Wyloguj
      </button>
    </div>

    <!-- Slogan aplikacji -->
    <h1 class="slogan">
      Observe <span class="gradient-text">Weather</span> in cities you love<span class="gradient-text">!</span>
    </h1>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'; // Importujemy Vue Router

export default {
  name: 'Header',
  setup() {
    const router = useRouter();

    // Funkcja do wylogowania i przekierowania do strony logowania
    const logout = () => {
      router.push('/');
    };

    return {
      logout
    };
  }
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
  justify-content: space-between; /* Przestrzeń między logo a przyciskiem */
  align-items: center; /* Wyrównanie w pionie */
  padding: 0 20px;
  position: absolute;
  top: 0;
  width: 100%;
}

/* Nazwa aplikacji */
.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

/* Przycisk Wyloguj */
.logout-btn {
  background-color: #dc3545;
  border: none;
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
}

.logout-btn:hover {
  background-color: #c82333;
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
