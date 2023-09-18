// renderer/src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// 引入你的组件
import Home from '../views/Home.vue';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard.vue')
      }
    ]
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
