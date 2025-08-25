<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { NewsItem } from '../types/Index.ts';

const news = ref<NewsItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const router = useRouter();
const authStore = useAuthStore();

const API_BASE_URL = 'http://localhost:8000';

const fetchNews = async () => {
  try {
    loading.value = true;
    error.value = null;

    let url = '';
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${authStore.getToken}`
    };

    if (authStore.isAuthenticated) {
      url = `${API_BASE_URL}/news/`;
      headers['Authorization'] = `Bearer ${authStore.getToken}`;
    } else {
      url = `${API_BASE_URL}/news/published`;
    }

    const response = await axios.get(url, { headers });
    news.value = response.data;
  } catch (err) {
    console.error('Ошибка при загрузке новостей:', err);
    error.value = 'Не удалось загрузить новости. Пожалуйста, попробуйте позже.';
  } finally {
    loading.value = false;
  }
};

const viewNewsDetails = (newsId: number) => {
  router.push(`/news/${newsId}`);
};

onMounted(() => {
  fetchNews();
});
</script>

<template>
  <div class="news-list-container">
    <h2>
      {{ authStore.isAuthenticated ? 'Все новости' : 'Опубликованные новости' }}
    </h2>

    <div v-if="loading" class="loading-message">Загрузка новостей...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="news.length === 0" class="no-news-message">
      Пока нет новостей.
    </div>
    <div v-else class="news-cards">
      <div v-for="item in news" :key="item.id" class="news-card" @click="viewNewsDetails(item.id)">
        <h3>{{ item.title }}</h3>
          <p class="news-author">Автор: {{ item.author || 'Неизвестен' }}</p>
        <p class="news-status" :class="item.status">{{ item.status }}</p> <p class="news-published">Опубликовано: {{ item.published_at ? new Date(item.published_at).toLocaleDateString() : 'N/A' }}</p>
        <div class="news-tags">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <p class="news-views">Просмотры: {{ item.views }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-list-container {
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
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

.news-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.news-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.news-card h3 {
  color: #0056b3;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.4em;
  line-height: 1.3;
}

.news-card p {
  color: #666;
  font-size: 0.95em;
  margin-bottom: 5px;
}

.news-author, .news-published {
  font-size: 0.85em;
  color: #777;
}

.news-status {
  font-size: 0.85em;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 5px;
  padding: 2px 5px;
  border-radius: 3px;
  display: inline-block;
}

.news-status.draft {
  background-color: #fff3cd;
  color: #856404;
}

.news-status.published {
  background-color: #d4edda;
  color: #155724;
}

.news-status.archived {
  background-color: #f8d7da;
  color: #721c24;
}


.news-tags {
  margin-top: 10px;
  margin-bottom: 10px;
}

.tag {
  display: inline-block;
  background-color: #e0f7fa;
  color: #00796b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  margin-right: 5px;
  margin-bottom: 5px;
}

.news-views {
  font-weight: bold;
  color: #444;
  text-align: right;
  margin-top: auto;
}
</style>
