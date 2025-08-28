<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { NewsUpdatePayload } from "../types/Index.ts";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const newsId = route.params.id;

const newsData = ref<NewsUpdatePayload>({
  title: "",
  body: "",
  category: "",
  tags: [],
});

const tagsInput = ref<string>("");
const availableCategories = ref<string[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const API_BASE_URL = "http://localhost:8000";

const fetchNewsData = async () => {
  try {
    const headers = { Authorization: `Bearer ${authStore.getToken}` };
    const response = await axios.get(`${API_BASE_URL}/news/${newsId}`, {
      headers,
    });

    newsData.value = {
      title: response.data.title,
      body: response.data.body,
      category: response.data.category,
      tags: response.data.tags,
    };

    tagsInput.value = newsData.value.tags.join(", ");
  } catch (err: unknown) {
    console.error("Ошибка при загрузке данных новости:", err);
    if (axios.isAxiosError(err) && err.response) {
      error.value =
        "Не удалось загрузить данные новости. Проверьте права доступа.";
    } else {
      error.value = "Произошла неизвестная ошибка.";
    }
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get<string[]>(
      `${API_BASE_URL}/news/categories`,
    );
    availableCategories.value = response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Ошибка при загрузке категорий:", err);
    }
  }
};

onMounted(() => {
  fetchNewsData();
  fetchCategories();
});

const submitUpdate = async () => {
  try {
    const tagsArray = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      ...newsData.value,
      tags: tagsArray,
    };

    const headers = { Authorization: `Bearer ${authStore.getToken}` };
    await axios.patch(`${API_BASE_URL}/news/${newsId}`, payload, { headers });

    alert("Новость успешно обновлена!");
    router.push(`/news/${newsId}`); // Перенаправляем на страницу новости
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        "Ошибка при обновлении новости:",
        err.response?.data || err.message,
      );
      alert("Не удалось обновить новость. Проверьте данные и права доступа.");
    }
  }
};
</script>

<template>
  <div class="update-news-container">
    <h2>Обновление новости</h2>
    <div
      v-if="loading"
      class="loading-message"
    >
      Загрузка данных новости...
    </div>
    <div
      v-else-if="error"
      class="error-message"
    >
      {{ error }}
    </div>
    <form
      v-else
      @submit.prevent="submitUpdate"
    >
      <div class="form-group">
        <label for="title">Заголовок</label>
        <input
          id="title"
          v-model="newsData.title"
          type="text"
          placeholder="Введите заголовок новости"
          required
        >
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
        <select
          id="category"
          v-model="newsData.category"
          required
        >
          <option
            disabled
            value=""
          >
            Выберите категорию
          </option>
          <option
            v-for="tag in availableCategories"
            :key="tag"
            :value="tag"
          >
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
          placeholder="Введите теги через запятую"
        >
      </div>

      <button
        type="submit"
        class="submit-button"
      >
        Сохранить изменения
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Можно использовать те же стили, что и в CreateNews.vue,
   просто скопируйте их в UpdateNews.vue */
.update-news-container {
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
  resize: vertical;
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
