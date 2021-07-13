<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 50px; background-image: url(img/theme/clients.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Ventas</p>
                        <p class="text-white">Sección dedicada al registro de las ventas de su negocio, podrás filtrar y exportar en excel dichas ventas.</p>
                    </div>
                    <div class="float-right mt-6">
                        <div class="float-right" style="width:73%;">
                            <label for="date" class="text-white">Busque por fecha</label><br>
                            <a-range-picker style="width:60%;" class="rangeInput" :disabled="validRoute('ventas', 'filtrar') == true ? false : true" :ranges="{ Hoy: [moment(), moment()], 'Este mes': [moment(), moment().endOf('month')] }" @change="selectDate" :locale="locale" />
                            <base-button :disabled="dateFind.length > 0 ? false : true" size="sm" class="mr-2 ml-2" style="margin-top:-5px;" v-if="validRoute('ventas', 'filtrar')"  v-on:click="filterSale" type="success">
                                <a-icon type="search" style="vertical-align:1px;font-size:1.8em;" />
                            </base-button>
                            <base-button v-else disabled size="sm" class="mr-2 ml-2" style="margin-top:-5px;" type="success">
                                <a-icon type="search" style="vertical-align:1px;font-size:1.8em;" />
                            </base-button>
                            <base-button :disabled="inspectorFilter ? false : true" @click="getSales" size="sm" class="mr-2" style="margin-top:-5px;" type="secondary">
                                <a-icon type="undo" style="vertical-align:1px;font-size:1.8em;" />
                            </base-button>
                            <base-button style="margin-top:-5px;" title="Generar excel" size="sm" class="excel-generate" v-if="validRoute('ventas', 'filtrar')"  type="primary" v-on:click="modals.modal3 = true"> 
                                <a-icon type="file-excel" style="vertical-align:1.5px;font-size:1.8em;" />
                            </base-button>
                        </div>
                    </div>
                </div>
            </div>
        </base-header>
        <a-modal v-model="modals.modal1" class="modalReport" :width="800" :footer="null" :closable="true" >
            <div class="mx-2" id="htmlPrint">
                <template v-if="dataSale != null">
                    <h2>Detalle de la venta (ID: {{dataSale.uuid}}) <b v-if="!dataSale.status"># Anulada</b></h2>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>Anular venta</span>
                        </template>
                        <base-button v-if="dataSale.status" @click="cancelSale(dataSale._id)" size="sm" class="mr-2 float-right" type="warning">
                            <a-icon type="close-circle" style="vertical-align:1px;font-size:1.5em;" />
                        </base-button>
                    </a-tooltip>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>Imprimir reporte</span>
                        </template>
                        <base-button @click="printReport(dataSale._id)" size="sm" class="mr-2 float-right" type="secondary">
                            <a-icon type="printer" style="vertical-align:1px;font-size:1.5em;" />
                        </base-button>
                    </a-tooltip>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>Enviar correo</span>
                        </template>
                        <base-button size="sm" class="mr-2 float-right" type="secondary">
                            <a-icon type="mail" style="vertical-align:1px;font-size:1.5em;" />
                        </base-button>
                    </a-tooltip>
                </template>
                <template v-if="dataSale != null">
                    <h3>Resumen de pago</h3>
                    <hr class="mt-0 mb-0">
                    <div class="row">
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Fecha</b></label><br>
                            <span class="ml-1">{{dataSale.createdAt | formatDate}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Cliente</b></label><br>
                            <span class="ml-1">{{dataSale.client.firstName}} {{dataSale.client.lastName}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Correo cliente</b></label><br>
                            <span class="ml-1">{{dataSale.client.email}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Monto total</b></label><br>
                            <span class="ml-1">{{dataSale.totals.total | formatPrice}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Monto pagado</b></label><br>
                            <span class="ml-1">{{dataSale.totals.totalPay | formatPrice}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Vuelto</b></label><br>
                            <span class="ml-1">{{dataSale.totals.total - dataSale.totals.totalPay | formatPrice}}</span>
                        </div>
                    </div>
                    <h3 class="mt-3">Abonos</h3>
                    <hr class="mt-0 mb-0">
                    <div class="row" v-for="pay of dataSale.typesPay" :key="pay.type">
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Fecha</b></label><br>
                            <span class="ml-1">{{dataSale.createdAt | formatDate}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Medio de pago</b></label><br>
                            <span class="ml-1">
                                {{pay.type}}
                            </span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Total</b></label><br>
                            <span class="ml-1">{{pay.total | formatPrice}}</span>
                        </div>
                    </div>
                    <!-- <hr class="mt-3 mb-1" style="height:2px;background-color:#353535;border-radius:5px;"> -->
                    <hr class="mt-3 mb-1">
                    <h3 class="mt-3">Productos</h3>
                    <hr class="mt-1 mb-0">
                    <a-table :columns="columnsReport" :loading="progress" :data-source="dataSale.items" :scroll="getScreen">
                        <template slot="total-slot" slot-scope="record, column">
                            {{column.totalItem | formatPrice}}
                        </template>
                        <template slot="price-slot" slot-scope="record, column">
                            {{column.price | formatPrice}}
                        </template>
                        <template slot="type-slot" slot-scope="record, column">
                            {{column.quantityProduct}}
                        </template>
                    </a-table>
                </template>
            </div>
        </a-modal>
        <!-- <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                       <h3>Detalle de la venta</h3> 
                    </div>
                </template>
                
                <template v-if="dataSale != null">
                    <tabs fill class="flex-column flex-md-row">
                        <card shadow>
                            <tab-pane>
                                <span slot="title">
                                    <i class="ni ni-cloud-upload-96"></i>
                                    Básicos
                                </span>
                                <div class="text-muted text-left">
                                    <h3><strong>Fecha: </strong>{{formatDate(dataSale.createdAt)}}</h3> 
                                </div>
                                <div class="text-muted text-left">
                                    <h3><strong>N° de Venta: </strong>V-{{dataSale.count}}</h3> 
                                </div>
                                <div class="text-muted text-left">
                                    <h3><strong>Empleada (o): <br/></strong><span>{{dataSale.employe.name}}  <br/></span></h3> 
                                </div>
                                <div class="text-muted text-left">
                                    <h3><strong>Cliente: <br/></strong><span>{{dataSale.client.name}} <br/></span></h3> 
                                </div>
                                <hr>
                                <div class="text-muted mt-2">
                                    <h2 class="text-center">Metodos de pago </h2>
                                    <div class="row">
                                        <template v-for="pay in dataSale.typesPay" >
                                            <h3 :key="pay.type" class="col-4 mx-auto"  v-if="pay.total > 0">
                                                <strong class="text-left">
                                                    <base-button class="col-12" type="secondary">{{pay.type}} 
                                                        <badge type="success" class="text-default">{{formatPrice(pay.total)}}</badge>
                                                    </base-button>
                                                </strong>
                                                <span class="float-right pr-5"> </span>
                                            </h3>
                                        </template>
                                    </div>
                                </div>
                            </tab-pane>
                            <tab-pane>
                                <span slot="title">
                                    <i class="ni ni-bell-55 mr-2"></i>
                                    Avanzados
                                </span>
                                <div class="text-muted text-left">
                                    <h3>
                                        <strong>Servicio(s): </strong>
                                        <span v-for="services of dataSale.services" :key="services"> 
                                            <br> {{services.service}}  
                                        </span>
                                    </h3> 
                                    <h3>
                                        <strong class="text-left">Diseño: </strong>
                                        <span>
                                            {{formatPrice(dataSale.design)}} 
                                        </span>
                                    </h3>
                                    <h3 v-if="dataSale.discount != null">
                                        <strong class="text-left">Descuento: </strong>
                                        <span>
                                            {{dataSale.discount}} %<br> 
                                        </span>
                                    </h3> 
                                </div>
                                <div class="text-muted">
                                    <h2 class="text-center">Montos</h2>
                                    <base-button class="w-100 text-left" type="secondary">
                                        <span class="text-left">Comisión total:</span>
                                        <badge type="success" class="text-default float-right">
                                            {{formatPrice(dataSale.commission)}}
                                        </badge>
                                    </base-button>
                                    <base-button class="w-100 text-left" type="secondary">
                                        <span class="text-left">Local:</span>
                                        <badge type="success" class="text-default float-right">
                                            {{formatPrice(dataSale.localGain)}}
                                        </badge>
                                    </base-button>
                                    <base-button class="w-100 text-left" type="secondary">
                                        <span class="text-left">Total:</span>
                                        <badge type="success" class="text-default float-right">
                                            {{formatPrice(dataSale.total)}}
                                        </badge>
                                    </base-button>
                                </div>
                            </tab-pane>
                        </card>
                    </tabs>
                    <template v-if="validRoute('ventas', 'filtrar')">
                        <base-button block class="mt-2" v-if="dataSale.status" type="default" v-on:click="cancelSale(dataSale._id, dataSale.services)">Anular venta</base-button>
                    </template>
                    <template v-else>
                        <base-button disabled block class="mt-2" v-if="dataSale.status" type="default">Anular venta</base-button>
                    </template>
                    
                </template>
            </card>
        </modal> -->
        <modal :show.sync="modals.modal3"
            body-classes="p-4"
            modal-classes="modal-dialog-centered modal-sm">
            <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <template>
                <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                    <h3>Aplica filtros para tu reporte</h3> 
                </div>
            </template>
            <template>
                <div class="row">
                    <div class="col-md-12 mt-2">
                        <label for="date">Filtra por fecha</label>
                        <a-range-picker class="rangeInput" :disabled="validRoute('ventas', 'filtrar') == true ? false : true" :ranges="{ Hoy: [moment(), moment()], 'Este mes': [moment(), moment().endOf('month')] }" @change="selectDateExcel" :locale="locale" />
                    </div>
                    <div class="col-md-12 mt-2">
                        <label for="lender">¿Filtrar por cliente?</label>
                        <div v-on:click="chooseClient">
                            <vue-single-select v-if="validLender"
                            v-model="clientSelect"
                            :options="clientNames"
                            placeholder="Clientes"
                            ></vue-single-select>  
                            <vue-single-select v-else
                            v-model="clientSelect"
                            :options="clientNames"
                            placeholder="Clientes"
                            class="bgcolor-danger"
                            disabled
                            ></vue-single-select> 
                        </div>
                    </div>
                    <div class="col-md-12">
                        <center>
                            <base-button type="default" v-on:click="generateExcel()"> Generar
                            </base-button>
                        </center>
                    </div>
                </div>
            </template>
        </modal>
        <a-config-provider>
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>Sucursal sin ventas registradas</h2>
                </div>
            </template>
            <a-table :columns="columns" :loading="progress" :data-source="sales" :scroll="getScreen">
                <div
                    slot="filterDropdown"
                    slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                    style="padding: 8px"
                    >
                    <a-input
                        v-ant-ref="c => (searchInput = c)"
                        :placeholder="`Buscar por nombre`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block;"
                        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                        @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                    />
                    <a-button
                        type="primary"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                    >
                        Buscar
                    </a-button>
                    <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                        resetear
                    </a-button>
                </div>
                <a-icon
                    slot="filterIcon"
                    slot-scope="filtered"
                    type="search"
                    :style="{ color: filtered ? '#108ee9' : undefined }"
                />
                <template slot="customRender" slot-scope="text, record, index, column">
                    <span v-if="searchText && searchedColumn === column.dataIndex">
                        <template
                        v-for="(fragment, i) in text
                            .toString()
                            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                        >
                        <mark
                            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                            :key="i"
                            class="highlight"
                            >{{ fragment }}</mark
                        >
                        <template v-else>{{ fragment }}</template>
                        </template>
                    </span>
                    <template v-else>
                        {{ text }}
                    </template>
                </template>
                <template slot="client-slot" slot-scope="record, column">
                    {{column.client.firstName}} {{column.client.lastName}}
                </template>
                <template slot="date-format" slot-scope="record, column">
                    {{column.createdAt | formatDate}}
                </template>
                <template slot="localGain" slot-scope="record, column">
                    {{column.localGain | formatPrice}}
                </template>
                
                <template slot="total" slot-scope="record, column">
                    {{column.totals.total | formatPrice}}
                </template>
                <template slot="reportSale" slot-scope="record, column">
                    <template v-if="validRoute('ventas', 'detalle')" >
                        <a-tooltip placement="top">
                            <template slot="title">
                                <span>Ver detalles</span>
                            </template>
                            <base-button v-if="column.status" size="sm" type="default" v-on:click="dataReport(column)">
                                <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                            </base-button>
                            <base-button v-else size="sm" type="danger" v-on:click="dataReport(column)">
                                <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                            </base-button>
                        </a-tooltip>
                    </template>
                    <template v-else >
                        <base-button v-if="column.status" disabled size="sm" type="default">
                            <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                        </base-button>
                        <base-button v-else disabled size="sm" type="danger" >
                            <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                        </base-button>
                    </template>
                </template>
            </a-table>
        </a-config-provider>
        <modal :show.sync="modals.modal2"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
    </div>
</template>
<script>
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {Spanish} from 'flatpickr/dist/l10n/es.js';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode'
import locale from 'ant-design-vue/es/date-picker/locale/es_ES';
import XLSX from 'xlsx'
const moment = require('moment'); // require
const dateNew = new Date()

import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        flatPicker,
        VueBootstrap4Table
    },
    data() {
        return {
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            progress:true,
            auth: [],
            moment,
            socket: io(endPoint.endpointTarget),
            modals: {
                modal1: false,
                modal2: false,
                modal3:false,
                message: "",
                icon: '',
                type:''
            },
            dates: {
                range:   dateNew.getDate()+ "-" +  (dateNew.getMonth()+ 1) +"-"+dateNew.getFullYear(),
                rangeExcel: dateNew.getDate()+ "-" +  (dateNew.getMonth()+ 1) +"-"+dateNew.getFullYear()
            },
            configDatePicker: {
                allowInput: true, 
                mode: 'range',
                dateFormat: 'd-m-Y',
                locale: Spanish, // locale for this instance only          
            },
            locale,
            columnsReport: [
                {
                    title: 'Nombre',
                    dataIndex: 'item.name',
                    key: 'item.name',
                    width: '30%',
                },
                {
                    title: 'Precio',
                    dataIndex: 'price',
                    key: 'price',
                    width: '25%',
                    scopedSlots: { customRender: 'price-slot' }
                },
                {
                    title: 'Cantidad',
                    dataIndex: 'type',
                    key: 'type',
                    width: '25%',
                    scopedSlots: { customRender: 'type-slot' }
                },
                {
                    title: 'Total',
                    dataIndex: 'totalItem',
                    key: 'totalItem',
                    width: '20%',
                    scopedSlots: { customRender: 'total-slot' }
                },
            ],
            columns: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'date-format' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                    ellipsis: true,
                },
                {
                    title: 'Cliente',
                    dataIndex: 'client',
                    key: 'client',
                    ellipsis: true,
                    scopedSlots: { customRender: 'client-slot' }
                },
                {
                    title: 'Ganacia local',
                    dataIndex: 'localGain',
                    key: 'localGain',
                    ellipsis: true,
                    scopedSlots: { customRender: 'localGain' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.localGain - b.localGain
                },
                {
                    title: 'Total',
                    dataIndex: 'totals.total',
                    key: 'totals.total',
                    ellipsis: true,
                    scopedSlots: { customRender: 'total' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.total - b.total
                },
                {
                    title: 'Detalle',
                    dataIndex: '_id',
                    key: '_id',
                    ellipsis: true,
                    scopedSlots: { customRender: 'reportSale' },
                },
            ],
            sales: [],
            dataSale: null,
            inspectorFilter: false,
            lenderSelect: '',
            lenderNames: [],
            clientSelect: '',
            clientNames: [],
            validLender: true,
            validClient: true,
            branch: '',
            branchName: '',
            dateFind: [],
            dateFindExcel: []
        }
    },
    created(){
        this.getToken()
        this.getSales()  
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
        },
        selectDate(date, dateString){
            console.log(date, dateString)
            if (date) {
                this.dateFind = dateString
            }else{
                this.dateFind = []
            }
        },
        selectDateExcel(date, dateString){
            console.log(date, dateString)
            if (date) {
                this.dateFindExcel = dateString
            }else{
                this.dateFindExcel = []
            }
        },
        async getClient(){
            try{
                const clients = await axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
                this.clientNames = []
                for (let index = 0; index < clients.data.data.length; index++) {
                    this.clientNames.push(clients.data.data[index].firstName+ ' / ' +clients.data.data[index].email)
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
        async filterSale(){
            this.progress = true
            this.inspectorFilter = true
            try {
                const sales = await axios.post(endPoint.endpointTarget+'/sales/findSalesByDate', {
                    dates: this.dateFind
                }, this.configHeader)
                console.log(sales)
                if (sales.data.status == 'sales does exist') {
                    this.progress = false
                    this.sales = []
                    this.$swal({
                        icon: 'error',
                        title: 'No se encontraron ventas',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.progress = false
                    this.sales = sales.data.data
                }
            }catch(error){
                console.log(error)
            }
        },
        async getSales(){
            this.progress = true
            this.inspectorFilter = false
            $('.rangeInput .ant-calendar-picker-clear').click()
            this.dateFind = []
            try {
                const sales = await axios.get(endPoint.endpointTarget+'/sales', this.configHeader)
                if (sales.data.status == 'ok') {
                    this.sales = sales.data.data
                    this.progress = false
                }else{
                    this.sales = []
                    this.progress = false
                }
            }catch(err){
                this.$swal({
                    icon: 'error',
                    title: 'Acceso invalido, ingrese de nuevo, si el problema persiste comuniquese con el proveedor del servicio',
                    showConfirmButton: false,
                    timer: 2500
                })
                // router.push({name: 'login'})
            }
        },
        async dataReport(data){
            this.dataSale = data
            // this.arreglo.cliente = this.arreglo.cliente.split(' - ')
            // this.arreglo.manicurista = this.arreglo.manicurista.split(' / ')
            // this.arreglo.descuento = this.arreglo.descuento.split(' - ')
            console.log(this.dataSale)
            this.modals.modal1 = true
        },
        cancelSale(id){
            this.$swal({
				title: '\n¿Desea anular la venta?',
				text: 'No puede revertir esta acción',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
                if (result.value) {
                    axios.put(endPoint.endpointTarget+'/sales/'+id, {
                        id: id
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Venta anulada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getSales()
                            this.dataSale.status = false
                            axios.post(endPoint.endpointTarget+'/notifications', {
                                branch: this.branch,
                                userName: localStorage.getItem('firstname') + " " + localStorage.getItem('lastname'),
                                userImage: localStorage.getItem('imageUser'),
                                detail: 'Anuló una venta del día '+this.formatDate(this.dataSale.createdAt),
                                link: 'Ventas'
                            }).then(res => {
                                console.log(res)
                                if (res.data.status == 'ok') {
                                    this.socket.emit('sendNotification', notify.data)
                                } 
                            })
                        }else{
                            this.$swal({
                                icon: 'error',
                                title: 'error al anular, si persiste pongase en contacto con el proveedor del servicio',
                                showConfirmButton: false,
                                timer: 2500
                            })
                        }
                    })
                }else{
                    this.$swal({
                        icon: 'info',
                        title: 'Acción cancelada',
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
                            return true
                        } 
                    }
                }
            }
        },
        generateExcel(){
            var valid = this.dateFindExcel[0]+' a '+this.dateFindExcel[1]
            if (this.clientSelect == null) {
                this.clientSelect = ''
            }
            axios.post(endPoint.endpointTarget+'/sales/generateDataExcel', {
                rangeExcel: this.dateFindExcel,  
                clientSelect: this.clientSelect.split(' / ')[1] ? this.clientSelect.split(' / ')[1] : ''
            }, this.configHeader)
            .then(res => {
                console.log(res)
                if (res.data.status == 'ok') {
                    var Datos = XLSX.utils.json_to_sheet(res.data.dataTable) 
                    var wb = XLSX.utils.book_new() 
                    XLSX.utils.book_append_sheet(wb, Datos, 'Datos') 
                    XLSX.writeFile(wb, 'Ventas del '+valid+'.xlsx') 
                    this.clientSelect = ''
                    $('.rangeInput .ant-calendar-picker-clear').click()
                    this.modals.modal3 = false
                }else{
                    this.$swal({
                        icon: 'info',
                        title: 'No se encontraron ventas en las fechas seleccionadas',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            })
        },
        chooseLender(){
            if (this.lenderSelect == '' || this.lenderSelect == null) {
                this.validLender = true
            }else{
                this.validLender = false
            }
        },
        chooseClient(){
            if (this.clientSelect == '' || this.clientSelect == null) {
                this.validClient = true
            }else{
                this.validClient = false
            }
        },
        printReport(id){
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;
            var win = window.open(endPoint.url+'/#/reportPdf?id='+id, '_blank', params)
            win.focus();
        }
    },
    mounted (){
        EventBus.$on('reloadSales', status => {
            this.getSales()
        })
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
    .vue-progress-path path {
        stroke-width: 12;
    }
    .vue-progress-path .progress {
        stroke:#00768c;
    }
    .vue-progress-path .background {
        stroke: transparent;
    }
    /* .excel-generate{
        position:absolute;
        right:2%;
        top:30%;
        z-index: 10;
    } */
    .bgcolor-danger #single-select{
        border-color:red;
    }
    .modalReport div .ant-modal{
        top: 10px !important;
    }
</style>