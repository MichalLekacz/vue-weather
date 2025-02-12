<template>
  <div class="container">
    <div class="top-bar">
      <h2 class="app-name">Weather<span class="gradient-text">Pulse</span>.com</h2>
    </div>
    <h2 class="text-center mt-5">Logowanie</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <input v-model="username" type="text" class="form-control" placeholder="Login">
      </div>
      <div class="mb-3">
        <input v-model="password" type="password" class="form-control" placeholder="Hasło">
      </div>
      <button type="submit" class="btn btn-primary w-100 gradient-bg">Zaloguj</button>
    </form>

    <!-- Modal dla błędnego logowania -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content bg-dark">
        <p>Błędne dane logowania!</p>
        <button @click="isModalOpen = false" class="btn text-white gradient-bg">Zamknij</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const username = ref('');
const password = ref('');
const isModalOpen = ref(false);

const login = () => {
  const isAuthenticated = auth.login(username.value, password.value);
  if (isAuthenticated) {
    router.push('/weather');
  } else {
    isModalOpen.value = true;
  }
};
</script>

<style scoped>
/* Gradient dla przycisku */
.gradient-bg {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
  border: none;
}

.gradient-text {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
  -webkit-background-clip: text;
  color: transparent;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
