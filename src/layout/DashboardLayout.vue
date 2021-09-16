<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar  :background-color="sidebarBackground" short-title="Syswa" title="Syswa">
      <template slot="links">
        <base-button id="processButton" style="margin-left: -50px;" size="sm" v-if="validRoute('procesar')" type="default" icon="ni ni-tag" v-on:click="modals.modal1 = true, openModal()">
        <span style="margin-left:15px;">Procesar</span> 
        </base-button>
        <sidebar-item v-if="validRoute('usuarios')" :link="{name: 'Usuarios', icon: 'ni ni-key-25 text-red', path: '/Usuarios'}"/>
        <sidebar-item v-if="validRoute('ventas')" :link="{name: 'Ventas', icon: 'ni ni-money-coins text-green', path: '/Ventas'}"/>
        <sidebar-item v-if="validRoute('clientes')" :link="{name: 'Clientes', icon: 'ni ni-circle-08 text-default', path: '/Clientes'}"/>
        <sidebar-item v-if="validRoute('inventario')" :link="{name: 'Productos', icon: 'ni ni-shop text-orange', path: '/Productos'}"/>
        <sidebar-item v-if="validRoute('inventario')" :link="{name: 'Inventario', icon: 'ni ni-basket text-green', path: '/Inventario'}"/>
        <sidebar-item v-if="validRoute('bodega')" :link="{name: 'Bodega', icon: 'ni ni-box-2 text-orange', path: '/Bodega'}"/>
        <sidebar-item :link="{name: 'Citas', icon: 'ni ni-calendar-grid-58 text-blue', path: '/Citas'}"/>
        <sidebar-item v-if="validRoute('caja')" :link="{name: 'Caja', icon: 'ni ni-archive-2 text-green', path: '/Caja'}"/>
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
    <a-modal v-model="modals.modal1" class="modal-lg px-0 pb-0 modalProcess" size="lg" :footer="null" :closable="true" >
      <!-- <card type="secondary" shadow
          header-classes="bg-white "
          body-classes="pb-0 pt-0"
          class="border-0"> -->
        <template>
            <procesar></procesar>
        </template>
      <!-- </card> -->
    </a-modal>
  </div>
</template>
<script>
  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';
  import Procesar from "../components/Process"
  import jwtDecode from 'jwt-decode'
  import EventBus from '../components/EventBus'
  
  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition,
      'Procesar': Procesar
    },
    data() {
      return {
        sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        auth: [], 
        modals: {
          modal1: false
        }
      };
    },
    created(){
      this.getToken()
    },
    methods: {
      getToken(){
        const token = localStorage.userToken
        if (token) {
          const decoded = jwtDecode(token)
          this.auth = decoded.access
        }
      },
      openModal(){
        EventBus.$emit('openModal', 'reload')
      },
      changeAccess(status){
        this.auth = status 
      },
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      validRoute(route){
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            return true
          }
        }
      }
    },
    mounted() {
      EventBus.$on('loggedin', status => {
        this.getToken()
      })
      EventBus.$on('loggedin-user', status => {
        this.changeAccess(status)
      })
    }
  };
</script>
<style lang="scss">
@media (min-width: 992px){
  .modal-lg {
      max-width: 600px !important;
  }
}

@media (max-width: 692px){
  .modal-lg {
      max-width: 400px !important;
  }
}
 table  .text-center{
      text-align: left !important;
  }
  .form-control{
      color: #2F2F2F !important;
  }
  form .text-danger{
    font-size: .5em;
  }
  form .text-default{
    font-size: .5em;
  }
  .modalProcess div .ant-modal{
    width: 80% !important;
    top: 10px !important;
  }
  .ant-modal-body{
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
</style>
