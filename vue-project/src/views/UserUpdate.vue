<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import type { User, Role } from '../types/Index.ts';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const userToUpdate = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const updateSuccess = ref(false);

const API_BASE_URL = 'http://localhost:8000';

// Данные для формы
const login = ref('');
const FIO = ref('');
const phone = ref('');
const email = ref('');
const in_ban = ref(false);
const new_role_ids = ref<number[]>([]);
const availableRoles = ref<Role[]>([]);

const fetchUser = async () => {
  const userId = route.params.id;
  if (!userId) {
    error.value = 'Идентификатор пользователя не указан.';
    loading.value = false;
    return;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    userToUpdate.value = response.data;

    if (userToUpdate.value) {
      login.value = userToUpdate.value.login;
      FIO.value = userToUpdate.value.FIO || '';
      phone.value = userToUpdate.value.phone || '';
      email.value = userToUpdate.value.email || '';
      in_ban.value = userToUpdate.value.in_ban;
      new_role_ids.value = userToUpdate.value.roles.map(role => role.id);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.detail || 'Неизвестная ошибка';
    } else {
      error.value = 'Не удалось получить данные пользователя.';
    }
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    availableRoles.value = response.data;
  } catch (err: unknown) {
    console.error('Ошибка при загрузке ролей:', err);
  }
};

onMounted(() => {
  fetchUser();
  fetchRoles();
  fetchRoles();
});

const updateUser = async () => {
  try {
    const payload: any = {
      login: login.value,
      FIO: FIO.value,
      phone: phone.value,
      email: email.value,
      in_ban: authStore.roles.includes('admin') ? in_ban.value : undefined
    };

    if (authStore.roles.includes('admin')) {
      payload.role_ids = new_role_ids.value;
    } else {
      delete payload.role_ids;
    }

    await axios.patch(`${API_BASE_URL}/users/${userToUpdate.value?.id}`, payload, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });

    updateSuccess.value = true;
    alert('Данные пользователя успешно обновлены!');
    await router.push({ name: 'UserDetail', params: { id: userToUpdate.value?.id } });
  } catch (err: unknown) {
    updateSuccess.value = false;
    if (axios.isAxiosError(err) && err.response) {
      alert(`Ошибка обновления: ${err.response.data.detail}`);
    } else {
      alert('Произошла ошибка при обновлении пользователя.');
    }
  }
};
</script>

<template>
  <div class="user-update-container">
    <h2>Редактирование пользователя: {{ userToUpdate?.login }}</h2>
    <div v-if="loading">
      <p>Загрузка данных...</p>
    </div>
    <div v-else-if="error">
      <p class="error-message">{{ error }}</p>
    </div>
    <form v-else @submit.prevent="updateUser">
      <div class="form-group">
        <label for="login">Логин</label>
        <input type="text" id="login" v-model="login" />
      </div>
      <div class="form-group">
        <label for="FIO">ФИО</label>
        <input type="text" id="FIO" v-model="FIO" />
      </div>
      <div class="form-group">
        <label for="phone">Телефон</label>
        <input type="text" id="phone" v-model="phone" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" />
      </div>

      <div v-if="authStore.roles.includes('admin')">
        <div class="form-group">
          <label>Роли</label>
          <div v-for="role in availableRoles" :key="role.id" class="checkbox-group">
            <input type="checkbox" :id="`role-${role.id}`" :value="role.id" v-model="new_role_ids" />
            <label :for="`role-${role.id}`">{{ role.name }}</label>
          </div>
        </div>
      </div>
      <button type="submit" class="submit-button">Сохранить изменения</button>
    </form>
  </div>
</template>

<style scoped>
.user-update-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  color: #0056b3;
  margin-bottom: 25px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="email"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  text-align: center;
  font-weight: bold;
}
</style>
