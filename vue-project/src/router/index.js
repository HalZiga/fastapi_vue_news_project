import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "../views/LoginComponent.vue";
import NewsList from "../views/NewsList.vue";
import { useAuthStore } from "../stores/auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginComponent,
    },
    {
      path: "/",
      name: "NewsList",
      component: NewsList,
    },
    {
      path: "/news/:id",
      name: "NewsDetails",
      component: () => import("../views/NewsDetails.vue"),
      props: true,
    },
    {
      path: "/create",
      name: "createNews",
      component: () => import("../views/CreateNews.vue"),
      meta: {
        requiresAuth: true,
        requiredRoles: ["admin", "moderator", "author"],
      },
    },
    {
      path: "/news/update/:id",
      name: "UpdateNews",
      component: () => import("../views/UpdateNews.vue"),
      props: true,
    },
    {
      path: "/create-user",
      name: "createUser",
      component: () => import("../views/CreateUsers.vue"),
    },
    {
      path: "/users",
      name: "UserList",
      component: () => import("../views/UserList.vue"),
      meta: { requiresAuth: true, requiredRoles: ["admin", "moderator"] },
    },
    {
      path: "/users/:id",
      name: "UserDetail",
      component: () => import("../views/UserDetail.vue"),
      meta: {
        requiresAuth: true,
        requiredRoles: ["admin", "moderator", "author", "reader"],
      },
    },
    {
      path: "/users/:id/edit",
      name: "UpdateUser",
      component: () => import("../views/UserUpdate.vue"),
      meta: {
        requiresAuth: true,
        requiredRoles: ["admin", "moderator", "author", "reader"],
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login"); // Если маршрут требует авторизации и пользователь не авторизован, перенаправляем на страницу логина
  } else {
    next();
  }
});

export default router;
