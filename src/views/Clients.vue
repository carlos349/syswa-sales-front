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
                        <p class="mb-0 display-2 text-white">Clientes</p>
                        <p class="text-white">Sección dedicada a la administración de sus clientes, podrás enviar correos electrónicos y exportar en excel la base de datos de sus clientes.</p>
                    </div>
                    <base-button class="float-right mt-7 mr-2" size="sm" :disabled="validRoute('clientes', 'registrar') ? false : true" @click="generateExcel" type="success">
                        <a-icon type="file-excel" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Excel
                    </base-button>
                    <base-button class="float-right mt-7 mr-2" size="sm" :disabled="validRoute('clientes', 'registrar') ? false : true" @click="modals.modal1 = true , initialState(2)" type="success">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Registrar
                    </base-button>
                </div>
            </div>
        </base-header>
        

        <!-- MODAL REGISTRAR -->

        <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        Datos del cliente
                    </div>
                </template>
                <template>
                    <tabs v-if="registerClient.valid2 == true" fill class="flex-column flex-md-row">
                        <card shadow>
                            <tab-pane>
                                <span v-if="registerClient.valid2 == true" slot="title">
                                    <i class="ni ni-collection"></i>
                                    Basicos
                                </span>
                                <form role="form">
                                    <div class="row mt-4">
                                        <base-input alternative
                                            class="mb-2 col-6"
                                            placeholder="Nombre"
                                            v-model="registerClient.firstName"
                                            v-on:keyup="validRegister()"
                                            addon-left-icon="ni ni-single-02"
                                            addon-right-icon="fa fa-asterisk text-danger">
                                        </base-input>
                                        <base-input alternative
                                            class="mb-2 col-6"
                                            placeholder="Nombre"
                                            v-model="registerClient.lastName"
                                            v-on:keyup="validRegister()"
                                            addon-left-icon="ni ni-single-02"
                                            addon-right-icon="fa fa-asterisk text-danger">
                                        </base-input>
                                    </div>
                                    
                                    <base-input alternative
                                                type="text"
                                                class="mb-2"
                                                placeholder="Correo"
                                                v-model="registerClient.email"
                                                v-on:keyup="validRegister()"
                                                addon-left-icon="fa fa-address-card"
                                                addon-right-icon="fa fa-asterisk text-danger">
                                    </base-input>
                                    <div class="col-12 mb-2 p-0">
                                        <VuePhoneNumberInput v-model="registerClient.phone.formatNational" @update="phoneData = $event, registerClient.phone = $event, validRegister()"
                                        :default-phoner-number="registerClient.phone.nationalNumber"
                                        :default-country-code="registerClient.phone.countryCode"
                                        :translations="{
                                            countrySelectorLabel: 'Código de país',
                                            countrySelectorError: 'Elije un país',
                                            phoneNumberLabel: 'Número de teléfono',
                                            example: 'Ejemplo :'
                                        }"/>
                                    </div>
                                    <base-input alternative
                                                type="text"
                                                placeholder="Instagram"
                                                v-model="registerClient.instagram"
                                                addon-left-icon="fa fa-address-card"
                                                addon-right-icon="fas fa-plus text-default">
                                    </base-input>
                                    <div class="text-center">
                                        <base-button type="primary" v-if="registerClient.valid == false" disabled class="my-1">{{tipeForm}}</base-button>
                                        <base-button type="primary" v-on:click="clientEdit()" v-else class="my-1">{{tipeForm}}</base-button>
                                    </div>
                                    
                                </form>                                
                            </tab-pane>

                            <tab-pane v-if="registerClient.valid2 == true">
                                <span slot="title">
                                    <i class="ni ni-chart-bar-32"></i>
                                    Avanzados
                                </span>
                                <div class="row">
                                    <base-button class="col-12 mt-1" type="secondary">
                                        <span>Cliente desde</span>
                                        <badge class="text-default" type="success">{{registerClient.createdAt | formatDate}}</badge>
                                    </base-button>
                                    <base-button class="col-12 mt-1" type="secondary">
                                        <span>Ultima atención</span>
                                        <badge class="text-default" type="success">{{registerClient.lastAttend | formatDate}}</badge>
                                    </base-button>
                                </div>
                            </tab-pane>
                        </card>
                    </tabs>
                    <form v-else role="form">
                        <div class="row">
                            <base-input alternative
                                class="mb-3 col-6"
                                placeholder="Nombre"
                                v-model="registerClient.firstName"
                                v-on:keyup="validRegister()"
                                addon-left-icon="ni ni-single-02"
                                addon-right-icon="fa fa-asterisk text-danger">
                            </base-input>
                            <base-input alternative
                                class="mb-3 col-6"
                                placeholder="Apellido"
                                v-model="registerClient.lastName"
                                v-on:keyup="validRegister()"
                                addon-left-icon="ni ni-single-02"
                                addon-right-icon="fa fa-asterisk text-danger">
                            </base-input>
                        </div>
                        <base-input alternative
                                    type="text"
                                    placeholder="Correo"
                                    v-model="registerClient.email"
                                    v-on:keyup="validRegister()"
                                    addon-left-icon="fa fa-address-card"
                                    addon-right-icon="fa fa-asterisk text-danger">
                        </base-input>
                        
                        <div class="col-12 mb-4 p-0">
                            <VuePhoneNumberInput v-model="registerClient.phone.nationalNumber" 
                                @update="phoneData = $event, registerClient.phone = $event, validRegister()" 
                                :default-phoner-number="registerClient.phone.nationalNumber"
                                :default-country-code="registerClient.phone.countryCode"
                                :translations="{
                                countrySelectorLabel: 'Código de país',
                                countrySelectorError: 'Elije un país',
                                phoneNumberLabel: 'Número de teléfono',
                                example: 'Ejemplo :'
                            }"/>
                        </div>
                        <span style="color:red;position:absolute;right:60px;top:160px;z-index:1;font-size:20px">*</span>
                        <base-input alternative
                                    type="text"
                                    placeholder="Instagram"
                                    v-model="registerClient.instagram"
                                    addon-left-icon="fa fa-address-card"
                                    addon-right-icon="fas fa-plus text-default">
                        </base-input>
                        <div class="text-center">
                            <base-button type="primary" v-if="registerClient.valid == false" disabled class="my-4">{{tipeForm}}</base-button>
                            <base-button type="primary" v-on:click="registerClients()" v-else class="my-4">{{tipeForm}}</base-button>
                        </div>
                        
                    </form>
            </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal2"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
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
                        Elija la plantilla de diseño para su correo
                    </div>
                </template>
                <template>
                    <div class="row p-3">
                        <div class="col-4 p-1">
                            <div class="template" v-on:click="selectTemplate(1)">
                                <img src="../assets/template-1.png" style="width:100%;" alt="">
                            </div>
                        </div>
                        <div class="col-4 p-1">
                            <div class="template" v-on:click="selectTemplate(2)">
                                <img src="../assets/template-2.png" style="width:100%;" alt="">
                            </div>
                        </div>
                        <div class="col-4 p-1">
                            <div class="template" v-on:click="selectTemplate(3)">
                                <img src="../assets/template-3.png" style="width:100%;" alt="">
                            </div>
                        </div>
                        <div class="col-4 p-1">
                            <div class="template" v-on:click="selectTemplate(4)">
                                <img src="../assets/template-4.png" style="width:100%;" alt="">
                            </div>
                        </div>
                        <div class="col-4 p-1">
                            <div class="template" v-on:click="selectTemplate(5)">
                                <img src="../assets/template-5.png" style="width:100%;" alt="">
                            </div>
                        </div>
                        <div class="col-4 p-1">
                            <div class="template" v-on:click="selectTemplate(6)">
                                <img src="../assets/template-6.png" style="width:100%;" alt="">
                            </div>
                        </div>
                    </div>
                </template>
            </card>
        </modal>
        <base-alert class="positionAlert" type="success" v-if="successRegister">
            <strong>Registrado!</strong> Has registrado al cliente con exito!
        </base-alert>

        <!-- TABLA DE CLIENTES -->
        <template>
            <a-config-provider>
                <template #renderEmpty>
                    <div style="text-align: center">
                        <a-icon type="warning" style="font-size: 20px" />
                        <h2>No hay ningun cliente registrado</h2>
                    </div>
                </template>
                <a-table :columns="columns" :loading="clientState" :data-source="clients" :scroll="getScreen">
                    <div
                    slot="filterDropdown"
                    slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                    style="padding: 8px"
                    >
                    <a-input
                        v-ant-ref="c => (searchInput = c)"
                        :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                        Restablecer
                    </a-button>
                    </div>
                    <a-icon
                        slot="filterIcon"
                        slot-scope="filtered"
                        type="search"
                        :style="{ color: filtered ? '#108ee9' : undefined }"
                    />
                    <template slot="actions" slot-scope="record, column">
                        <b>
                            <a-tooltip placement="top">
                                <template slot="title">
                                <span>Detalles / Editar</span>
                                </template>
                                <base-button v-if="validRoute('clientes', 'detalle')" size="sm" type="default" @click="modals.modal1 = true , initialState(3), pushData(column.firstName, column.lastName, column.email, column.phone, column.instagram, column.lastAttend, column.createdAt, column._id)" icon="ni ni-bullet-list-67"></base-button>
                                <base-button disabled v-else size="sm" type="default" icon="ni ni-bullet-list-67"></base-button>
                            </a-tooltip>
                            
                            <a-tooltip placement="top">
                                <template slot="title">
                                <span>Eliminar</span>
                                </template>
                                <base-button v-if="validRoute('clientes', 'eliminar')" size="sm" v-on:click="deleteClient(column._id)" type="warning" icon="fas fa-trash"></base-button>
                                <base-button disabled v-else size="sm" type="warning" icon="fas fa-trash"></base-button>
                            </a-tooltip>
                        </b>
                    </template>
                </a-table>
            </a-config-provider>    
        </template>
        <!-- END -->

    </div> 
</template>

<script>
//Back - End 
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
import router from '../router'
import XLSX from 'xlsx'
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
// COMPONENTS
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        VueBootstrap4Table,
        flatPicker,
        VuePhoneNumberInput
    },
    data() {
      return {
        progress:false,
        auth: [],
        successRegister:false,
        clientsNames: [],
        clientIds:[],
        tipeForm: '',
        configDate: {
            allowInput: true, 
            dateFormat: 'd-m-Y',
        },
        clientState: true,
        phoneData: {isValid: false},
        registerClient: {
            firstName:'',
            lastName:'',
            email:'',
            phone: {
                "countryCode": "CL", 
                "isValid": false, 
                "phoneNumber": "", 
                "countryCallingCode": "", 
                "formattedNumber": "", 
                "nationalNumber": "", 
                "formatInternational": "", 
                "formatNational": "", 
                "uri": "", 
                "e164": ""
            },
            instagram:'',
            valid:false,
            valid2:false,
            lastAttend: '',
            createdAt: '',
            _id: ''
        },
        modals: {
            modal1: false,
            modal2: false,
            modal3: false,
            message: "",
            icon: '',
            type:''
        },
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database,
                'x-access-token':localStorage.userToken
            }
        },
        clients: [],
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        columns: [
            {
                title: 'Nombre',
                dataIndex: 'firstName',
                key: 'firstName',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.firstName > b.firstName) {
                        return -1;
                    }
                    if (b.firstName > a.firstName) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.firstName.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Apellido',
                dataIndex: 'lastName',
                key: 'lastName',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.lastName > b.lastName) {
                        return -1;
                    }
                    if (b.lastName > a.lastName) {
                        return 1;
                    }
                    return 0;
                },
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.lastName.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Correo electrónico',
                dataIndex: 'email',
                key: 'email',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.email.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Número telefónico',
                dataIndex: 'phone.formatInternational',
                key: 'phone',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.phone.formattedNumber.toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'actions' }
            }
                                     ],  
      };
    },
    created(){
		this.getClients();
        this.getToken();
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
        },
        async getClients(){
            this.progress = false
            try {
                const getAllClients = await axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
                if (getAllClients.data.data.length > 0) {
                    this.clients = getAllClients.data.data

                    for (let index = 0; index < getAllClients.data.data.length; index++) {
                        this.clientsNames.push(getAllClients.data.data[index].firstName + " / " + getAllClients.data.data[index].email)
                        this.clientIds.push(getAllClients.data.data[index].firstName + " / " + getAllClients.data.data[index].email + "-" + getAllClients.data.data[index]._id)
                    }

                    this.progress = true
                    this.clientState = false
                }else{
                    this.clientState = false
                }
            }catch (err) {
                res.send(err)
            }
        },
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },
        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        generateExcel(){
            console.log('gola')
            var Data = []
            for (let index = 0; index < this.clients.length; index++) {
                const element = this.clients[index];
                Data.push({Nombre: element.firstName, Apellido: element.lastName, Email: element.email, 'Número de teléfono': element.phone, 'Instagram': element.instagram, Atenciones: element.attends, Recomendador: element.recommender, Recomendaciones: element.recommendations, 'Ultima atencion': this.$filter.formatDate(element.lastAttend), 'Cliente desde': this.$filter.formatDate(element.createdAt)})
            }
            var Datos = XLSX.utils.json_to_sheet(Data) 
            var wb = XLSX.utils.book_new() 
            XLSX.utils.book_append_sheet(wb, Datos, 'Datos') 
            XLSX.writeFile(wb, 'Clientes.xlsx') 
        },
        registerClients(){
            axios.post(endPoint.endpointTarget+'/clients', {
                firstName: this.registerClient.firstName,
                lastName: this.registerClient.lastName,
                email: this.registerClient.email,
                phone: this.phoneData,
                instagram: this.registerClient.instagram
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'client create') {
                    this.$swal({
                        icon: 'success',
                        title: 'Se registro cliente con éxito',
                        showConfirmButton: false,
                        timer: 2500
                    })
                    this.initialState(1)
                    this.getClients()
                    EventBus.$emit('reloadClients', 'reload')
                    
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'El cliente ya existe',
                        showConfirmButton: false,
                        timer: 2500
                    })
                }
            })
        },
        validRegister(){
            if (this.registerClient.firstName != '' && this.registerClient.lastName != '' && this.registerClient.email != '' && this.phoneData.isValid) {
                if (this.registerClient.email.split('@').length == 2) {
                    if (this.registerClient.email.split('@')[1].split('.').length == 2) {
                        this.registerClient.valid = true
                    }else{
                        this.registerClient.valid = false
                    }
                }else{
                    this.registerClient.valid = false
                }
            }
            else {
                this.registerClient.valid = false
            }
        },
        formatPhone(){
            var number = this.registerClient.contactOne.replace(/[^\d]/g, '')
            if (number.length == 9) {
                number = number.replace(/(\d{1})(\d{4})/, "$1-$2-");
            } else if (number.length == 10) {
                number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            }
            this.registerClient.contactOne = number
        },
        MaysPrimera(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
        },
        initialState(val){
            this.registerClient = {
                firstName:'',
                lastName:'',
                email:'',
                phone: {
                    "countryCode": "CL", 
                    "isValid": false, 
                    "phoneNumber": "", 
                    "countryCallingCode": "", 
                    "formattedNumber": "", 
                    "nationalNumber": "", 
                    "formatInternational": "", 
                    "formatNational": "", 
                    "uri": "", 
                    "e164": ""
                },
                instagram:'',
                valid:false,
                valid2:false,
                lastAttend: '',
                createdAt: '',
                _id: ''
            }
            if (val == 1) {
                this.modals = {
                    modal1:false,
                    modal2:false,
                    modal3:false,
                }
            }
            if (val == 2) {
                this.tipeForm = 'Registrar'
            }
            if (val == 3) {
                this.tipeForm = 'Editar'
            }
        },
        pushData(firstName, lastName, email, phone, instagram, lastAttend, createdAt, _id){
            console.log('entro')
            this.registerClient =  {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                instagram: instagram,
                valid: true,
                valid2: true,
                lastAttend: lastAttend,
                createdAt: createdAt,
                _id: _id
            }
            console.log(this.registerClient)
        },
        formatDate(date) {
            let dateFormat = new Date(date)
			return moment(dateFormat).format("DD-MM-YYYY")
        },
        formatDateTwo(date) {
            let dateFormat = new Date(date)
			return moment(dateFormat).format("MMMM Do YYYY")
        },
        deleteClient(id){
			this.$swal({
				title: '¿Está seguro de borrar el cliente?',
				text: 'No puedes revertir esta acción',
				type: 'warning',
                icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Estoy seguro',
				cancelButtonText: 'No, evitar acción',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
				if(result.value) {
					axios.delete(endPoint.endpointTarget+'/clients/'+id, this.configHeader)
					.then(res => {
                        if (res.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Cliente borrado con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            
                            this.getClients()
                            EventBus.$emit('reloadClients', 'reload')
						}
					})
				}
				else{
                    this.$swal({
                        icon: 'info',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
				}
			})
        },
        clientEdit(){
            axios.put(endPoint.endpointTarget+'/clients/'+this.registerClient._id, {
                firstName: this.registerClient.firstName,
                lastName: this.registerClient.lastName,
                email: this.registerClient.email,
                phone: this.registerClient.phone,
                instagram: this.registerClient.instagram,
            },this.configHeader)
            .then(res => {
                if (res.data.status == 'update client') {
                    this.$swal({
                        icon: 'success',
                        title: 'El cliente ha sido editado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    
                    this.getClients();
                    this.initialState(1)
                    EventBus.$emit('reloadClients', 'reload')
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'El email ya existe',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        showFilter(){
            $('.tableClient .vbt-table-tools').toggle()
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
        selectTemplate(select){
            this.modals = {
                modal1: false,
                modal2: false,
                modal3:false,
                message: "",
                icon: '',
                type: ''
            }
            setTimeout(() => {
               localStorage.setItem('selectTemplate', select)
                router.push({path: 'Correo'}) 
            }, 200);
			
		}
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 'auto' }
        }
    }
  };
</script>
<style lang="scss">
    .card-header{
        font-size: 2.5vw;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .positionAlert{
        position: absolute;
        top:14%;
        left: 32%;
        z-index: 100000;
    }
    .tableClient .vbt-table-tools{
        display:none;
    }
    .tableClient .vbt-table-tools .vbt-global-search .form-group{
        width: 30%;
    }
    .template{
		padding: 2px;
		// background-color: #e4e8ec;
		cursor: pointer;
		-webkit-transition: all 0.5s ease-out;
        opacity:.6;
	}
	.template:hover{
		background-color: rgb(90, 90, 90);
        opacity:1;
	}
    .vue-progress-path path {
        stroke-width: 12;
    }
    .vue-progress-path .progress {
        stroke:#00768c;
    }
    .vue-progress-path .background {
        stroke: transparent;
    }
</style>