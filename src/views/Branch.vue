<template>
    <div>
        <base-header class="header pb-3 pt-2 pt-lg-4 d-flex align-items-center"
                     style="min-height: 50px; background-image: url(img/theme/branch.png); background-size: cover; background-position: center 25%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Sucursales</p>
                        <p class="text-white hideText">Esta es la sección administrativa de tus sucursales, aquí podrás registrar, editar y visualizar todas tus sucursales.</p>
                    </div>
                    <base-button :disabled="validRoute('sucursales', 'registrar') ? false : true" class="float-right mt-7" size="sm" type="success" style="font-size:1em;" @click="modals.modal1 = true" ><a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" /> Registrar</base-button>
                </div>
            </div>
            
        </base-header>
        <a-config-provider :locale="es_ES">
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>Sin sucursales registrados.</h2>
                </div>
            </template>
            <a-table :columns="columns" :loading="progress" :data-source="branches" :scroll="getScreen">
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
                    <template slot="actionButtons" class="mx-auto" slot-scope="record, column">
                        <router-link v-if="validRoute('sucursales', 'configurar')" :to="{ path: '/configuration', query: { id: column._id }}">
                            <base-button :disabled="validRoute('sucursales', 'configurar') ? false : true" class="text-center" icon="ni ni-settings-gear-65" size="sm" type="default" >
                                Configurar
                            </base-button> 
                        </router-link>
                        <base-button v-else disabled class="text-center" icon="ni ni-settings-gear-65" size="sm" type="default" >
                            Configurar
                        </base-button>
                        <a-tooltip class="ml-2" placement="top">
                            <template slot="title">
                            <span>Activar / Desactivar</span>
                            </template>
                            <template v-if="validRoute('servicios', 'activaciones')">
                                <base-button class="text-center" v-if="column.active" icon="ni ni-check-bold" size="sm" type="success" v-on:click="changeStatus(column._id, true)"></base-button>
                                <base-button class="text-center" v-else size="sm" type="danger" v-on:click="changeStatus(column._id, false)">
                                    <a-icon type="close" style="vertical-align:1px;" />
                                </base-button> 
                    
                            </template>
                            <template v-else>
                                <base-button class="text-center" v-if="column.active" icon="ni ni-check-bold" size="sm" type="success" disabled></base-button>
                                <base-button class="text-center" v-else icon="ni ni-fat-remove" size="sm" type="danger" disabled></base-button> 
                            </template>
                        </a-tooltip> 
                </template>
                <template slot="format-date" slot-scope="record, column">
                    {{column.createdAt | formatDate}}
                </template>
            </a-table>
        </a-config-provider>
         <modal :show.sync="modals.modal1"
               modal-classes="modal-dialog-centered modal-xl pt-lg-2">
               <h6 slot="header" class="modal-title" id="modal-title-default">
                   <h3>Registre una sucursal</h3>
               </h6>
            <card type="secondary" shadow
                  header-classes="bg-white"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div class="stepsBar">
                        <a-steps>
                            <a-step :status="status.branch" title="Sucursal">
                                <a-icon style="vertical-align:3px;" slot="icon" :type="status.branch == 'process' ? 'loading' : 'shop'" />
                            </a-step>
                            <a-step :status="status.date" title="Agenda">
                                <a-icon style="vertical-align:3px;" slot="icon" :type="status.date == 'process' ? 'loading' : 'calendar'" />
                            </a-step>
                            <a-step :status="status.sale" title="Ventas">
                                <a-icon style="vertical-align:3px;" slot="icon" :type="status.sale == 'process' ? 'loading' : 'credit-card'" />
                            </a-step> 
                        </a-steps>
                    </div>
                    <div class="stepsBox mt-1">
                        <div v-if="process == 'branch'" class="branch mt-1">
                            <div class="row mt-2">
                                <div class="col-md-6 col-sm-12">
                                    <label class="ml-2" for="branch">
                                        Nombre de la sucursal
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Nombre de la sucursal"
                                        addon-left-icon="ni ni-shop"
                                        v-model="modelStart.businessName"
                                        :valid="modelStart.businessName.length >= 4 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-6 col-sm-12 row pr-0">
                                    <label class="ml-4 mb-0 pb-0 w-100" style="margin-bottom:-20px !important" for="credentials">
                                        Número de contacto
                                    </label>
                                    <div class="col-12 pl-3 pr-0 mt-0 pt-0">
                                        <VuePhoneNumberInput v-model="modelStart.businessPhone.formatNational" @update="modelStart.businessPhone = $event" 
                                        :default-country-code="modelStart.businessPhone.countryCode"
                                        :translations="{
                                            countrySelectorLabel: 'Código de país',
                                            countrySelectorError: 'Elije un país',
                                            phoneNumberLabel: 'Número de teléfono',
                                            example: 'Ejemplo :'
                                        }"/>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <a-tooltip>
                                        <template slot="title">
                                            Debe ser un correo valido
                                        </template>
                                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.05em;" type="question-circle" />
                                    </a-tooltip>
                                    <label class="ml-2" for="branch">
                                        Correo
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Correo de la sucursal"
                                        addon-left-icon="ni ni-email-83"
                                        @keyup="verifyEmail()"
                                        v-model="modelStart.email"
                                        :valid="verifyEmailVar">
                                    </base-input>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <label class="ml-2" for="branch">
                                        Logo de la sucursal
                                    </label><br>
                                    <input type="file" id="fileProfile" ref="file" v-on:change="handleFileUpload()" placeholder="seleccione logo" class="form-control input-group-alternative" />
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <label class="ml-2 w-100" for="location">
                                        Dirección del local
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Dirección"
                                        addon-left-icon="fa fa-location-arrow"
                                        v-model="modelStart.businessLocation"
                                        :valid="modelStart.businessLocation.length >= 10 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <label class="ml-2 w-100" for="bussiness">
                                        Tipo de negocio
                                    </label>
                                    <a-select
                                            show-search
                                            placeholder="Seleccionar negocio"
                                            option-filter-prop="children"
                                            style="width: 100%;height: 43px;"
                                            class="input-group-alternative"
                                            size="large"
                                            v-model="modelStart.businessType"
                                            :filter-option="filterOption"
                                            @change="handleChange"
                                        >
                                        <a-select-option value="nails">
                                            Spa de uñas
                                        </a-select-option>
                                        <a-select-option value="barber">
                                            Barberia
                                        </a-select-option>
                                        <a-select-option value="stylish">
                                            Peluquería
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                            <base-button outline type="default" class="float-right mt-2" v-on:click="nextStep('branch')">
                                Siguiente
                            </base-button>
                        </div>
                        <div v-else-if="process == 'date'" class="data">
                            <h1 class="text-uppercase text-center">
                                Horario
                            </h1>
                            <hr class="w-50">
                            <h3 class="text-weigth-bold text-center">
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>Seleccione los días y horarios de apertura y cierre de su negocio.</span>
                                    </template>
                                    <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                </a-tooltip>
                                Configura tu horario
                            </h3>
                            <div class="row pl-8 pr-4">
                                <div class="col-2">
                                    <base-button :type="days.monday" size="sm" class="mt-2 w-100" v-on:click="salectDay('monday')">
                                        Lunes
                                    </base-button>
                                    <base-button :type="days.tuesday" size="sm" class="mt-2 w-100" v-on:click="salectDay('tuesday')">
                                        Martes
                                    </base-button>
                                    <base-button :type="days.wednesday" size="sm" class="mt-2 w-100" v-on:click="salectDay('wednesday')">
                                        Miércoles
                                    </base-button>
                                    <base-button :type="days.thursday" size="sm" class="mt-2 w-100" v-on:click="salectDay('thursday')">
                                        Jueves
                                    </base-button>
                                    <base-button :type="days.friday" size="sm" class="mt-2 w-100" v-on:click="salectDay('friday')">
                                        Viernes
                                    </base-button>
                                    <base-button :type="days.saturday" size="sm" class="mt-2 w-100" v-on:click="salectDay('saturday')">
                                        Sábado
                                    </base-button>
                                    <base-button :type="days.sunday" size="sm" class="mt-2 w-100" v-on:click="salectDay('sunday')">
                                        Domingo
                                    </base-button>
                                </div>
                                <div class="col-10">
                                    <a-select :disabled="modelStart.blockHour[1].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[1].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[1].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[1].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[2].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[2].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[2].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[2].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    
                                    <a-select :disabled="modelStart.blockHour[3].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[3].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[3].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[3].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[4].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[4].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[4].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[4].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[5].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[5].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[5].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[5].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[6].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[6].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[6].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[6].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[0].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[0].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[0].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[0].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                            <base-button outline type="default" class="float-left mt-2" v-on:click="prevStep('date')">
                                Anterior
                            </base-button>
                            <base-button outline type="default" class="float-right mt-3" v-on:click="nextStep('date')">
                                Siguiente
                            </base-button>
                        </div>
                        <div v-else-if="process == 'sale'" class="data">
                            <h1 class="text-uppercase text-center">
                                Tipos de pago
                            </h1>
                            <hr class="w-50">
                            <h3 class="text-weigth-bold text-center">
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>Seleccione los días y horarios de apertura y cierre de su negocio.</span>
                                    </template>
                                    <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                </a-tooltip>
                                Crea tus tipos de pago
                            </h3>
                            <div class="row">
                                <div class="col-md-4">
                                    <label for="currency">
                                        Escriba su tipo de pago
                                    </label>
                                    <div class="row pr-2">
                                        <div class="col-10 pr-0">
                                            <base-input class="input-group-alternative"
                                                placeholder="Tipo de pago"
                                                addon-left-icon="fa fa-plus"
                                                v-model="typePay"
                                                v-on:keyup.enter="insertTypePay">
                                            </base-input>
                                        </div>
                                        <div class="col-2">
                                            <a-tooltip placement="topLeft">
                                                <template slot="title">
                                                    <span>Ingresar método de pago.</span>
                                                </template>
                                                <base-button outline type="default" class="p-2 px-3 mt-1" v-on:click="insertTypePay">
                                                    <a-icon style="vertical-align: 1px;" type="plus" />
                                                </base-button>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                    <label class="mt-4" for="currency">
                                        Seleccione su moneda local
                                    </label>
                                    <a-select class="input-group-alternative" default-value="CLP" style="width: 100%;height: 43px;" @change="selectCurrency" size="large">
                                        <a-select-option value="USD">
                                            USD
                                        </a-select-option>
                                        <a-select-option value="EUR">
                                            EUR
                                        </a-select-option>
                                        <a-select-option value="CLP" >
                                            CLP
                                        </a-select-option>
                                        <a-select-option value="COP">
                                            COP
                                        </a-select-option>
                                        <a-select-option value="ARG">
                                            ARG
                                        </a-select-option>
                                        <a-select-option value="VES">
                                            VES
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <a-config-provider :locale="es_ES">
                                    <template  #renderEmpty>
                                        <div style="text-align: center">
                                            <a-icon type="warning" style="font-size: 20px" />
                                            <p>No se han agregado metodos de pago</p>
                                        </div>
                                    </template>
                                    <div class="col-md-8 mt-4" style="overflow: hidden;overflow-y:scroll; max-height: 200px;">
                                        <a-list size="small" bordered :data-source="modelStart.typesPay">
                                            <a-list-item slot="renderItem" slot-scope="item, index">
                                                {{ item }} 
                                                <base-button outline type="default" v-if="item != 'Efectivo'" size="sm" class="float-right" v-on:click="removeTypePay(index)" style="margin-top: -3px;">
                                                    <i class="fa fa-times"></i>
                                                </base-button>
                                            </a-list-item>
                                        </a-list>
                                    </div>
                                </a-config-provider>
                            </div>
                            <base-button outline type="default" class="float-left mt-2" v-on:click="prevStep('sale')">
                                Anterior
                            </base-button>
                            <base-button outline type="default" class="float-right mt-3" v-on:click="finishProcess()">
                                Finalizar
                            </base-button>
                        </div>
                    </div>
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
// COMPONENTS
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import EventBus from '../components/EventBus'
//mixin
import mixinUserToken from '../mixins/mixinUserToken'
import mixinES from '../mixins/mixinES'
export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        VuePhoneNumberInput
    },
    data(){
        return {
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            phoneData: {isValid: false},
            modals: {
                modal1: false
            },
            status: {
                branch: 'process',
                date: 'wait',
                sale: 'wait'
            },
            process: 'branch',
            typePay: '',
            modelStart: {
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                branch: '',
                email: '',
                businessName: '',
                businessPhoneCode: '+56',
                businessPhone: {
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
                businessType: 'Seleccione',
                businessLocation: '',
                blockHour: [
                    {
                        day: 0,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 1,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 2,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 3,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 4,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 5,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 6,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    }
                ],
                currency: 'CLP',
                typesPay: [
                    'Efectivo'
                ]
            },
            fromArray: [
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
            ],
            toArray: [
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
                '15:30',
                '16:00',
                '16:30',
                '17:00',
                '17:30',
                '18:00',
                '18:30',
                '19:00',
                '19:30',
                '20:00',
                '20:30',
                '21:00',
                '21:30',
                '22:00',
                '22:30',
                '23:00',
            ],
            verifyEmailVar: false,
            progress: false,
            days: {
                monday: 'danger',
                tuesday: 'danger',
                wednesday: 'danger',
                thursday: 'danger',
                friday: 'danger',
                saturday: 'danger',
                sunday: 'danger'
            },
            searchText: '',
            searchInput: null,
            searchedColumn: '',
            branch: '',
            branchName: '',
            branches:[],
            columns: [
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.name
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: visible => {
                        if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                        }
                    },
                },
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    ellipsis: true,
                    scopedSlots: { customRender: 'format-date' },
                },
                {
                    title: 'Acciones',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'actionButtons' },
                    ellipsis: true,
                }
            ],
            file: '',
            activeBranchs:0
        }
    },
    created(){
        this.getToken()
        this.getBranch()
    },
    methods: {
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
            this.getBranches()
        },
        getToken(){
            const token = localStorage.userToken
            if (token.length > 0) {
                const decoded = jwtDecode(token)  
                this.auth = decoded.access
            }
        },
        dataEdit(id){
            console.log(id)
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
        async getBranches() {
            this.activeBranchs = 0
            try {
                const getBranches = await axios.get(endPoint.endpointTarget+'/branches', this.configHeader)
                if (getBranches.data.status == 'ok') {
                    this.branches = getBranches.data.data
                    this.branches.forEach(element => {
                        if (element.active) {
                            this.activeBranchs++
                        }
                    });
                }
                console.log(this.activeBranchs)
            }catch(err){
                console.log(err)
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        removeTypePay(index){
            this.modelStart.typesPay.splice(index, 1)
        },
        handleChange(value) {
            this.modelStart.businessType = value
        },
        salectDay(day){
            if (day == 'monday') {
                this.modelStart.blockHour[1].status = this.days.monday == 'success' ? false : true
                this.days.monday = this.days.monday == 'success' ? 'danger' : 'success'
            }else if (day == 'tuesday') {
                this.modelStart.blockHour[2].status = this.days.tuesday == 'success' ? false : true
                this.days.tuesday = this.days.tuesday == 'success' ? 'danger' : 'success'
            }else if (day == 'wednesday') {
                this.modelStart.blockHour[3].status = this.days.wednesday == 'success' ? false : true
                this.days.wednesday = this.days.wednesday == 'success' ? 'danger' : 'success'
            }else if (day == 'thursday') {
                this.modelStart.blockHour[4].status = this.days.thursday == 'success' ? false : true
                this.days.thursday = this.days.thursday == 'success' ? 'danger' : 'success'
            }else if (day == 'friday') {
                this.modelStart.blockHour[5].status = this.days.friday == 'success' ? false : true
                this.days.friday = this.days.friday == 'success' ? 'danger' : 'success'
            }else if (day == 'saturday') {
                this.modelStart.blockHour[6].status = this.days.saturday == 'success' ? false : true
                this.days.saturday = this.days.saturday == 'success' ? 'danger' : 'success'
            }else if (day == 'sunday') {
                this.modelStart.blockHour[0].status = this.days.sunday == 'success' ? false : true
                this.days.sunday = this.days.sunday == 'success' ? 'danger' : 'success'
            }
        },
        formatPhone(){
            var number = this.modelStart.businessPhone.replace(/[^\d]/g, '')
            if (number.length == 9) {
                number = number.replace(/(\d{1})(\d{4})/, "$1-$2-");
            } 
            // else if (number.length == 10) {
            //     number = number.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
            // }
            this.modelStart.businessPhone = number
        },
        verifyEmail(){
            if (this.modelStart.email.split('@')[1]) {
                if (this.modelStart.email.split('@')[1].split('.')[0]) {
                    this.verifyEmailVar = true
                }else{
                    this.verifyEmailVar = false
                }
            }else{
                this.verifyEmailVar = false
            }
            console.log(this.verifyEmailVar)
        },
        nextStep(step){
            if (step == 'branch') {
                if (this.modelStart.businessName.length >= 4 && this.modelStart.businessPhone.isValid && this.modelStart.businessLocation.length >= 10 && this.modelStart.businessType != 'Seleccione' && this.verifyEmailVar) {
                    this.status.branch = 'finish'
                    this.status.date = 'process'
                    this.process = 'date'
                }else if(!this.verifyEmailVar){
                    this.$swal({
                        icon: 'error',
                        title: 'El correo es invalido',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (this.modelStart.businessPhone.isValid == false) {
                    this.$swal({
                        icon: 'error',
                        title: 'Debe escribir un número de teléfono valido',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Ningún campo puede quedar en rojo',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else if(step == 'date'){
                const findDate = this.modelStart.blockHour.find(status => status.status == true)
                console.log(findDate)
                if (findDate != undefined) {
                    this.status.date = 'finish'
                    this.status.sale = 'process'
                    this.process = 'sale'
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe seleccionar mínimo un día.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else if(step == 'sale'){
                if (this.modelStart.typesPay.length > 0) {
                    this.status.sale = 'finish'
                    this.status.final = 'process'
                    this.process = 'final'
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe crear mínimo un tipo de pago.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else if(step == 'final'){
                this.status.branch = 'finish'
            }
        },
        changeStatus(id, valid){
            if (this.activeBranchs <=1 && valid) {
                this.$swal({
                    icon: 'error',
                    title: 'Debe haber al menos una sucursal activa',
                    text: 'La sucursal que intentas desactivar en la unica activa restante',
                    showConfirmButton: true
                })
            }else{
                axios.put(endPoint.endpointTarget+'/branches/changeActive/'+id, {
                    id: id
                }, this.configHeader)
                .then(res => {
                    this.getBranch()
                    EventBus.$emit('newBranch', status)
                    // this.emitMethod()
                })
                .catch(err => {
                    this.$swal({
                        icon: 'error',
                        title: 'Problemas tecnicos',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
            }
            
        },
        prevStep(step){
            if (step == 'date') {
                this.status.branch = 'process'
                this.status.date = 'wait'
                this.process = 'branch'
            }else if(step == 'sale'){
                this.status.date = 'process'
                this.status.sale = 'wait'
                this.process = 'date'
            }else if(step == 'final'){
                this.status.sale = 'process'
                this.status.final = 'wait'
                this.process = 'sale'
            }
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0]
        },
        insertTypePay(){
            if (this.modelStart.typesPay.length < 8) {
                if (this.typePay.length > 4) {
                    var findType = this.modelStart.typesPay.find(type => type == this.typePay)
                    if (findType == undefined) {
                        this.modelStart.typesPay.push(this.typePay)
                        this.typePay = ''
                    }else{
                        this.$swal({
                            icon: 'error',
                            title: 'Tipo de pago duplicado.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }else if (this.typePay.length <= 4) {
                    this.$swal({
                        icon: 'error',
                        title: 'El método de pago debe estar compuesto por mas de 4 caracteres',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe llenar el tipo de pago',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'No puede ingresar mas de 8 métodos de pago.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        removeTypePay(index){
            this.modelStart.typesPay.splice(index, 1)
        },
        selectCurrency(value){
            this.currency = value
        },
        validEmail(){
            const valid = this.modelStart.email.split('@')
            if(valid.length > 1){
                console.log(valid[1].includes('.'))
                return valid[1].includes('.')
            }else{
                return false
            }
        },
        calculatedHour(){
          for (const day of this.modelStart.blockHour) {
            var SumHours, SumMinutes, TotalMinutes
              if (day.status) {
                SumHours  = (parseInt(day.end.split(':')[0] - parseInt(day.start.split(':')[0])) * 60)
                SumMinutes = parseInt(day.start.split(':')[1]) - parseInt(day.end.split(':')[1])
                TotalMinutes = SumHours + SumMinutes
                day.time = TotalMinutes
              }
          }
        },
        createFormData(branch){
            var formData = new FormData()
            // formData.append('branch', branch)
            // formData.append('blockHour', this.modelStart.blockHour)
            // formData.append('businessName', this.modelStart.businessName)
            // formData.append('businessPhone', this.modelStart.businessPhone)
            // formData.append('businessType', this.modelStart.businessType)
            // formData.append('businessLocation', this.modelStart.businessLocation)
            // formData.append('email', this.modelStart.email)
            // formData.append('typesPay', this.modelStart.typesPay)
            // formData.append('currency', this.modelStart.currency)
            formData.append('image', this.file)
            return formData
        },
        async finishProcess(){
            this.calculatedHour()
            if (this.modelStart.typesPay.length > 1) {
                try {
                    const registerBranch = await axios.post(endPoint.endpointTarget+'/branches', {
                        branch: this.modelStart.businessName
                    }, this.configHeader)
                    if (registerBranch.data.status == 'ok') {
                        try {
                            var formData = new FormData()
                            formData.append('image', this.file)
                            const config = {headers: {'Content-Type': 'multipart/form-data', 'x-access-token': localStorage.userToken, "x-database-connect": endPoint.database }}
                            try {
                                const uploadImage = await axios.post(endPoint.endpointTarget+'/configurations/uploadLogo', formData, config)
                                if (uploadImage.data.status == 'ok') {
                                    const registerConf = await axios.post(endPoint.endpointTarget+'/configurations', {
                                        'branch': registerBranch.data.data._id,
                                        'blockHour': this.modelStart.blockHour,
                                        'businessName': this.modelStart.businessName,
                                        'businessPhone': this.modelStart.businessPhone,
                                        'businessType': this.modelStart.businessType,
                                        'businessLocation': this.modelStart.businessLocation,
                                        'route': endPoint.url,
                                        'email': this.modelStart.email,
                                        'typesPay': this.modelStart.typesPay,
                                        'currency': this.modelStart.currency,
                                        'file': uploadImage.data.file
                                    }, this.configHeader)
                                    if (registerConf.data.status == 'ok') {
                                        this.$swal({
                                            type: 'success',
                                            icon: 'success',
                                            title: 'Registro exitoso',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        this.getBranches()
                                        this.modals.modal1 = false
                                        EventBus.$emit('newBranch', status)
                                    }
                                }else{
                                    const registerConf = await axios.post(endPoint.endpointTarget+'/configurations', {
                                        'branch': registerBranch.data.data._id,
                                        'blockHour': this.modelStart.blockHour,
                                        'businessName': this.modelStart.businessName,
                                        'businessPhone': this.modelStart.businessPhone,
                                        'businessType': this.modelStart.businessType,
                                        'businessLocation': this.modelStart.businessLocation,
                                        'email': this.modelStart.email,
                                        'typesPay': this.modelStart.typesPay,
                                        'currency': this.modelStart.currency,
                                        'file': ''
                                    }, this.configHeader)
                                    if (registerConf.data.status == 'ok') {
                                        this.$swal({
                                            type: 'success',
                                            icon: 'success',
                                            title: 'Registro de la sucursal, exitoso.',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        this.getBranches()
                                        this.modals.modal1 = false
                                        EventBus.$emit('newBranch', status)
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                            
                        }catch(err){console.log(err)}
                    }else{
                       this.$swal({
                            type: 'error',
                            icon: 'error',
                            title: 'Sucursal ya existente',
                            showConfirmButton: false,
                            timer: 1500
                        }) 
                    }
                }catch(err){console.log(err)}
            }else{
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Registre al menos dos tipos de pago.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
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