<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user = ref({
  login: "",
  FIO: "",
  phone: "",
  email: "",
  password: "",
});

const message = ref("");
const isSuccess = ref(false);
const API_BASE_URL = "http://localhost:8000/";
const router = useRouter();

const createUser = async () => {
  message.value = "";
  isSuccess.value = false;

  const payload = {
    ...user.value,
  };

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await axios.post(`${API_BASE_URL}users/`, payload, {
      headers,
    });

    message.value = `Пользователь ${response.data.login} успешно создан!`;
    isSuccess.value = true;

    user.value.login = "";
    user.value.FIO = "";
    user.value.phone = "";
    user.value.email = "";
    user.value.password = "";

    console.log("Новый пользователь:", response.data);
    router.push(`/login`);
  } catch (error) {
    isSuccess.value = false;
    if (error.response && error.response.data && error.response.data.detail) {
      message.value = error.response.data.detail;
    } else {
      message.value = "Произошла ошибка при создании пользователя.";
    }
    console.error("Ошибка создания пользователя:", error);
  }
};
</script>

<template>
  <div class="create-user-container">
    <h2>Создание нового пользователя</h2>
    <form @submit.prevent="createUser">
      <div class="form-group">
        <label for="login">Логин</label>
        <input
          id="login"
          v-model="user.login"
          type="text"
          required
        >
      </div>

      <div class="form-group">
        <label for="fio">ФИО</label>
        <input
          id="fio"
          v-model="user.FIO"
          type="text"
          required
        >
      </div>

      <div class="form-group">
        <label for="phone">Телефон</label>
        <input
          id="phone"
          v-model="user.phone"
          type="text"
        >
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="user.email"
          type="email"
          required
        >
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="user.password"
          type="password"
          required
        >
      </div>

      <button type="submit">
        Создать
      </button>
    </form>

    <p
      v-if="message"
      :class="{ success: isSuccess, error: !isSuccess }"
    >
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.create-user-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
}

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
</style>
