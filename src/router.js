import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import reportPdf from '@/views/reportPdf'
Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/pdfReport',
      redirect: 'reportPdf',
      component: reportPdf,
      children: [
        {
          path: '/reportPdf',
          name: '',
          component: () => import('./views/reportPdf.vue')
        }
      ] 
    },
    {
      path: '/dashboard',
      redirect: 'dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '/profile',
          name: '',
          component: () => import('./views/UserProfile.vue')
        },
        {
          path: '/reporteCierre',
          name: '',
          component: () => import('./views/reportClosure.vue')
        },
        {
          path: '/Inventario',
          name: '',
          component: () => import('./views/Store.vue')
        },
        {
          path: '/Usuarios',
          name: '',
          component: () => import('./views/Users.vue')
        },
        {
          path: '/Ventas',
          name: '',
          component: () => import('./views/Sales.vue')
        },
        {
          path: '/Clientes',
          name: '',
          component: () => import('./views/Clients.vue')
        },
        {
          path: '/Productos',
          name: '',
          component: () => import('./views/Products.vue')
        },
        {
          path: '/Caja',
          name: '',
          component: () => import('./views/Box.vue')
        },
        {
          path: '/reporteEmpleado',
          name: '',
          component: () => import('./views/reportEmploye.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
        }
      ]
    }
  ]
})
