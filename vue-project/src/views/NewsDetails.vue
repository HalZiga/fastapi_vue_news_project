<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { NewsItem } from "../types/Index.ts";
import DOMPurify from "dompurify";

const newsItem = ref<NewsItem | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isPublishing = ref(false);
const publishMessage = ref("");
const publishMessageColor = ref("black");

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const API_BASE_URL = "http://localhost:8000";

const fetchNewsDetails = async () => {
  try {
    loading.value = true;
    publishMessage.value = "";

    const newsId = route.params.id;
    if (!newsId) {
      error.value = "Идентификатор новости не указан.";
      loading.value = false;
      return;
    }

    const headers: Record<string, string> = {};

    if (authStore.isAuthenticated) {
      headers["Authorization"] = `Bearer ${authStore.getToken}`;
    }

    const response = await axios.get(`${API_BASE_URL}/news/${newsId}`, {
      headers,
    });

    response.data.body = DOMPurify.sanitize(response.data.body);
    newsItem.value = response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("Ошибка при загрузке деталей новости:", err);
      if (err.response.status === 404) {
        error.value = "Новость не найдена.";
      } else if (err.response.status === 403) {
        error.value = "У вас нет доступа к этой новости.";
      } else {
        error.value =
          "Не удалось загрузить детали новости. Пожалуйста, попробуйте позже.";
      }
      newsItem.value = null; // Очищаем новость при ошибке
    }
  } finally {
    loading.value = false;
  }
};

// метод для публикации новости
const publishNews = async () => {
  const newsId = route.params.id;
  const token = authStore.getToken;

  if (!token) {
    publishMessage.value = "Вы не авторизованы для публикации новости.";
    publishMessageColor.value = "red";
    return;
  }

  isPublishing.value = true;
  publishMessage.value = "";

  try {
    await axios.patch(
      `${API_BASE_URL}/news/publish/${newsId}`,
      {},
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    publishMessage.value = "Новость успешно опубликована!";
    publishMessageColor.value = "green";

    await fetchNewsDetails();
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("Ошибка при публикации новости:", err);
      if (err.response.data && err.response.data.detail) {
        publishMessage.value = `Ошибка публикации: ${err.response.data.detail}`;
      } else {
        publishMessage.value = "Произошла ошибка при публикации новости.";
      }
      publishMessageColor.value = "red";
    }
  } finally {
    isPublishing.value = false;
  }
};

// метод удалть
const deleteNews = async () => {
  if (confirm("Вы уверены, что хотите удалить эту новость?")) {
    try {
      const newsId = route.params.id;
      const headers = { Authorization: `Bearer ${authStore.getToken}` };

      console.log(
        "Отправляем DELETE-запрос на:",
        `${API_BASE_URL}/news/${newsId}`,
      );

      await axios.delete(`${API_BASE_URL}/news/${newsId}`, { headers });
      alert("Новость успешно удалена!");
      await router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Ошибка при удалении новости:", err);
        if (err.response.data && err.response.data.detail) {
          alert(`Не удалось удалить новость: ${err.response.data.detail}`);
        } else {
          alert("Не удалось удалить новость. Произошла неизвестная ошибка.");
        }
      }
    }
  }
};

const editNews = () => {
  if (newsItem.value) {
    router.push({ name: "UpdateNews", params: { id: newsItem.value.id } });
  } else {
    console.error("Не удалось найти новость для редактирования.");
  }
};

onMounted(() => {
  fetchNewsDetails();
});

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchNewsDetails();
    }
  },
);

const goBack = () => {
  router.push({ name: "NewsList" });
};
</script>

<template>
  <div class="news-details-container">
    <button class="back-button" @click="goBack">← Назад к новостям</button>

    <div v-if="loading" class="loading-message">Загрузка новости...</div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else-if="newsItem">
      <h2>{{ newsItem.title }}</h2>
      <p class="news-meta">
        Автор: **{{ newsItem.author || "Неизвестен" }}** | Опубликовано: **{{
          newsItem.published_at
            ? new Date(newsItem.published_at).toLocaleDateString()
            : "Не опубликовано"
        }}** | Просмотры: **{{ newsItem.views }}**
      </p>
      <div class="news-tags">
        <span v-for="tag in newsItem.tags" :key="tag" class="tag">{{
          tag
        }}</span>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="news-body" v-html="newsItem.body" />

      <div
        v-if="newsItem.can_publish && newsItem.status !== 'published'"
        class="publish-action-area"
      >
        <button
          :disabled="isPublishing"
          class="publish-button"
          @click="publishNews"
        >
          {{ isPublishing ? "Публикация..." : "Опубликовать новость" }}
        </button>
        <p
          v-if="publishMessage"
          :style="{ color: publishMessageColor }"
          class="publish-status-message"
        >
          {{ publishMessage }}
        </p>
      </div>

      <div v-if="newsItem.can_delete_update" class="action-buttons">
        <button class="edit-button" @click="editNews">Обновить</button>

        <button class="delete-button" @click="deleteNews">Удалить</button>
      </div>
    </div>
    <div v-else class="no-news-message">
      Новость не найдена или произошла ошибка.
    </div>
  </div>
</template>

<style scoped>
.news-details-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

.back-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  margin-bottom: 25px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #5a6268;
}

h2 {
  color: #0056b3;
  margin-bottom: 15px;
  font-size: 2.2em;
  text-align: center;
}

.news-meta {
  font-size: 0.9em;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.news-tags {
  text-align: center;
  margin-bottom: 25px;
}

.tag {
  display: inline-block;
  background-color: #e3f2fd;
  color: #2196f3;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  margin-right: 8px;
  margin-bottom: 8px;
  font-weight: bold;
}

.news-body {
  font-size: 1.1em;
  color: #444;
  white-space: pre-wrap;
}

.news-body >>> p {
  margin-bottom: 1em;
}

.news-body >>> img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 15px auto;
  border-radius: 8px;
}

.loading-message,
.error-message,
.no-news-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
  color: #555;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
}

/* Новые стили для кнопки публикации (минимальные, чтобы не нарушать существующие) */
.publish-action-area {
  margin-top: 30px;
  text-align: center;
}

.publish-button {
  background-color: #28a745; /* Зеленый цвет */
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
}

.publish-button:hover:not(:disabled) {
  background-color: #218838; /* Темнее при наведении */
}

.publish-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.publish-status-message {
  margin-top: 10px;
  font-size: 0.9em;
  font-weight: bold;
}

.edit-button,
.delete-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #3498db;
  color: #fff;
}

.edit-button:hover {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c;
  color: #fff;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>
