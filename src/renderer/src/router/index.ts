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
      },
      {
        path: '/edit',
        name: 'edit',
        component: () => import('../views/FileEditingPage.vue'),
        props: route => ({ query: route.query.name, query1: route.query.startId })
      },
    ]
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
