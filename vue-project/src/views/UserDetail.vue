<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import type { User } from "../types/Index.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const user = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const API_BASE_URL = "http://localhost:8000";

const fetchUser = async () => {
  const userId = route.params.id;
  if (!userId) {
    error.value = "Идентификатор пользователя не указан.";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    user.value = response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.detail || "Неизвестная ошибка";
    } else {
      error.value = "Не удалось получить данные пользователя.";
    }
  } finally {
    loading.value = false;
  }
};

const deleteUser = async () => {
  if (
    !confirm(
      `Вы уверены, что хотите удалить пользователя ${user.value?.login}?`,
    )
  ) {
    return;
  }

  try {
    await axios.delete(`${API_BASE_URL}/users/${user.value?.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    alert("Пользователь успешно удалён!");
    await router.push("/users");
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      alert(`Ошибка удаления: ${err.response.data.detail}`);
    } else {
      alert("Произошла ошибка при удалении пользователя.");
    }
  }
};

const RedactedUser = async () => {
  if (user.value) {
    await router.push({ name: "UpdateUser", params: { id: user.value.id } });
  }
};

const toggleBanStatus = async () => {
  const newStatus = !user.value?.in_ban;
  const actionText = newStatus ? "забанить" : "разбанить";

  if (
    !confirm(
      `Вы уверены, что хотите ${actionText} пользователя ${user.value?.login}?`,
    )
  ) {
    return;
  }

  try {
    await axios.patch(
      `${API_BASE_URL}/users/${user.value?.id}/ban_status`,
      { in_ban: newStatus },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );
    if (user.value) {
      user.value.in_ban = newStatus;
    }
    alert(`Пользователь успешно ${actionText}ен!`);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      alert(`Ошибка: ${err.response.data.detail}`);
    } else {
      alert("Произошла ошибка при изменении статуса бана.");
    }
  }
};

onMounted(fetchUser);
</script>

<template>
  <div class="user-detail-container">
    <div v-if="loading">
      <p>Загрузка данных пользователя...</p>
    </div>
    <div v-else-if="error">
      <p class="error-message">
        {{ error }}
      </p>
    </div>
    <div v-else-if="user">
      <h2>Профиль: {{ user.login }}</h2>
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>ФИО:</strong> {{ "FIO" in user ? user.FIO : "Недоступно" }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Статус:</strong> {{ user.in_ban ? "Забанен" : "Активен" }}</p>
      <p>
        <strong>Роли:</strong>
        {{ user.roles?.map((role) => role.name).join(", ") }}
      </p>
      <p><strong>Зарегестрирован:</strong> {{ user.created }}</p>

      <div
        v-if="authStore.roles.includes('admin')"
        class="admin-actions"
      >
        <button
          class="redact-button"
          @click="RedactedUser"
        >
          Редактировать
        </button>
      </div>

      <div
        v-if="authStore.roles.includes('admin')"
        class="admin-actions"
      >
        <button
          class="ban-button"
          @click="toggleBanStatus"
        >
          {{ user.in_ban ? "Разбанить" : "Забанить" }}
        </button>
        <button
          class="delete-button"
          @click="deleteUser"
        >
          Удалить
        </button>
      </div>
    </div>
    <div v-else>
      <p>Пользователь не найден.</p>
    </div>
  </div>
</template>

<style scoped>
.user-detail-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
  font-family: "Arial", sans-serif;
}

h2 {
  text-align: center;
  color: #0056b3;
  margin-bottom: 25px;
  font-size: 28px;
}

p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 10px;
}

p strong {
  color: #555;
  font-weight: bold;
}

.error-message {
  color: #dc3545;
  text-align: center;
  font-weight: bold;
}

.admin-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px; /* Промежуток между кнопками */
}

.ban-button,
.delete-button {
  flex-grow: 1; /* Кнопки будут занимать одинаковое место */
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.ban-button {
  background-color: #ffc107; /* Желтый цвет для бана */
  color: #333;
}

.ban-button:hover {
  background-color: #e0a800;
}

.delete-button {
  background-color: #dc3545; /* Красный цвет для удаления */
  color: #ffffff;
}

.delete-button:hover {
  background-color: #c82333;
}

.redact-button {
  background-color: #28a745; /* Зеленый цвет */
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.redact-button:hover:not(:disabled) {
  background-color: #218838;
}

.redact-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
