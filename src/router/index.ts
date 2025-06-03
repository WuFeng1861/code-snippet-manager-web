import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// 路由定义
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'snippets',
        name: 'Snippets',
        component: () => import('../views/Snippets.vue'),
      },
      {
        path: 'snippets/create',
        name: 'CreateSnippet',
        component: () => import('../views/CreateSnippet.vue'),
      },
      {
        path: 'snippets/:id',
        name: 'SnippetDetail',
        component: () => import('../views/SnippetDetail.vue'),
      },
      {
        path: 'snippets/:id/edit',
        name: 'EditSnippet',
        component: () => import('../views/EditSnippet.vue'),
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('../views/Tags.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory('/codesnippet/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 需要身份验证的路由
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  
  // // 仅限游客的路由
  // if (to.meta.guestOnly && authStore.isAuthenticated) {
  //   return next({ name: 'Home' })
  // }
  
  next()
})

export default router
