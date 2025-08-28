<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { NewsPayload } from "../types/Index.ts";

const authStore = useAuthStore();
const router = useRouter();

const newsData = ref<NewsPayload>({
  title: "",
  body: "",
  category: null,
  tags: [],
});

const tagsInput = ref<string>("");

const availableCategories = ref<string[]>([]);

const API_BASE_URL = "http://localhost:8000";

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/categories`);
    availableCategories.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
  }
};

onMounted(fetchCategories);

const submitNews = async () => {
  try {
    const tagsArray = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      ...newsData.value,
      tags: tagsArray,
    };

    const response = await axios.post(`${API_BASE_URL}/news`, payload, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    console.log("Новость успешно создана:", response.data);
    await router.push(`/news/${response.data.id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Ошибка ответа сервера:", error.response.status);
      console.error("Данные ошибки:", error.response.data);

      if (error.response.status === 400) {
        alert("Ошибка: Неверные данные. Проверьте форму.");
      } else if (error.response.status === 401) {
        alert("Ошибка: Вы не авторизованы.");
      } else if (error.response.status === 403) {
        alert("Ошибка: Недостаточно прав для выполнения операции.");
      } else if (error.response.status === 404) {
        alert("Ошибка: Новость не найдена.");
      } else {
        alert("Произошла неизвестная ошибка на сервере.");
      }
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("Ошибка запроса:", error.request);
      alert("Не удалось связаться с сервером. Проверьте подключение к сети.");
    } else {
      console.error("Ошибка при настройке запроса:", (error as Error).message);
      alert("Произошла внутренняя ошибка.");
    }
  }
};
</script>

<template>
  <div class="create-news-container">
    <h2>Создание новой новости</h2>
    <form @submit.prevent="submitNews">
      <div class="form-group">
        <label for="title">Заголовок</label>
        <input
          id="title"
          v-model="newsData.title"
          type="text"
          placeholder="Введите заголовок новости"
          required
        />
      </div>

      <div class="form-group">
        <label for="body">Текст новости</label>
        <textarea
          id="body"
          v-model="newsData.body"
          rows="10"
          placeholder="Введите полный текст новости"
          required
        />
      </div>

      <div class="form-group">
        <label for="category">Категория</label>
        <select id="category" v-model="newsData.category" required>
          <option disabled value="">Выберите категорию</option>
          <option v-for="tag in availableCategories" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="tags">Теги</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="Введите теги через запятую (например: спорт, футбол, чемпионат)"
        />
      </div>

      <button type="submit" class="submit-button">Опубликовать</button>
    </form>
  </div>
</template>

<style scoped>
.create-news-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
}

h2 {
  text-align: center;
  color: #0056b3;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical; /* Разрешаем изменение размера только по вертикали */
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
</style>
