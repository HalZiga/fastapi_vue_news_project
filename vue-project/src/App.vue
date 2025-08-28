<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = (): void => {
  authStore.clearToken();
  router.push("/login"); // Перенаправляем на страницу входа
};
</script>

<template>
  <div id="app-layout">
    <header class="main-header">
      <nav class="main-nav">
        <div class="nav-links-left">
          <RouterLink to="/" class="nav-link"> Новости </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/create"
            class="nav-link"
          >
            Создать новость
          </RouterLink>
          <RouterLink
            v-if="authStore.roles && authStore.roles.includes('admin')"
            to="/users"
            class="nav-link"
          >
            Просмотреть пользователей
          </RouterLink>
        </div>

        <div class="nav-links-right">
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              v-if="authStore.isAuthenticated && authStore.id"
              :to="{ name: 'UpdateUser', params: { id: authStore.id } }"
              class="nav-link user-login"
            >
              {{ authStore.login }}
            </RouterLink>
            <a class="nav-link logout-link" href="#" @click="logout">Выйти</a>
          </template>
          <RouterLink v-else to="/login" class="nav-link"> Войти </RouterLink>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.user-login {
  color: #42b983; /* Или любой другой цвет, который вам нравится */
  font-weight: bold;
  padding: 8px 15px;
  cursor: default; /* Курсор по умолчанию, чтобы не выглядел как ссылка */
}

.nav-links-left {
  display: flex;
  gap: 20px;
}

.nav-links-right {
  display: flex;
  gap: 20px;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #1a1a1a; /* Темный фон, как на скриншоте */
  color: #e0e0e0;
}

#app-layout {
  display: flex;
  flex-direction: column; /* Элементы располагаются в колонку */
  min-height: 100vh; /* Минимальная высота - весь экран */
}

.main-header {
  background-color: #2c2c2c; /* Фон для верхней панели */
  padding: 15px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-nav {
  display: flex;
  justify-content: space-between; /* Элементы по краям */
  align-items: center; /* Выравнивание по центру по вертикали */
  max-width: 1200px;
  margin: 0 auto;
}

.nav-link-brand {
  color: #42b983; /* Цвет для бренда/названия */
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: none;
}

.nav-links-right {
  display: flex;
  gap: 20px; /* Расстояние между ссылками */
}

.nav-link {
  color: #e0e0e0; /* Цвет текста ссылок */
  text-decoration: none;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.nav-link:hover {
  background-color: #424242;
  color: #ffffff;
}

.nav-link.router-link-active {
  color: #42b983; /* Активная ссылка */
  background-color: #383838;
}

.logout-link {
  cursor: pointer;
}

/* Основное содержимое */
.main-content {
  flex-grow: 1; /* Заставляет этот блок занимать все оставшееся пространство */
  padding: 20px;
  /* Дополнительные стили, если нужно центрировать контент RouterView */
  display: flex; /* Сделаем его flex-контейнером */
  justify-content: center; /* Центрировать содержимое по горизонтали */
  align-items: flex-start; /* Выравнивать по верху по вертикали */
  /* background-color: #1a1a1a; /* Это уже есть в body */
}

/* Стили для контейнера списка новостей или логина,
   чтобы он был центрирован и имел белую подложку */
/* Эти стили должны быть в NewsList.vue и Login.vue соответственно,
   но я покажу их здесь для примера, чтобы вы понимали, что нужно изменить */
.news-list-container,
.login-container,
.news-details-container {
  /* Добавьте сюда классы ваших корневых элементов View-компонентов */
  background-color: #ffffff; /* Белый фон для карточек/форм */
  color: #333; /* Темный текст для белого фона */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px 30px; /* Увеличим padding */
  max-width: 900px; /* Ограничим ширину */
  width: 100%; /* Чтобы занимал всю доступную ширину до max-width */
  box-sizing: border-box; /* Учитывать padding в ширине */
}

/* Переопределяем некоторые стили для кнопок/ссылок внутри белого контейнера */
.news-list-container h2,
.news-details-container h2,
.login-container h2 {
  color: #0056b3; /* Цвет заголовков */
}

.news-card h3 {
  color: #007bff;
}

/* Если у вас есть другие ссылки или кнопки внутри белых блоков, возможно,
   потребуется настроить их цвета, чтобы они хорошо смотрелись на белом фоне */
</style>
