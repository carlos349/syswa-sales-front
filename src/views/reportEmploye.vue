<template>
    <div>
        <base-header class="header pb-5 pt-5 pt-lg-8 d-flex align-items-center"
                        style="min-height: 50px; background-image: url(img/theme/reportes.jpg); background-size: cover; background-position: center;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-12">
                        <h1 class="display-2 hidden text-white">Reporte de {{nameLender}}</h1>
                        
                        <base-button v-if="validRoute('empleados', 'detalle')" type="success" v-on:click="modals.modal2 = true">Datos avanzados</base-button>
                        <base-button v-else disabled type="success">Datos avanzados</base-button>
                        <base-button v-if="validRoute('empleados', 'cerrar ventas')" type="danger" v-on:click="printReport">Cerrar ventas</base-button>
                        <base-button v-else disabled type="danger">Cerrar ventas</base-button>
                        <base-button v-on:click="back" class="btn btn-primary text-white cursor-pointer">Regresar</base-button>
                    </div>
                </div>
            </div>
        </base-header>
        <center>
            <h1  class="display-2 pb-3 mb-3 hide text-center text-white">Reporte de cierre</h1> 
        </center>
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
                  body-classes="px-lg-5 "
                  class="border-0">
                <template>
                    <div style="margin-top:-10% !important" class="text-muted text-center mb-3">
                        Datos del mes
                    </div>
                </template>
                <template>
                    <tabs fill class="flex-column flex-md-row">
                        <card shadow>
                            <tab-pane>
                                <span slot="title">
                                    <i class="ni ni-cloud-upload-96"></i>
                                    Datos
                                </span>
                                <div class="description">
                                    <base-button type="secondary" class="w-100 mb-1 mt-3">
                                        <span class="float-left">Fecha</span>
                                        <badge style="font-size:.9em" class="float-right text-default" type="success">{{fecha}}</badge>
                                    </base-button>
                                    <base-button type="secondary" class="w-100 mb-1">
                                        <span class="float-left">Nombre</span>
                                        <badge style="font-size:.9em" class="float-right text-default" type="success">{{nameLender}}</badge>
                                    </base-button>
                                    <base-button type="secondary" class="w-100 mb-1">
                                        <span  class="float-left">Adelantos</span>
                                        <badge  style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(advancement)}}</badge>
                                    </base-button>
                                    <base-button type="secondary" class="w-100 mb-1">
                                        <span  class="float-left">Bonos</span>
                                        <badge  style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(lenderBonus)}}</badge>
                                    </base-button>
                                    <base-button type="secondary" class="w-100 mb-1">
                                        <span class="float-left">Comisión total</span>
                                        <badge style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(totalComission)}}</badge>
                                    </base-button>
                                    <base-button type="secondary" class="w-100 mb-1">
                                        <span class="float-left">Total</span>
                                        <badge style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(totalComission + lenderBonus - advancement)}}</badge>
                                    </base-button>
                                </div>
                            </tab-pane>
                            <tab-pane title="Profile" v-if="validRoute('empleados', 'cerrar ventas')">
                                <span slot="title" >
                                    <i class="ni ni-bell-55 mr-2"></i>
                                    Adelantos o bonos
                                </span>
                                <form role="form">
                                    <base-checkbox class="mb-3 mt-3" v-model="bonus">
                                        ¿Esta registrando un bono?
                                    </base-checkbox>
                                    <base-input alternative
                                        class="mb-3"
                                        placeholder="Razón"
                                        v-on:keyup="validRegister()"
                                        addon-left-icon="ni ni-single-copy-04"
                                        v-model="dataExpense.reason">
                                    </base-input>
                                    <currency-input
                                        v-model="dataExpense.amount"
                                        locale="de"
                                        v-on:keyup="validRegister()"
                                        addon-left-icon="ni ni-time-alarm"
                                        class="form-control mb-3"
                                        style="margin-top:-10px;"
                                    />	
                                    <base-input addon-left-icon="ni ni-calendar-grid-58">
                                        <flat-picker 
                                                slot-scope="{focus, blur}"
                                                @on-open="focus"
                                                @on-close="blur"
                                                :config="configDate"
                                                class="form-control datepicker"
                                                aria-placeholder="Seleccione una fecha"
                                                v-model="dates.simple">
                                        </flat-picker>
                                    </base-input>
                                    <div class="text-center">
                                        <base-button type="primary" v-if="!dataExpense.valid" disabled>Registrar</base-button>
                                        <base-button type="primary" v-else v-on:click="registerExpense">Registrar</base-button>
                                    </div>
                                </form>    
                            </tab-pane>
                        </card>
                    </tabs>
                    <vue-custom-scrollbar class="maxHeight">
                        <vue-bootstrap4-table :rows="lendeAdvancements" :columns="columnsLender" :classes="classes" :config="configLender" >
                            <template slot="format-total" slot-scope="props">
                                <span>{{formatPrice(props.row.total)}}</span>
                            </template>
                            <template slot="format-date" slot-scope="props">
                                <span>{{formatDate(props.row.date)}}</span>
                            </template>
                        </vue-bootstrap4-table>
                    </vue-custom-scrollbar >
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal3"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-25%" class="text-muted text-center mb-3">
                       <h3>Servicios</h3> 
                    </div>
                </template>
                <template>
                    <div class="m-2 w-100">
                        <badge class="w-100 text-default" type="primary" v-for="data in dataDetail" :key="data.servicio">{{data.servicio}}</badge>
                    </div>
                </template>
            </card>
        </modal>
        <div class="container-fluid hide">
            <div class="row">
                <div class="col-6">
                    <dt class="col-sm-12">Nombre del empleado: <b>{{nameLender}}</b> </dt>
                    <dt class="col-sm-12">Fecha de Inicio: <b>{{formatDate(dateInit)}}</b> </dt>
                    <dt class="col-sm-12">Fecha de Cierre: <b>{{formatDate(new Date())}}</b> </dt>
                    <dt class="col-sm-12">Servicios totales del mes: <b>{{sales.length}}</b> </dt>
                    <dt class="col-sm-12">Servicios totales: <b>{{salesTotal.length}}</b> </dt>
                </div>
                <div class="col-6">
                    <dt class="col-sm-12">Comisión Total: <b>{{formatPrice(totalComission)}}</b> </dt>
                    <dt class="col-sm-12">Total de Adelantos: <b>{{formatPrice(advancement)}}</b> </dt>
                    <dt class="col-sm-12">Total de Bonos: <b>{{formatPrice(lenderBonus)}}</b> </dt>
                    <dt class="col-sm-12">Total: <b>{{formatPrice(totalComission + lenderBonus - advancement)}}</b> </dt>
                    <dt class="col-sm-12">Porcentaje de Servicios Realizados: <b>{{(sales.length * 100) / salesTotal.length}}%</b> </dt>
                </div>
            </div>
            
        </div>
        <vue-bootstrap4-table :rows="sales" :columns="columns" class="printPadding" :classes="classes" id="tbH" :config="config">
            <template slot="format-total" slot-scope="props">
                <span>{{formatPrice(props.row.total)}}</span>
            </template>
            <template slot="format-comission" slot-scope="props">
                <span>{{formatPrice(props.row.comision)}}</span>
            </template>
            <template slot="format-date" slot-scope="props">
                <span>{{formatDate(props.row.fecha)}}</span>
            </template>
            <template slot="reportSale" slot-scope="props">
                <base-button icon="ni ni-bullet-list-67" size="sm" type="primary" v-on:click="servicesSale(props.row.servicios)">Servicios</base-button>
            </template>
            <template slot="cancelSale" slot-scope="props">
                <base-button block size="sm" type="default" v-on:click="cancelSale(props.row._id, props.row.servicios, props.row.EmployeComision)">Anular</base-button>
            </template>
            <template slot="pagination-info" slot-scope="props">
                Actuales {{props.currentPageRowsLength}} | 
                Filtrados {{props.filteredRowsLength}} | 
                Registros totales {{props.originalRowsLength}}
            </template>
            <template slot="selected-rows-info" slot-scope="props">
                Total Number of rows selected : {{props.selectedItemsCount}}
            </template>
            <template slot="result-info" slot-scope="props">
                Si? : {{props.selectedItemsCount}}
            </template>
        </vue-bootstrap4-table>
        <div class="container-fluid hide">
            <vue-bootstrap4-table :rows="lendeAdvancements" :columns="columnsLender" :classes="classes" :config="configLender" >
                <template slot="format-total" slot-scope="props">
                    <span>{{formatPrice(props.row.total)}}</span>
                </template>
                <template slot="format-date" slot-scope="props">
                    <span>{{formatDate(props.row.date)}}</span>
                </template>
            </vue-bootstrap4-table>
            <vue-bootstrap4-table :rows="lenderBonuses" :columns="columnsBonuses" :classes="classes" :config="configBonuses" >
                <template slot="format-reason" slot-scope="props">
                    <span>{{props.row.expense.split(" / ")[0]}}</span>
                </template>
                <template slot="format-total" slot-scope="props">
                    <span>{{formatPrice(props.row.figure)}}</span>
                </template>
                <template slot="format-date" slot-scope="props">
                    <span>{{formatDate(props.row.date)}}</span>
                </template>
            </vue-bootstrap4-table>
        </div>
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
import vueCustomScrollbar from 'vue-custom-scrollbar'
import flatPicker from "vue-flatpickr-component";
import io from 'socket.io-client';
import "flatpickr/dist/flatpickr.css";
import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        VueBootstrap4Table,
        vueCustomScrollbar,
        flatPicker
    },
    data(){
        return {
            socket: io(endPoint.endpointTarget),
            auth: [],
            id: localStorage.getItem('idReportEmploye'),
            sales: [],
            salesTotal:[],
            dateInit:'',
            fecha: '',
            lenderBonuses:[],
            code: '',
            dataDetail: [],
            nameLender: '',
            totalComission: 0,
            lenderBonus:0,
            advancement: '',
            totalSale: 0,
            modals: {
                modal1: false,
                modal2: false,
                modal3: false,
                message: "",
                icon: '',
                type:''
            },
            configDate: {
                allowInput: true, 
                minDate: new Date(),
            },
            dates: {
                simple: new Date()
            },
            dataExpense: {
                reason: '',
                amount: 0,
                valid: false
            },
            bonus: false,
            lendeAdvancements: [],
            columnsLender: [
                {
                    label: "Razón",
                    name: "reason",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Total",
                    name: "total",
                    slot_name: "format-total",
                    sort: false,
                },
                {
                    label: "Fecha",
                    name: "date",
                    slot_name: "format-date",
                    sort: false,
                },

            ],
            columnsBonuses: [
                {
                    label: "Razón",
                    name: "expense",
                    slot_name: "format-reason",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Total",
                    name: "Figure",
                    slot_name: "format-total",
                    sort: false,
                },
                {
                    label: "Fecha",
                    name: "date",
                    slot_name: "format-date",
                    sort: false,
                },

            ],
            configBonuses: {
                card_title: "Bonos",
                checkbox_rows: false,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : true,
                pagination_info : false,
                pagination: false,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: false,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            configLender: {
                card_title: "Adelantos",
                checkbox_rows: false,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : true,
                pagination_info : false,
                pagination: false,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: false,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            columns: [
                {
                    label: "Fecha",
                    name: "fecha",
                    slot_name:"format-date",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Cliente",
                    name: "cliente",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "Enter first name"
                    // },
                    sort: true,
                },
                {
                    label: "Comisión",
                    name: "comision",
                    slot_name:"format-comission",
                    sort: true,
                },
                {
                    label: "Total",
                    name: "total",
                    slot_name:"format-total",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "Enter country"
                    // },
                },
                {
                    label: "Detalle",
                    name: "_id",
                    slot_name:"reportSale",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "Enter country"
                    // },
                },
                {
                    label: "Anular venta",
                    name: "_id",
                    slot_name:"cancelSale",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "Enter country"
                    // },
                }
            ],
            config: {
                card_title: "Tabla de ventas",
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
        }
    },
    created(){
        this.getData()
        this.getAdvancements()
        this.getToken()
        this.getBonus()
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
        servicesSale(Data){
            this.dataDetail = Data
            this.modals.modal3 = true
            
        },
        async cancelSale(id,servicios, comission){
            console.log(comission)
            const cancelSale = await axios.put(endPoint.endpointTarget+'/ventas/'+id, {
                employeComision: comission
            })
            if (cancelSale.data.status == 'ok') {
                axios.post(endPoint.endpointTarget+'/inventario/nullSale', {
                    array:servicios
                })
                this.modals = {
                    modal1: true,
                    message: "¡Venta anulada!",
                    icon: 'ni ni-check-bold ni-5x',
                    type: 'success'
                }
                setTimeout(() => {
                    this.modals = {
                        modal1: false,
                        modal2: false,
                        modal3: false,
                        message: "",
                        icon: '',
                        type:''
                    }
                }, 1500);
                this.getData()
                const notify = await axios.post(endPoint.endpointTarget+'/notifications', {
                    userName:localStorage.getItem('nombre') + " " + localStorage.getItem('apellido'),
                    userImage:localStorage.getItem('imageUser'),
                    detail:'Anuló una venta del día '+this.formatDate(this.arreglo.fecha),
                    link: 'Ventas'
                })
                if (notify) {
                    this.socket.emit('sendNotification', notify.data)
                }   
            }
            else{
                this.modals = {
                    modal1: true,
                    message: "¡Error al anular!",
                    icon: 'ni ni-fat-remove ni-5x',
                    type: 'danger'
                }
                setTimeout(() => {
                    this.modals = {
                        modal1: false,
                        modal2: false,
                        modal3: false,
                        message: "",
                        icon: '',
                        type:''
                    }
                }, 1500);
            }
        },
        getAdvancements(){
            axios.get(endPoint.endpointTarget+'/manicuristas/advancements/'+this.id)
            .then(res => {	
                
                this.lendeAdvancements = []
                this.lendeAdvancements = res.data
            })
            .catch(err => {
                console.error(err)
            })
        },
        getBonus(){
            axios.get(endPoint.endpointTarget+'/manicuristas/getBonusByEmploye/'+this.id)
            .then(res => {	
                console.log(res.data)
                this.lenderBonuses = []
                this.lenderBonuses = res.data
            })
            .catch(err => {
                console.error(err)
            })
        },
        validRegister(){
            this.dataExpense.valid = this.dataExpense.reason != '' && this.dataExpense.amount > 0 ? true : false
        },
        registerExpense(){
            axios.post(endPoint.endpointTarget+'/manicuristas/registerAdvancement', {
                reason: this.dataExpense.reason,
                id:this.id,
                name: this.nameLender,
                prest: this.code,
                total: this.dataExpense.amount,
                check: this.bonus,
                date: this.dates.simple
            })
            .then(res => {
                if (res.data.status == 'bonus') {
                    this.modals = {
                        modal1: true,
                        message: "Se registro el bono con exito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3: false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
                    this.bonus = false
                    this.dataExpense.reason = ''
                    this.dataExpense.amount = 0
                    this.dataExpense.valid = false
                    this.getAdvancements();
                    this.getData()
                }else{
                    this.modals = {
                        modal1: true,
                        message: "Se registro el avance con exito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3: false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
                    this.getAdvancements();
                    this.getData()
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return dateFormat.getDate()+"-"+(dateFormat.getMonth() + 1)+"-"+dateFormat.getFullYear()
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        getData(){
            const date = new Date()
            this.fecha = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()
            console.log(this.fecha)
            axios.get(endPoint.endpointTarget+'/employe/justOneById/'+this.id)
            .then(resData => {
                
                this.code = resData.data._id
                this.nameLender = resData.data.nombre
                this.totalComission = resData.data.comision
                this.lenderBonus = resData.data.bonus
                this.advancement = resData.data.advancement
                const identification = resData.data.nombre+':'+resData.data.documento
                axios.get(endPoint.endpointTarget+'/manicuristas/SalesByPrest/'+identification)
                .then(res => {
                    console.log(res)
                    this.sales = res.data
                    this.dateInit = res.data[0].fecha
                    let totals = 0
                    let comissions = 0
                    for (let index = 0; index < res.data.length; index++) {
                        totals = parseFloat(res.data[index].total) + parseFloat(totals)
                        comissions = parseFloat(res.data[index].comision) + parseFloat(comissions)
                    }
                    this.totalSale = totals
                })
                axios.get(endPoint.endpointTarget+'/manicuristas/SalesByPrestAll/'+identification)
                .then(res => {
                    this.salesTotal = res.data
                })
            })
            .catch(err => {
                console.log(err )
            })
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        printReport(){
            this.$swal({
                title: '¿Estás seguro de hacer el Cierre?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si hacer Cierre',
                cancelButtonText: 'No hacer Cierre',
                showCloseButton: true,
                showLoaderOnConfirm: true
            })
            .then(result => {
                if (result.value) {
                    axios.put(endPoint.endpointTarget+'/manicuristas/ClosePrest/'+this.code)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            print()
                            setTimeout(()=> {
                                router.push({path:'/Empleados'})
                            }, 1000) 
                        }else{
                            this.$swal('Error en el cierre', 'Hubo un error', 'error')
                        }
                    }) 
                    .catch(err => {
                        console.log(err)
                    })                   
                }else{
                    this.$swal('No se hizo el cierre', 'Aborto la acción', 'info')
                }
            })
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
    }
}
</script>
<style>
    .card-header{
        font-size: 2.5vw;
    }
    .maxHeight{
        max-height: 200px;
        overflow-y: scroll;
    }
    .maxHeight .card-footer{
        display:none;
    }
    .hide{
        display: none;
    }
    @media print {
        .card-footer {
            display :  none;
        }
        #sidenav-main{
            display: none;
        }
        .main-content{
            margin-left: 0 !important;
        }
        .btn{
            display: none;
        }
        .hide{
            display: block;
            
        }
        #tbH td:last-child, #tbH th:last-child{
            display: none !important;
        }
        
        .hidden{
            display: none;
        }
        .printPadding{
            padding-left: 40px;
            padding-right: 40px;
        }
        .card-header{
            text-align: center;
        }
    }
    
</style>