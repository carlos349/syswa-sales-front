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
                        <p class="mb-0 display-2 text-white">Caja</p>
                        <p class="text-white">Sección dedicada a la administración de sus empleados. Donde podrá obtener detalle de sus ventas y comisiones correspondientes.</p>
                    </div>
                    <template v-if="cashFunds.inspector">
                        <base-button class="float-right mt-7 mr-2" size="sm" :disabled="validRoute('caja', 'fondo') ? false : true"  v-on:click="modals.modal2 = true" type="success">
                            <i class="fa fa-archive mr-2" style="vertical-align:1px;font-size:1.2em;"></i>
                            Fondo
                        </base-button>
                    </template>
                    <template v-else>
                        <base-button class="float-right mt-7 mr-2" size="sm" :disabled="validRoute('caja', 'cerrar') ? false : true" v-on:click="daySalesClose" type="success">
                            <i class="fa fa-archive mr-2" style="vertical-align:1px;font-size:1.2em;"></i>
                            Cierre
                        </base-button>
                    </template>
                </div>
            </div>
        </base-header>
        <a-config-provider>
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2 v-if="!validRoute('caja', 'visualizar')">No tiene los permisos para visualizar cierres.</h2>
                    <h2 v-else>Sucursal sin cierres registrados.</h2>
                </div>
            </template>
            <a-table :columns="columns" :loading="progress" :data-source="closing" :scroll="getScreen">
                <template slot="manual-total" slot-scope="record, column">
                    {{formatPrice(totalFind(column.manual))}}
                </template>
                <template slot="system-total" slot-scope="record, column">
                    {{formatPrice(totalFind(column.system))}}
                </template>
                <template slot="diff-total" slot-scope="record, column">
                    {{formatPrice(totalFind(column.system) - totalFind(column.manual))}}
                </template>
                <template slot="format-date" slot-scope="record, column">
                    {{formatDate(column.createdAt)}}
                </template>
                <template slot="Admin" slot-scope="record, column">
                    <a-tooltip placement="top">
                        <template slot="title">
                        <span>Reporte</span>
                        </template>
                        <base-button v-if="validRoute('caja', 'reporte')" size="sm" type="default" icon="fas fa-clipboard" v-on:click="dataReport(column._id)"></base-button> 
                        <base-button v-else size="sm" type="default" icon="fas fa-clipboard" disabled></base-button> 
                    </a-tooltip>
                </template>
            </a-table>
        </a-config-provider>
        <modal :show.sync="modals.modal1"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
        <modal :show.sync="modals.modal2"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        <h3>Registrar monto de apertura</h3>
                    </div>
                </template>
                <template>
                    <form role="form">
                        <base-input 
                            alternative
                            class="mb-3"
                            placeholder="Nombre el cajero"
                            v-on:keyup="validRegister(3)"
                            v-model="cashFunds.cashName"
                            addon-left-icon="ni ni-circle-08">
                        </base-input>
                        <currency-input
                            v-model="cashFunds.cashAmount"
                            v-on:keyup="validRegister(3)"
                            locale="de"
                            addon-left-icon="ni ni-money-coins"
                            class="form-control mb-3"
                            style="margin-top:-10px;"
                        />	
                        <base-button v-if="!cashFunds.valid" type="default" disabled>
                            Ingresar fondo
                        </base-button>
                        <base-button v-else type="default" v-on:click="registerFund">
                            Ingresar fondo
                        </base-button> 
                    </form>
            </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal3"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        <h3>Monto de egreso de la caja</h3>
                    </div>
                </template>
                <template>
                    <form role="form">
                        <currency-input
                            v-model="egressManual"
                            locale="de"
                            addon-left-icon="ni ni-money-coins"
                            class="form-control mb-3"
                            style="margin-top:-10px;"
                            v-on:keyup="validRegister(1)"
                        />	
                        <base-input 
                            alternative
                            class="mb-3"
                            placeholder="Nombre el cajero"
                            v-on:keyup="validRegister(1)"
                            v-model="closeIdentification"
                            addon-left-icon="ni ni-circle-08">
                        </base-input>
                        <base-button v-if="!validEgress" type="default" v-on:click="modals.modal4 = true" disabled>Continuar</base-button>
                        <base-button v-else type="default" v-on:click="modals.modal4 = true">Continuar</base-button>
                    </form>
            </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal4"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        <h3>Ingrese los montos de las ventas del dia</h3>
                    </div>
                </template>
                <template>
                    <form role="form" class="row">
                        <div class="col-6">
                            <label class="form-group">Fondo de caja</label>
                            <currency-input
                                v-model="getFund"
                                locale="de"
                                addon-left-icon="ni ni-money-coins"
                                class="form-control mb-3"
                                style="margin-top:-10px;"
                                readonly
                            />	
                        </div>
                        <div class="col-6">
                            <label class="form-group">Efectivo</label>
                            <currency-input
                                v-model="cash"
                                locale="de"
                                addon-left-icon="ni ni-money-coins"
                                class="form-control mb-3"
                                style="margin-top:-10px;"
                            />	
                        </div>
                        <template v-for="type in typesPayManual">
                            <div class="col-6" :key="type.type" v-if="type.type != 'Efectivo'">
                                <label class="form-group">{{type.type}}</label>
                                <currency-input
                                    v-model="type.total"
                                    locale="de"
                                    addon-left-icon="ni ni-money-coins"
                                    class="form-control mb-3"
                                    style="margin-top:-10px;"
                                />
                            </div>
                        </template>
                    </form>
                    <base-button type="default" class="float-right" v-on:click="closeFinally">Finalizar cierre</base-button>
            </template>
            </card>
        </modal>
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode'
import io from 'socket.io-client';
// COMPONENTS
import EventBus from '../components/EventBus'
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
            socket: io(endPoint.endpointTarget),
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            cash: 0,
            modals: {
                modal1: false,
                modal2: false,
                modal3: false, 
                modal4: false,
                message: "",
                icon: '',
                type:''
            },
            columns: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'format-date' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                    ellipsis: true,
                },
                {
                    title: 'Encargado del cierre',
                    dataIndex: 'closerName',
                    key: 'closerName',
                    ellipsis: true,
                },
                {
                    title: 'Total manual',
                    dataIndex: 'manual',
                    key: 'manual',
                    scopedSlots: { customRender: 'manual-total' },
                    sorter: (a, b) => this.totalFind(a.manual) - this.totalFind(b.manual),
                    ellipsis: true,
                },
                {
                    title: 'Total sistema',
                    dataIndex: 'system',
                    key: 'system',
                    scopedSlots: { customRender: 'system-total' },
                    sorter: (a, b) => this.totalFind(a.system) - this.totalFind(b.system),
                    ellipsis: true,
                },
                {
                    title: 'Diferencia',
                    dataIndex: 'branch',
                    key: 'branch',
                    scopedSlots: { customRender: 'diff-total' },
                    sorter: (a, b) => (this.totalFind(a.system) - this.totalFind(a.manual)) - (this.totalFind(b.system) - this.totalFind(b.manual)),
                    ellipsis: true,
                },
                {
                    title: 'Reportes',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'Admin' },
                    ellipsis: true,
                },
            ],
            config: {
                card_title: "Tabla de cierres",
                checkbox_rows: false,
                rows_selectable : true,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                rows_selectable: true,
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                global_search: {
                    placeholder: "Enter custom Search text",
                    visibility: false,
                    case_sensitive: false
                },
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: true,
                preservePageOnDataChange : true,
                pagination_info : true
            },
            classes: {
                table: "table-bordered table-striped"
            },
            closing: [],
            fund: 0,
            checker: '',
            cashFunds: {
                inspector: false,
                cashName: '',
                cashAmount: 0,
                valid: false 
            },
            getFund: 0,
            egressSystem: 0,
            cashSystem: 0,
            debitSystem: 0,
            creditSystem: 0,
            transferSystem: 0,
            otherSystem: 0,
            totalSystem: 0,
            egressManual: 0,
            fundManual: 0,
            cashManual: 0,
            debitManual: 0,
            creditManual: 0,
            transferManual: 0,
            othersManual: 0,
            closeIdentification: '',
            validFinally:false,
            validEgress:false,
            branch: '',
            branchName: '',
            typesPaySystem: [],
            typesPayManual: []
        }
    },
    created(){
        this.getToken()
        this.getClosing()
        this.getFunds()
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            if (token.length > 0) {
                const decoded = jwtDecode(token)  
                this.auth = decoded.access
            }
        },
        async getClosing(){
            try {
                const closing = await axios.get(endPoint.endpointTarget+'/sales/Closing', this.configHeader)
                console.log(closing)
                if (closing.data.status == 'ok') {
                    if (this.validRoute('caja', 'visualizar')) {
                        this.closing = closing.data.data
                    }
                }
            }catch(err){
                this.$swal({
                    icon: 'error',
                    title: 'Acceso invalido, ingrese de nuevo, si el problema persiste comuniquese con el proveedor del servicio',
                    showConfirmButton: false,
                    timer: 2500
                })
                router.push({name: 'login'})
            }
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return moment(dateFormat).format('DD-MM-YYYY');
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        validRegister(valid){
            if (valid == 3) {
                this.cashFunds.valid = this.cashFunds.cashName != '' ? true : false
            }else{
                this.validEgress = this.closeIdentification != '' ? true : false
            }
            
        },
        totalFind(array){
            const total = array.find(element => element.type == 'Total')
            return total.total
        },
        registerFund(){
			axios.post(endPoint.endpointTarget+'/sales/registerFund', {
				userRegister: this.cashFunds.cashName,
				amount: this.cashFunds.cashAmount
			}, this.configHeader)
            .then(res => {
				if (res.data.status == 'ok') {
                    this.modals.modal2 = false,
					this.$swal({
                        icon: 'success',
                        title: 'Ya puede ingresar ventas',
                        showConfirmButton: false,
                        timer: 1500
                    })
                            
                    this.cashFunds.cashName = ''
                    this.cashFunds.cashAmount = ''
                    this.getFunds()
                    this.cashFunds.inspector = false
                    axios.post(endPoint.endpointTarget+'/notifications', {
                        userName:localStorage.getItem('nombre') + " " + localStorage.getItem('apellido'),
                        userImage:localStorage.getItem('imageUser'),
                        detail:'Registro un fondo de caja',
                        link: 'Caja'
                    })
                    .then(res => {
                        this.socket.emit('sendNotification', res.data)
                    }) 
				}
			})
        },
        dataReport(id){
            localStorage.setItem('reportID', id)
            router.push({path: '/reporteCierre'})
        },
        async getFunds(){
            try {
                const funds = await axios.get(endPoint.endpointTarget+'/sales/getFund', this.configHeader)
                if (funds.data.status == 'ok') {
                    this.fund = funds.data.data.amount
                    this.checker = funds.data.data.userRegister
                    this.getFund = funds.data.data.amount
                    this.egressSystem = funds.data.data.amount
                    if (this.checker == '') {
                        this.cashFunds.inspector = true
                        this.fund = 0
                        this.checker = 'No hay cajero registrado'
                    }
                }else{
                    this.cashFunds.inspector = true
                    this.fund = 0
                    this.checker = 'No hay cajero registrado'
                }
            }catch(err){
                this.$swal({
                    icon: 'error',
                    title: 'Acceso invalido, ingrese de nuevo, si el problema persiste comuniquese con el proveedor del servicio',
                    showConfirmButton: false,
                    timer: 2500
                })
                router.push({name: 'login'})
            }
        },
        daySalesClose(){
            axios.get(endPoint.endpointTarget+'/sales/getClosingDay', this.configHeader)
            .then(res => {
                if (res.data.status == 'bad') {
                    this.$swal({
                        icon: 'error',
                        title: 'No puede hacer cierre sin ventas.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.typesPaySystem = res.data.data.totals
                    this.typesPayManual = res.data.data.types
                    this.modals.modal3 = true
                }
            })
        },
        closeFinally(){
            const findEmptyTotal = this.typesPayManual.find(element => element.total == null)
            if (findEmptyTotal == undefined) {
                var total = 0
                this.typesPayManual.forEach(element => {
                    total = total + element.total
                });
                total = total + this.cash
                this.typesPayManual.push({
                    type: 'Total',
                    total: total
                })
                axios.post(endPoint.endpointTarget+'/sales/closeDay/'+this.closeIdentification, {
                    system: this.typesPaySystem,
                    manual: this.typesPayManual,
                    entryFund: this.getFund,
                    cash: this.cash,
                    egressManual: this.egressManual
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.modals.modal4 = false
                        this.$swal({
                            icon: 'success',
                            title: 'Cierre hecho con exito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.getClosing()
                        this.cashFunds.inspector = true
                        axios.post(endPoint.endpointTarget+'/notifications', {
                            userName:localStorage.getItem('nombre') + " " + localStorage.getItem('apellido'),
                            userImage:localStorage.getItem('imageUser'),
                            detail:'Hizo un cierre de caja',
                            link: 'Caja'
                        })
                        .then(res => {
                            this.socket.emit('sendNotification', res.data.data)
                        })
                    }else{
                        this.$swal({
                            icon: 'error',
                            title: 'Problemas al hacer cierre.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'No puede dejar campos en blanco',
                    showConfirmButton: false,
                    timer: 1500
                })
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
        }
    },
    mounted (){
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 'auto' }
        }
    }
}
</script>
<style>
    
</style>