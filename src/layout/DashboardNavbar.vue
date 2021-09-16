<template>
    <base-nav class="navbar-top sticky-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <!-- <form class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <div class="form-group mb-0">
                <base-input placeholder="Search"
                            class="input-group-alternative"
                            alternative=""
                            addon-right-icon="fas fa-search">
                </base-input>
            </div>
        </form> -->
        
        <ul class="navbar-nav align-items-center  ml-md-auto ">
          <li class="nav-item">
            <a-dropdown :disabled="validRoute('sucursales', 'cambiar') ? false : true">
              <a-menu slot="overlay" @click="selectBranch">
                <template v-for="branch of branches">
                  <a-menu-item class="font-weight-bold" :key="branch._id+'/'+branch.name" v-if="branch.active"> 
                    <a-icon type="shop" style="vertical-align:1px;" />{{branch.name}} 
                  </a-menu-item>
                </template>
              </a-menu>
              <a-button class="mb-2 bg-default text-white font-weight-bold w-100" style="border:none;" > {{branchName}} <a-icon type="down" style="vertical-align:1px;" /> </a-button>
            </a-dropdown>
          </li>
          <li class="nav-item dropdown">
              <a v-on:click="validateNotifications()" class="nav-link" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="ni ni-bell-55" :class="pxSep" style="font-size:18px;z-index:1;"></i>
                <badge v-if="activeNotifications > 0" class="notifyNumber text-white" type="primary" style="font-size:14px;z-index:0;">{{activeNotifications}}</badge>
              </a>
            <div style="z-index:10000" class="dropdown-menu dDeste  dropdown-menu-xl  dropdown-menu-right  py-0 overflow-hidden">
              
              <!-- List group -->
              <vue-custom-scrollbar class="w-100" style="height:50vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
              <div class="list-group list-group-flush" style="z-index:10000">
                
                <a v-for="notification in notifications" :key="notification._id" href="#!" class="list-group-item list-group-item-action">
                  <router-link :to="notification.link">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <!-- Avatar -->
                        <img alt="Image placeholder" v-if="notification.userImage == '' || notification.userImage == null" src="img/theme/profile-default.png" class="avatar rounded-circle">
                        <!-- <img alt="Image placeholder" v-else :src="imgEndpoint+notification.userImage" class="avatar rounded-circle"> -->
                      </div>
                      <div class="col ml--2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h4 class="mb-0 text-sm">{{notification.userName}}</h4>
                          </div>
                          <div class="text-right text-muted">
                            <small>{{momentTime(notification.date)}}</small>
                          </div>
                        </div>
                        <p class="text-sm mb-0">{{formatDetail(notification.detail)}} <br> {{notification.detail.split('~')[1]}}</p>
                      </div>
                    </div>
                  </router-link>
                </a>
                
                <a-empty v-if="notifications.length == 0" :image="simpleImage">
                  <span slot="description"> No posees notificaciones nuevas </span>
                  
                </a-empty>
              </div>
              </vue-custom-scrollbar>
              <!-- View all -->
              <span v-on:click="getAll" v-if="all" style="cursor:pointer" class="dropdown-item-text text-center text-primary font-weight-bold py-3">Ver todas</span>
              
            </div>
          </li>
          <!-- <li class="nav-item dropdown">
            <a class="nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="ni ni-ungroup"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default  dropdown-menu-right ">
              <div class="row shortcuts px-4">
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                    <i class="ni ni-calendar-grid-58"></i>
                  </span>
                  <small>Calendar</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-orange">
                    <i class="ni ni-email-83"></i>
                  </span>
                  <small>Email</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                    <i class="ni ni-credit-card"></i>
                  </span>
                  <small>Payments</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-green">
                    <i class="ni ni-books"></i>
                  </span>
                  <small>Reports</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-purple">
                    <i class="ni ni-pin-3"></i>
                  </span>
                  <small>Maps</small>
                </a>
                <a href="#!" class="col-4 shortcut-item">
                  <span class="shortcut-media avatar rounded-circle bg-gradient-yellow">
                    <i class="ni ni-basket"></i>
                  </span>
                  <small>Shop</small>
                </a>
              </div>
            </div>
          </li> -->
        </ul>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholders" style="width:30px;height:30px;" src="img/theme/profile-default.png">
                </span>
                        <div style="cursor:pointer" class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">{{nombre}}</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">¡Bienvenido!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>Mi perfil</span>
                        </router-link>
                        <router-link to="/Sucursales" class="dropdown-item">
                            <i class="ni ni-shop"></i>
                            <span>Sucursales</span>
                        </router-link>
                        <!-- <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-support-16"></i>
                            <span>Soporte</span>
                        </router-link> -->
                        <div class="dropdown-divider"></div>
                        <router-link to="/login" class="dropdown-item">|
                            <i class="ni ni-user-run"></i>
                            <span>Cerrar sesión</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
  //Back - End 
  import axios from 'axios'
  import endPoint from '../../config-endpoint/endpoint.js'
  import EventBus from '../components/EventBus'
  import io from 'socket.io-client';
  import * as moment from 'moment';
  import jwtDecode from 'jwt-decode'
  import 'moment/locale/es';
  import { Empty } from 'ant-design-vue';
  import vueCustomScrollbar from 'vue-custom-scrollbar'
  moment.locale('es');
  export default {
    components: {
        vueCustomScrollbar
    },
    data() {
      return {
        socket : io(endPoint.endpointTarget),
        activeNotifications: 0,
        showMenu: false,
        searchQuery: '',
        nombre: localStorage.firstname + ' ' + localStorage.lastname,
        idUser: localStorage._id,
        imgEndpoint: endPoint.imgEndpoint,
        secondDetail:'',
        notifications: [],
        count:0,
        all: true,
        pxSep: '',
        auth: [],
        branches: [],
        branchName: localStorage.branchName,
        branch: localStorage.branch,
      };
    },
    beforeCreate() {
      this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
    },
    created() {
      // this.getNotifications()
      this.getBranches()
    },
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      getToken(){
        const token = localStorage.userToken
        if (token) {
          const decoded = jwtDecode(token)
          this.auth = decoded.access
          this.branch = decoded.branch
          console.log(this.branch)
          for (const branch of this.branches) {
            if (branch._id == this.branch) {
              this.branchName = branch.name
              localStorage.setItem('branch', this.branch)
              localStorage.setItem('branchName', this.branchName)
              break
            }
          }
        }
      },
      validRoute(route, type){
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            for (let i = 0; i < element.validaciones.length; i++) {
              if (type == element.validaciones[i]) { 
                  return true
              } 
            }
          }
        }
      },
      validRoutee(route){
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            return true
          }
        }
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
        
      },
      formatDetail(detail,notification){
        if (detail.includes('~')) {
          return detail.split('~')[0]
        }
        else{
          return detail
        }
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
        console.log('cerro')
      },
      selectBranch(value){
        if (value.key.split('/')[0] != this.branch) {
          localStorage.setItem('branch', value.key.split('/')[0])
          localStorage.setItem('branchName', value.key.split('/')[1])
          this.branch = value.key.split('/')[0]
          this.branchName = value.key.split('/')[1]
          console.log(this.branch)
          console.log(this.branchName)
          EventBus.$emit('changeBranch', true)
        }
      },
      getNotifications(){
        axios.get(endPoint.endpointTarget+'/notifications/noViews/'+this.idUser) 
        .then(res => {
          this.notifications = res.data
          this.activeNotifications = res.data.length
          if (this.activeNotifications < 10) {
            this.pxSep = "pxSix"
          }else if (this.activeNotifications < 100) {
            this.pxSep = "pxSixPlus"
          }else if (this.activeNotifications < 999) {
            this.pxSep = "pxSixPlusTwo"
          }
          this.all = true
        })
      },
      validateNotifications(){
        axios.get(endPoint.endpointTarget+'/notifications/validateViews/'+this.idUser) 
        .then(res => {
          this.notifications = res.data
          this.activeNotifications = 0
          this.all = true
        })
      },
      async getBranches() {
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        try {
          const getBranches = await axios.get(endPoint.endpointTarget+'/branches', configHeader)
          if (getBranches.data.status == 'ok') {
            this.branches = getBranches.data.data
            console.log('aja')
            this.getToken()
          }
        }catch(err){console.log(err)}
      },
      momentTime(value) {
        const dateNoti = new Date(value)
        return moment(dateNoti, "YYYYMMDD").fromNow();
      },
      getAll() {
        setTimeout(() => {
          $(".dDeste").dropdown('toggle')
        }, 100);
        axios.get(endPoint.endpointTarget+'/notifications/getAll') 
        .then(res => {
          this.notifications = res.data
          this.all = false
        })
      }

    },
    mounted() {
      EventBus.$on('loggedin', status => {
        this.getBranches()
      })
      EventBus.$on('dataChange', status => {
        console.log(status)
        this.nombre = status.nombre + ' ' + status.apellido
        if (status.image != "") {
          this.imgUser = status.image
        }
        console.log(this.imgUser)
      })
      EventBus.$on('newBranch', status => {
        this.getBranches()
      })
      this.socket.on('notify', (data) => {
        this.notifications.push(data)
        this.activeNotifications++
        
      });
    }
  };
</script>
<style lang="scss">
  .pxSix{margin-right: 6px}
  .pxSixPlus{margin-right: 10px}
  .pxSixPlusTwo{margin-right: 16px}
</style>