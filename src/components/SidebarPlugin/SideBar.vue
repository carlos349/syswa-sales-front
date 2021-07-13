<template>
    <nav style="padding:2%" class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">

            <!--Toggler-->
            <navbar-toggle-button @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            
            <img v-if="screen < 768" style="width:13%" :src="logo" alt="...">
            <img v-else style="width: 155%;margin-left: -52px;margin-top: -48px;margin-bottom: -20%;" :src="logoB" alt="...">
            
            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <!-- <base-dropdown class="nav-item" position="right">
                        <a slot="title" class="nav-link nav-link-icon" href="#" role="button" data-toggle="dropdown"
                           aria-haspopup="true" aria-expanded="false">
                            <i class="ni ni-bell-55"></i>
                        </a>

                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </base-dropdown> -->
                    <base-dropdown class="nav-item" position="right">
                        <a slot="title" class="nav-link" href="#" role="button">
                            <div class="media align-items-center">
                              <span class="avatar avatar-sm rounded-circle">
                                <img alt="Image placeholders" style="width:30px;height:30px;"  v-if="haveImage == ''" src="img/theme/profile-default.png">
                                <img alt="Image placeholdesr" style="width:30px;height:30px;"  v-else :src="imgUser">
                                
                              </span>
                            </div>
                        </a>

                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Bienvenido!</h6>
                        </div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>Mi perfil</span>
                        </router-link>
                        <!-- <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-settings-gear-65"></i>
                            <span>Ajustes</span>
                        </router-link>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-calendar-grid-58"></i>
                            <span>Actividad</span>
                        </router-link>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-support-16"></i>
                            <span>Soporte</span>
                        </router-link> -->
                        <div class="dropdown-divider"></div>
                        <router-link to="/login" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Cerrar sesión</span>
                        </router-link>
                    </base-dropdown>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show pt-0" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links">
                    </slot>
                </ul>
            </div>
            </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '@/components/NavbarToggleButton'
  import endPoint from '.../../../config-endpoint/endpoint.js'
  
  export default {
    name: 'sidebar',
    components: {
      NavbarToggleButton
    },
    data() {
      return {
        haveImage: localStorage.imageUser,
        imgUser: endPoint.imgEndpoint + localStorage.imageUser,
        screen: screen.width
      }
    },
    props: {
      logo: {
        type: String,
        default: 'img/brand/syswa-isotipo.png',
        description: 'Sidebar app logo'
      },
      logoB: {
        type: String,
        default: 'img/brand/syswa-gestion.png',
        description: 'Sidebar app logo'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      }
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>
