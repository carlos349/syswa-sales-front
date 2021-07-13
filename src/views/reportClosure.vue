<template>
    <div>
       <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
                     style="min-height: 50px; background-image: url(img/theme/users.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Reporte del cierre ({{closes.createdAt | formatDate}})</p>
                    </div>
                    <!-- <base-button class="float-right mt-7 mr-0" size="sm" :disabled="validRoute('usuarios', 'registrar') ? false : true" @click="redirect" type="primary">
                        <a-icon type="user" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Perfiles
                    </base-button> -->
                    <base-button class="float-right mt-7 mr-2" size="sm" :disabled="validRoute('caja', 'editar') ? false : true" @click="modals.modal1 = true" type="default">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.8em;" />
                        Editar montos manuales
                    </base-button>    
                    <base-button v-on:click="back" class="float-right mt-7 mr-2" size="sm" type="warning">
                        <a-icon type="rollback" style="vertical-align:1px;font-size:1.8em;" />
                    </base-button>  
                </div>
            </div>
        </base-header> 
        <div class="col-12 mt-3 mx-auto">
            <div class="row mx-auto text-center">
                <div class="col-4 mx-auto">
                    <dt class="" type="success">Ingresos manuales</dt>
                    <base-button v-for="close in closes.manual" :key="close.type" class="col-12 mt-1" type="secondary">
                        <span class="float-left">{{close.type}}</span>
                        <badge style="font-size:1em !important" class="float-right text-default" type="success">{{close.total | formatPrice}}</badge>
                    </base-button>
                </div>
                <div class="col-4 mx-auto">
                    <dt class="" type="default">Ingresos sistema</dt>
                    <base-button v-for="closed in closes.system" :key="closed.type" class="col-12 mt-1" type="secondary">
                        <span class="float-left">{{closed.type}}</span>
                        <badge style="font-size:1em !important" class="float-right text-default" type="success">{{closed.total | formatPrice}}</badge>
                    </base-button>
                </div>
                <div class="col-2 mx-auto">
                    <dt class="" type="warning">Diferencia</dt>
                    <base-button v-for="(close, index) in closes.system" :key="close.type" class="col-12 mt-1" type="secondary">
                        <badge style="font-size:1em !important" class="text-default" type="success">{{parseInt(close.total) - parseInt(closes.manual[index].total) | formatPrice}}</badge>
                    </base-button>
                </div>
            </div>
        </div>
        <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes=""
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-center text-muted mb-2">
                        <small>Ingresos manuales</small>
                    </div>
                    <template v-for="close of closes.manual">
                        <div :key="close.type" v-if="close.type != 'Total'" class="text-left text-muted">
                            <small>{{close.type}}</small>
                        </div>
                        <currency-input
                            v-if="close.type != 'Total'"
                            :key="close.type"
                            v-model="close.total"
                            locale="de"
                            class="form-control"
                            v-on:keyup="cashTotal()"
                        />
                    </template>
                    <div class="text-center">
                        <base-button type="default" v-on:click="editEntry" class="my-2">Editar</base-button>
                    </div>
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal2"
               gradient="success"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i class="ni ni-check-bold ni-3x"></i>
                <h4 class="heading mt-4">¡Actualizado!</h4>
            </div>
        </modal>
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode'
// COMPONENTS
import VueBootstrap4Table from 'vue-bootstrap4-table'
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        VueBootstrap4Table 
    },
    data(){
        return {
            auth:[],
            id: localStorage.getItem('reportID'),
            modals: {
                modal1:false,
                modal2:false
            },
            closes: {},
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
        }
    },
    created(){
        this.getClosing()
        this.getToken()
        $(document).ready(function(){
            setTimeout(() => {
               $("input[placeholder='Go to page']").hide(); 
            }, 200);
            
        });
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
        },
        back(){
            window.history.go(-1);
        },
        async getClosing(){
            try {
                const closing = await axios.get(endPoint.endpointTarget+'/sales/getClosing/'+this.id, this.configHeader)
                this.closes = closing.data.data
                console.log(closing)
            }catch(err){
                console.log(err)
            }
        },
        cashTotal(){
            var total = 0
            for (let i = 0; i <= 2; i++) {
                const element = this.closes.manual[i];
                if (i == 0 || i == 1) {
                    total = total + element.total
                }else if (i == 2) {
                    total = total - element.total
                }
            }
            this.closes.manual[3].total = total
        },
        editEntry(){
            var total = 0
            var dict = {
                'Egreso de caja': 'si',
                'Fondo de caja': 'si',
                'Total efectivo': 'si'
            }
            for (let i = 0; i < this.closes.manual.length - 1; i++) {
                const element = this.closes.manual[i];
                if (element.type in dict) {
                    total = total
                }else{
                    total = total + element.total
                }
            }
            this.closes.manual[this.closes.manual.length - 1].total = total
            axios.put(endPoint.endpointTarget+'/sales/editclosedmanualamounts/'+this.id, {
                manual: this.closes.manual
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.modals.modal1 = false
                    this.$swal({
                        icon: 'success',
                        title: 'Totales editados.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        validRoute(route, type){
            for (let index = 0; index < this.auth.length; index++) {
                const element = this.auth[index];
                if (element.ruta == route) {
                    for (let i = 0; i < element.validaciones.length; i++) {
                        if (type == element.validaciones[i]) { 
                            console.log(true)
                            return true
                        } 
                    }
                }
            }
        }
    }
}
</script>