<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import type { User } from "../types/Index";

const authStore = useAuthStore();
const users = ref<User[]>([]); // Объявляем, что массив может содержать разные типы
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const API_BASE_URL = "http://localhost:8000";

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    users.value = response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.detail || "Неизвестная ошибка";
    } else {
      error.value = "Не удалось получить список пользователей.";
    }
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="user-list-container">
    <h2>Список пользователей</h2>
    <div v-if="loading">
      <p>Загрузка пользователей...</p>
    </div>
    <div v-else-if="error">
      <p class="error-message">
        {{ error }}
      </p>
    </div>
    <ul v-else-if="users.length">
      <li v-for="user in users" :key="user.id" class="user-item">
        <router-link :to="`/users/${user.id}`">
          {{ user.login }} - {{ "FIO" in user ? user.FIO : "Скрыто" }}
        </router-link>
      </li>
    </ul>
    <div v-else>
      <p>Пользователи не найдены.</p>
    </div>
  </div>
</template>

<style scoped>
.user-list-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.user-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  transition: box-shadow 0.2s ease-in-out;
}

.user-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-item a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  display: block;
}

.error-message {
  color: #dc3545;
  text-align: center;
}
</style>
