<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const username = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();
const authStore = useAuthStore();

const API_BASE_URL = 'http://localhost:8000';

const login = async () => {
  try {
    const params = new URLSearchParams();
    params.append('username', username.value);
    params.append('password', password.value);

    const response = await axios.post(`${API_BASE_URL}/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token} = response.data;

    authStore.setToken(access_token);

    message.value = 'Авторизация успешна! Перенаправление...';
    console.log('Токен:', response.data.access_token)
    router.push('/');
  } catch (error) {
    message.value = 'Ошибка авторизации: ' + (error.response?.data?.detail || error.message);
    console.error('Ошибка логина:', error);
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Вход в систему</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Войти</button>
    </form>
    <div class="register-link-container">
      <router-link to="/create-user" class="register-link">
        Зарегистрироваться
      </router-link>
    </div>
    <p v-if="message" :class="{ 'success': message.includes('успешна'), 'error': message.includes('Ошибка') }">{{ message }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

p {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.register-link-container {
  text-align: center;
  margin-top: 15px; /* Отступ от кнопки "Войти" */
}

.register-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
}

.register-link:hover {
  text-decoration: underline;
  color: #0056b3;
}
</style>
