// renderer/src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';

// 引入你的组件
import Home from '../views/Home.vue';


const routes = [
  {
    path: '/',
    component: Home
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
