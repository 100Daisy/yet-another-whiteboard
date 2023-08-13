import { createRouter, createWebHistory } from 'vue-router'
import { userSessionStore } from '@/stores/userSessions';
import { supabase } from '@/services/supabase';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
      meta: {
        needsAuth: false
      }
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingsView.vue'),
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/help',
      name: 'help',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HelpView.vue'),
      meta: {
        needsAuth: false
      }
    },
    {
      path: '/whiteboards/:id',
      name: 'whiteboards',
      component: () => import('../views/WhiteboardView.vue'),
      meta: {
        needsAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userSession = userSessionStore()

  if (to.meta.needsAuth) {
    if (userSession.session) {
      return next()
    } else {
      return next('/login')
    }
  }

  // // Do not show login page if user is already logged in
  if (userSession.session && to.name === 'login' && from.name !== 'whiteboards') {
    return next('/')
  }
  return next()
})

supabase.auth.onAuthStateChange((event, session) => {
  const userSession = userSessionStore()
  console.log('event', event)
  userSession.session = session
  if (!userSession.session) {
    router.push('/login')
  }
})
export default router
