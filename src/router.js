import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import reportPdf from '@/views/reportPdf'
import historyPdf from '@/views/historyPdf'
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
      path: '/pdfReportHistory',
      redirect: 'historyPdf',
      component: historyPdf,
      children: [
        {
          path: '/historyPdf',
          name: '',
          component: () => import('./views/historyPdf.vue')
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
          path: '/Bodega',
          name: '',
          component: () => import('./views/Store.vue')
        },
        {
          path: '/Citas',
          name: '',
          component: () => import('./views/Dates.vue')
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
          path: '/Inventario',
          name: '',
          component: () => import('./views/Inventory.vue')
        },
        {
          path: '/Sucursales',
          name: '',
          component: () => import('./views/Branch.vue')
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
