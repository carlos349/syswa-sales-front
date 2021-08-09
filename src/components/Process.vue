<template>
    <a-spin size="large" :spinning="spinning">
        <div class="row spin-content">
            <div class="col-md-8 mb-3 separatorLeft">
                <div class="row p-0">
                    <div class="col-md-6 pl-4">
                        <label for="Client">Cliente</label><br>
                        <a-select
                            show-search
                            placeholder="Seleccione el cliente"
                            option-filter-prop="children"
                            :filter-option="filterOption"
                            :allowClear="true"
                            class="mb-2 w-75 clientSelect"
                            :class="screenWidthInput"
                            v-model="registerClient.select"
                            @change="chooseClient">
                            <a-select-option v-for="client of clients" :key="client._id" :value="client._id">
                                {{client.firstName}}
                            </a-select-option>
                        </a-select>
                        <a-button v-if="ifEdit" @click="modals.modal2 = true" class="ml-2" type="primary" shape="round">
                            <i class="fa fa-user-edit" style="font-size:1.5em;"></i>
                        </a-button>
                        <a-button v-else @click="modals.modal2 = true" class="ml-2" type="primary" shape="round">
                            <i class="fa fa-user-plus" style="font-size:1.5em;"></i>
                        </a-button>
                    </div>
                    <div class="col-md-3">
                        <label for="Client">Correo cliente</label>
                        <input readonly class="ant-input w-100" placeholder="Correo" v-model="registerClient.email"/>
                    </div>
                    <div class="col-md-3">
                        <label for="Client">Telefono cliente</label>
                        <input readonly class="ant-input w-100" placeholder="Telefono" v-model="registerClient.phone.formatInternational"/>
                    </div>
                </div>
                <a-date-picker class="ubicateDate"  @change="selectDate" :default-value="moment(new Date(), dateFormat)" :format="dateFormat" />
                <div class="card-container" style="margin-top:-30px;">
                    <a-tabs type="card">
                        <a-tab-pane key="1">
                            <span slot="tab">
                                <a-icon type="shopping" style="vertical-align: 1.5px;"/>
                                Productos
                            </span>
                            <div class="row p-2">
                                <div class="col-md-6">
                                    <label for="service" style="margin-bottom:0px">Producto</label>
                                    <a-select
                                        show-search
                                        placeholder="Seleccione el producto"
                                        option-filter-prop="children"
                                        :filter-option="filterOption"
                                        :allowClear="true"
                                        :disabled="readyClient"
                                        class="mb-2 pt-1 w-100 thisSelect"
                                        @change="chooseProduct"
                                        ref="serviceSelect">
                                        <a-select-option v-for="product of products" :key="product._id" :value="product._id">
                                            {{product.product}}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="col-md-6">
                                    <label for="quantity" style="margin-bottom:3px">Cantidad</label>
                                    <a-input @keyup="calculatedQuantity" :disabled="readyClient" class="w-100" type="number" placeholder="Cantidad" v-model="itemData.quantityProduct"/>
                                </div>
                                <div class="col-md-6">
                                    <label for="Client" style="margin-bottom:12px">Precio</label>
                                    <currency-input
                                        v-model="itemData.price"
                                        @keyup="changeRealPrice"
                                        locale="de"
                                        :disabled="readyClient"
                                        class="ant-input w-100 mb-3"
                                        style="margin-top:-10px;"
                                    />
                                </div>
                                <div class="col-md-6">
                                    <label for="Client" style="margin-bottom:6px">Descuento</label>
                                    <a-input @keyup="addDiscountFuncProduct" class="w-100" type="number" placeholder="Descuento" :disabled="itemData.discountServiceIf" v-model="itemData.discountService">
                                        <a-icon slot="suffix" type="percentage" style="vertical-align: 1.5px;" />
                                    </a-input>
                                </div>
                            </div>
                            <base-button @click="addItem('product')" class="float-right mt-1" size="sm" type="primary">Agregar item</base-button>
                        </a-tab-pane>
                    </a-tabs>
                </div>
                <a-config-provider>
                    <template #renderEmpty>
                        <div style="text-align: center">
                            <a-icon type="warning" style="font-size: 20px" />
                            <h2>No ha ingresado items</h2>
                        </div>
                    </template>
                    <!-- :scroll="getScreen" -->
                    <a-table :columns="columns" :loading="progress" :data-source="serviceSelecteds" :pagination="false" :scroll="getScreen" >
                        <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
                        <template slot="price-slot" slot-scope="record, column">
                            {{column.price | formatPrice}}
                            <!-- <currency-input
                                v-model="column.price"
                                locale="de"
                                class="ant-input w-100"
                            /> -->
                        </template>
                        <template slot="item-slot" slot-scope="record, column">
                            {{column.item.name}}
                        </template>
                        <template slot="discount-slot" slot-scope="record, column, index">
                            <a-input v-if="column.tag == 'service'" :disabled="column.ifDiscount" v-on:keyup="addDiscountTable(record, index)" v-model="column.discount">
                                <a-icon slot="suffix" type="percentage" style="vertical-align: 1.5px;" />
                            </a-input>
                            <a-input v-else :disabled="column.ifDiscount" v-on:keyup="addDiscountTableProduct(record, index)" v-model="column.discount">
                                <a-icon slot="suffix" type="percentage" style="vertical-align: 1.5px;" />
                            </a-input>
                        </template>
                        <template slot="additional-slot" slot-scope="record, column">
                            <template v-if="column.tag == 'service'">
                                {{column.additionalTotal | formatPrice}}
                            </template>
                            <template v-else>
                                Cantidad: {{column.quantityProduct}}
                            </template>
                        </template>
                        <template slot="total-slot" slot-scope="record, column">
                            {{column.total | formatPrice}}
                        </template>
                        <template slot="actionRemove" slot-scope="record, column, index">
                            <base-button @click="removeItem(index)" size="sm" type="danger">
                                <a-icon type="minus-circle" style="vertical-align:1.5px;" />
                            </base-button>
                        </template>
                    </a-table>
                </a-config-provider>
            </div>
            <div class="col-md-4">
                <h3>Métodos de pago</h3>
                <div class="row">
                    <template v-if="typesPay.length > 0">
                        <div class="col-md-6 mt-1" v-for="(pay, index) in typesPay" :key="pay.type">
                            <a-button :disabled="serviceSelecteds.length > 0 ? false : true" @click="selectPay(index)" class="w-100" type="primary" :ghost="pay.click">
                                <a-icon class="ml-2" type="plus-square" style="vertical-align: 1.5px;" />
                                {{pay.type}}
                            </a-button>
                        </div>
                    </template>
                </div>
                <!-- <label for="order" class="mt-2"><b>Total envío</b></label> -->
                <h3 class="mt-1">Despacho</h3>
                <currency-input
                    :disabled="serviceSelecteds.length > 0 ? false : true"
                    v-on:keyup="addShippingPrice"
                    v-model="shipping"
                    locale="de"
                    class="ant-input w-100 mb-2"
                />
                <hr class="mt-1 mb-1">
                <label for="type" class="mt-2"><b>Tipo</b></label>
                <a-input class="w-100 mb-2" placeholder="Método de pago" :disabled="serviceSelecteds.length > 0 ? false : true" v-model="payment.type">
                    <a-icon slot="preffix" type="credit-card" style="vertical-align: 1.5px;" />
                </a-input>
                <label for="type"><b>Total</b></label>
                <currency-input
                    :disabled="serviceSelecteds.length > 0 ? false : true"
                    v-model="payment.total"
                    locale="de"
                    class="ant-input w-100 mb-2"
                />
                <a-button @click="addPayment()" :disabled="serviceSelecteds.length > 0 ? false : true" type="primary" class="float-right w-50">
                    Agregar pago
                </a-button>
                
                <a-config-provider>
                    <template #renderEmpty>
                        <div style="text-align: center">
                            <a-icon type="warning" style="font-size: 20px" />
                            <h2>No ha ingresado métodos de pago</h2>
                        </div>
                    </template>
                    <a-list class="mt-5" bordered :data-source="paysSelecteds">
                        <a-list-item slot="renderItem" slot-scope="item, index">
                            {{item.type}}: {{ item.total | formatPrice }} 
                            <a-button style="margin-top:-6px;" @click="removePay(index)" type="danger" class="float-right">
                                <a-icon type="close-circle" style="vertical-align: 1.5px;"/>
                            </a-button>
                        </a-list-item>
                    </a-list>
                </a-config-provider>
                <hr class="mt-2 mb-1">
                <h3>Pagado: {{totalPay | formatPrice}}</h3>
                <h3>Total: {{totalSale | formatPrice}}</h3>
                <p><b>Por pagar: </b>{{showPerPay(perPay) | formatPrice}} | <b>Vuelto: {{restPay | formatPrice}}</b></p>
                <a-button @click="proccessSale" style="margin-top:-10px;" :disabled="serviceSelecteds.length > 0 ? false : true" :loading="ifProccess" type="primary" class="float-right">
                    Procesar
                    <a-icon type="shopping" style="vertical-align: 1.5px;"/>
                </a-button>
            </div>
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
                <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                    header-classes="bg-white pb-5"
                    body-classes="px-lg-5"
                    class="border-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h1>Datos del cliente</h1> 
                    </div>
                </template>
                <template>
                    <form role="form">
                            <base-input alternative
                                class="mb-3"
                                placeholder="Nombre"
                                v-model="registerClient.firstName"
                                v-on:keyup="validRegister(2)"
                                addon-left-icon="ni ni-single-02">
                            </base-input>
                            <base-input alternative
                                class="mb-3"
                                placeholder="Segundo nombre"
                                v-model="registerClient.lastName"
                                v-on:keyup="validRegister(2)"
                                addon-left-icon="ni ni-single-02">
                            </base-input>
                            <base-input alternative
                                type="text"
                                placeholder="Correo"
                                v-model="registerClient.email"
                                v-on:keyup="validRegister(2)"
                                addon-left-icon="fa fa-address-card">
                            </base-input>
                            <div class="col-12 mb-4 p-0">
                                <VuePhoneNumberInput 
                                v-model="registerClient.phone.formatNational" 
                                @update="phoneData = $event, registerClient.phone = $event, validRegister(2)" 
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
                                addon-left-icon="fa fa-address-card">
                            </base-input>
                            <div class="text-center">
                                <base-button type="default" :disabled="registerClient.valid ? false : true" v-on:click="registerClients()" v-if="!ifEdit" class="my-4">Registrar</base-button>
                                <base-button type="default" v-on:click="editClient()" v-if="ifEdit" class="my-4">Editar</base-button>
                            </div> 
                        </form>
                </template>
            </card>
            </modal>
            <modal :show.sync="modals.modal4"
                body-classes="p-2"
                modal-classes="modal-dialog-centered modal-sm">
                <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
                <!-- <card type="secondary" shadow -->
                    <!-- header-classes="bg-white pb-2"
                    body-classes="px-lg-2 py-lg-2"
                    class="border-0"> -->
                    <template>
                        <div class="text-muted text-center mb-3">
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
                            <base-button v-if="!cashFunds.valid" class="float-right" type="default" disabled>
                                Ingresar fondo
                            </base-button>
                            <base-button v-else type="default" class="float-right" v-on:click="registerFund">
                                Ingresar fondo
                            </base-button> 
                        </form>
                </template>
                <!-- </card> -->
            </modal>
            <modal :show.sync="modals.modal5"
                body-classes="p-0"
                modal-classes="modal-dialog-centered modal-md">
                <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
                <card type="secondary" shadow
                    header-classes="bg-white pb-5"
                    body-classes="px-lg-5 "
                    class="border-0">
                    <template>
                        <div style="margin-top:-10%" class="text-muted text-center mb-3">
                            <h3>Validación de código</h3>
                        </div>
                    </template>
                    <template>
                        <form role="form">
                            <base-input 
                                alternative
                                class="mb-3"
                                placeholder="Código"
                                v-model="codeArticulo"
                                addon-left-icon="ni ni-key-25">
                            </base-input>
                            
                            
                            <base-button type="default" v-on:click="validCode()">
                                Verificar
                            </base-button> 
                        </form>
                </template>
                </card>
            </modal>
            <modal :show.sync="modals.modal6"
                body-classes="p-0"
                modal-classes="modal-dialog-centered modal-md">
                <card type="secondary" shadow
                    header-classes="bg-white pb-5"
                    body-classes="px-lg-5 py-lg-5"
                    class="border-0">
                    <template>
                        <div class="col-sm-12">
                            <base-button class="col-12  p-2 mt-1" type="secondary">
                                <span class="text-center"> Comprador <br> </span>
                                <badge style="font-size:0.8em !important" type="success" class="text-default mt-2">{{compradorArticulo}}</badge>
                            </base-button>
                            <base-button class="col-12  p-2 mt-1" type="secondary">
                                <span class="text-center"> Medio de pago <br> </span>
                                <badge style="font-size:0.8em !important" type="success" class="text-default mt-2">{{medioPagoArticulo}}</badge>
                            </base-button>
                            <base-button class="col-12  p-2 mt-1" type="secondary">
                                <span class="text-center"> Articulo <br> </span>
                                <badge style="font-size:0.8em !important" type="success" class="text-default mt-2">{{articulo}}</badge>
                            </base-button>
                            <base-button class="col-12  p-2 mt-1" type="secondary">
                                <span class="text-center"> Monto del pedido <br> </span>
                                <badge style="font-size:0.8em !important" type="success" class="text-default mt-2">{{totalArticulo}}</badge>
                            </base-button>
                            <base-button class="col-12  p-2 mt-1" type="secondary">
                                <span class="text-center"> Estado <br> </span>
                                <badge v-if="estadoArticulo == 'Nconfirmado'" style="font-size:0.8em !important" type="danger" class="text-default mt-2">Sin confirmar</badge>
                                <badge v-else-if="estadoArticulo == 'confirmado'" style="font-size:0.8em !important" type="success" class="text-default mt-2">confirmado</badge>
                                <badge v-else style="font-size:0.8em !important" type="default" class="text-default mt-2">Usado</badge>
                            </base-button>
                        </div>
                        <center>
                            <base-button v-if="estadoArticulo == 'confirmado'" type="success" class="mt-5" v-on:click="verifyCode()">
                                Validar
                            </base-button>
                            <base-button v-else type="default" disabled class="mt-5">
                                Validar
                            </base-button> 
                        </center>
                    </template>
                </card>
            </modal>
            <!-- <div v-if="validRoute('procesar', 'nuevo_cliente')" v-bind:style="{  'height': '45px', 'z-index' : '1000' }" v-on:click="modals.modal2 = true" class="p-2 menuVerVentas navSVenta" v-on:mouseenter="mouseOverVenta(newClient)" v-on:mouseleave="mouseLeaveVenta(newClient)">
                <div class="row">
                    <div class="col-2 pt-1">
                        <font-awesome-icon v-if="ifEdit" class="icons" style="color:#172b4d;font-size:1em" icon="user-edit" />
                        <font-awesome-icon v-else class="icons" style="color:#172b4d;font-size:1em" icon="user-plus" />
                    </div>
                    <div v-if="newClient.valid" class="col-9 pl-4 pt-1">
                        <b style="font-size:14px;">{{newClient.text}}</b>	
                    </div>
                </div>	
            </div>
            <div v-else v-bind:style="{  'height': '45px', 'z-index' : '1000' }" class="p-2 navSVenta">
                <div class="row">
                    <div class="col-2 pt-1">
                        <font-awesome-icon v-if="ifEdit" class="icons" style="color:#f5365c;font-size:1em" icon="user-edit" />
                        <font-awesome-icon v-else class="icons" style="color:#f5365c;font-size:1em" icon="user-plus" />
                    </div>
                    <div v-if="newClient.valid" class="col-9 pl-4 pt-1">
                        <b style="font-size:14px;">{{newClient.text}}</b>	
                    </div>
                </div>	
            </div>
            <div v-if="validRoute('procesar', 'nuevo_servicio')" v-bind:style="{  'height': '45px', 'z-index' : '1000' }" v-on:click="modals.modal3 = true" class="p-2 menuVerServi navSServi" v-on:mouseenter="mouseOverVenta(newService)" v-on:mouseleave="mouseLeaveVenta(newService)">
                <div class="row">
                    <div class="col-2 pt-1">
                        <font-awesome-icon class="icons" style="color:#172b4d;font-size:1em" icon="folder-plus" />
                    </div>
                    <div v-if="newService.valid" class="col-9 pl-4 pt-1">
                        <b style="font-size:14px;">{{newService.text}}</b>	
                    </div>
                </div>
            </div>
            <div v-else v-bind:style="{  'height': '45px', 'z-index' : '1000' }" class="p-2 navSServi">
                <div class="row">
                    <div class="col-2 pt-1">
                        <font-awesome-icon class="icons" style="color:#f5365c;font-size:1em" icon="folder-plus" />
                    </div>
                    <div v-if="newService.valid" class="col-9 pl-4 pt-1">
                        <b style="font-size:14px;">{{newService.text}}</b>	
                    </div>
                </div>
            </div>
            <div v-bind:style="{  'height': '45px', 'z-index' : '1000' }" v-on:click="initialState()" class="p-2 menuVerRedo navSRedo" v-on:mouseenter="mouseOverVenta(reloadSales)" v-on:mouseleave="mouseLeaveVenta(reloadSales)">
                <div class="row">
                    <div class="col-2 pt-1">
                        <font-awesome-icon class="icons" style="color:#172b4d;font-size:1em" icon="redo" />
                    </div>
                    <div v-if="reloadSales.valid" class="col-10 pl-4 pt-1">
                        <b style="font-size:14px;">{{reloadSales.text}}</b>	
                    </div>
                </div>
            </div>
            <div v-bind:style="{  'height': '42px', 'z-index' : '1000' }" v-on:click="modals.modal5 = true, codeArticulo = ''" class="p-2 menuVerRedo navSCode" v-on:mouseenter="mouseOverVenta(reloadSales)" v-on:mouseleave="mouseLeaveVenta(reloadSales)">
                <div class="row">
                    <div class="col-2 pt-1">
                        <font-awesome-icon class="icons" style="color:#172b4d;font-size:1em" icon="pager" />
                    </div>
                    <div v-if="reloadSales.valid" class="col-10 pl-4 pt-1">
                        <b style="font-size:14px;">Validar código</b>	
                    </div>
                </div>
            </div> -->
        </div>
    </a-spin>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode'
import io from 'socket.io-client';
import EventBus from './EventBus'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
export default {
    components: {
        vueCustomScrollbar,
        flatPicker,
        VuePhoneNumberInput
    },
    data(){
        return {
            socket: io(endPoint.endpointTarget),
            auth: [],
            dateToday: new Date(),
            validator:true,
            validatorBtn:true,
            spinning:false,
            moment: moment,
            modals: {
                modal1: false,
                modal2: false,
                modal3: false,
                modal4: false,
                modal5: false,
                modal6: false,
                message: "",
                icon: '',
                type:''
            },
            shipping: 0,
            priceService: 0,
            priceServiceReal: 0,
            discountService: '',
            discountServiceIf: false,
            typesPay: [],
            payment: {
                type: '',
                total: 0
            },
            configHeader: {
                headers: {
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            configDate: {
                allowInput: true, 
                dateFormat: 'd-m-Y',
            },
            registerClient: {
                firstName: '',
                lastName: '',
                email: '',
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
                instagram: '',
                select: 'Seleccione',
                valid: false,
            },
            articulo:'',
            compradorArticulo:'',
            medioPagoArticulo:'',
            estadoArticulo:'',
            idArticulo:'',
            codeArticulo:'',
            totalArticulo:'',
            cashFunds: {
                cashName: '',
                cashAmount: 0,
                valid: false,
            },
            dateFormat: 'DD/MM/YYYY',
            registerService: {
                serviceRegister: '',
                comissionRegister: '',
                priceRegister: 0,
                timeRegister: 'Seleccione el tiempo',
                addDiscount: false,
                lenderSelecteds: [],
                lenders: [],
                valid:false
            },
            columnsLender: [{
                label: "Nombre",
                name: "firstName",
                // filter: {
                //     type: "simple",
                //     placeholder: "id"
                // },
                sort: true,
            }],
            progress: false,
            columns: [
                {
                    title: 'Item',
                    dataIndex: 'item',
                    key: 'item',
                    width: '20%',
                    ellipsis: true,
                    scopedSlots: { customRender: 'item-slot' }
                },
                {
                    title: 'Precio',
                    dataIndex: 'price',
                    key: 'price',
                    width: '15%',
                    ellipsis: false,
                    scopedSlots: { customRender: 'price-slot' }
                },
                {
                    title: 'Descuento',
                    dataIndex: 'discount',
                    key: 'discount',
                    width: '15%',
                    ellipsis: false,
                    scopedSlots: { customRender: 'discount-slot' }
                },
                {
                    title: 'Cantidad',
                    dataIndex: 'quantityProduct',
                    key: 'quantityProduct',
                    width: '15%',
                    ellipsis: false
                },
                {
                    title: 'Total',
                    dataIndex: 'total',
                    key: 'total',
                    width: '20%',
                    ellipsis: true,
                    scopedSlots: { customRender: 'total-slot' }
                },
                {
                    title: '',
                    dataIndex: 'id',
                    key: 'id',
                    width: '10%',
                    ellipsis: false,
                    scopedSlots: { customRender: 'actionRemove' }
                }
            ],
            configLender: {
                checkbox_rows: true,
                rows_selectable : true,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                rows_selectable: true,
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : true,
                pagination_info : false,
                pagination: false,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: true,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            classes: {
                table: "table-bordered table-striped"
            },
            readyClient: true,
            clientNames: [],
            clientIds: [],
            clients: [],
            clientSelect: null,
            lenderNames: [],
            lenderSelect: null,
            services: [],
            inspector: false,
            countServices: [],
            price: 0,
            discount: '',
            design: 0,
            payOrder:0,
            haveCode:false,
            subTotal: 0,
            total: 0,
            discountSelect: "Descuento",
            totalSinFormato:0,           
            serviciosSelecionados:[],
            resto: 0,
            dates: {
                dateSale: new Date()
            },
            idProcess: '',
            docLender: '',
            newClient: {
                valid: false,
                text: 'Nuevo cliente'
            },
            newService: {
                valid: false,
                text: 'Nuevo servicio'
            },
            reloadSales: {
                valid: false,
                text: 'Reiniciar datos'
            },
            ifEdit: false, 
            inspectorDate: false,
            editClientId: '',
            ifrecomend: false,
            branchName: '',
            branch: '',
            microservices: [],
            microSelect: {
                name: '',
                price: 0
            },
            ifProccess: false,
            quantityMicro: 1,
            microserviceSelecteds: [],
            serviceSelecteds: [],
            datesFinally: [],
            itemData: {
                item: {},
                price: 0,
                realPrice: 0,
                discountServiceIf: false,
                discountService: '',
                employe: {
                    id: '',
                    name: '',
                    document: ''
                },
                quantityProduct: '',
                commission: 0
            },
            totalSale: 0,
            products: [],
            perPay: 0,
            restPay: 0,
            totalPay: 0,
            paysSelecteds: [],
            microValid: true
        }
    },
    created(){
        this.getToken()
        this.getClient()
        this.getTypesPay()
        this.getProducts()
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
        },
        changeDate(){
            this.inspectorDate = true
        },
        async getTypesPay(){
            try {
                const pays = await axios.get(endPoint.endpointTarget+'/sales/getConfiguration', this.configHeader)
                    console.log(pays)
                if (pays.data.status == 'ok') {
                    console.log(pays)
                    for (const element of pays.data.data[0].typesPay) {
                        this.typesPay.push({
                            type: element,
                            total: 0,
                            click: true
                        })
                    }
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
        validRegister(valid){
            if (valid == 1) {
                this.registerService.valid = this.registerService.lenderSelecteds.length > 0 && this.registerService.serviceRegister != '' && this.registerService.priceRegister > 0 && this.registerService.timeRegister != 'Seleccione el tiempo' && this.registerService.comissionRegister != '' ? true : false
            }else if (valid == 2) {
                if (this.registerClient.firstName != '' && this.registerClient.lastName != '' && this.registerClient.email != '') {
                    if (this.registerClient.email.split('@').length == 2) {
                        if (this.registerClient.email.split('@')[1].split('.').length == 2) {
                            this.registerClient.valid = true
                        }else{
                            this.registerClient.valid = false
                        }
                    }else{
                        this.registerClient.valid = false
                    }
                }else{
                    this.registerClient.valid = false
                }
            }else{
                this.cashFunds.valid = this.cashFunds.cashName != '' && this.cashFunds.cashAmount > 0 ? true : false
            }
        },
        registerFund(){
			axios.post(endPoint.endpointTarget+'/sales/registerFund', {
				userRegister: this.cashFunds.cashName,
				amount: this.cashFunds.cashAmount
			}, this.configHeader).then(res => {
				if (res.data.status == 'ok') {
                    this.$swal({
                        icon: 'success',
                        title: 'Monto de caja registrado.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.modals.modal4 = false
                    this.cashFunds.cashName = ''
                    this.cashFunds.cashAmount = ''
                    this.cashFunds.valid = false
				}
			})
        },
        editClient(){
            axios.put(endPoint.endpointTarget+'/clients/'+this.editClientId, {
                firstName: this.registerClient.firstName,
                lastName: this.registerClient.lastName,
                email: this.registerClient.email,
                phone: this.registerClient.phone,
                instagram: this.registerClient.instagram
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'update client') {
                    this.$swal({
                        icon: 'success',
                        title: 'El cliente se editó con éxito.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.modals.modal2 = false
                    this.getClient()
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'El cliente ya existe.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        registerClients(){
            axios.post(endPoint.endpointTarget+'/clients', {
                firstName: this.registerClient.firstName,
                lastName: this.registerClient.lastName,
                email: this.registerClient.email,
                phone: this.registerClient.phone.isValid ? this.registerClient.phone : '',
                instagram: this.registerClient.instagram
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'client create') {
                    this.$swal({
                        icon: 'success',
                        title: 'Cliente registrado.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.registerClient.select = this.registerClient.firstName
                    this.readyClient = false
                    this.ifEdit = true
                    this.modals.modal2 = false
                    this.getClient()
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'El cliente ya existe.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        mouseOverVenta(objectType){
            setTimeout(() => {
               objectType.valid = true 
            }, 500);
             
		},
		mouseLeaveVenta(objectType){
            objectType.valid = false
		},
        async getClient(){
            try {
                const getClient = await axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
                if (getClient.data.status == 'ok') {
                    this.clients = getClient.data.data
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
        async getProducts(){
            this.productState = true
            const getProducts = await axios.get(`${endPoint.endpointTarget}/products`, this.configHeader)
            if (getProducts.data.status == 'ok') {
                this.products = getProducts.data.data
            }else{
                this.products = []
            }
        },
        addItem(type, index){
            if (this.itemData.quantityProduct == '') {
                this.itemData.quantityProduct = 0
            }
            var total = 0
            var additionals = ''
            for (const micro of this.microserviceSelecteds) {
                total = total + parseFloat(micro.price)
                additionals = additionals == '' ? micro.name : additionals + ', '+micro.name 
            }
            var description = this.itemData.tag == 'service' ? `Servicio: ${this.itemData.item.name} | Empleado: ${this.itemData.employe.name} | Adicionales: ${additionals}` : `${this.itemData.quantityProduct == 0 || this.itemData.quantityProduct == '' ? 1 : this.itemData.quantityProduct}) ${this.itemData.item.measure}`

            const commissionEmploye = this.itemData.tag == 'service' ? (this.itemData.price + (total * 0.50)) * parseFloat('0.'+this.itemData.commission) : 'none'
            if (this.itemData.item.name && this.itemData.realPrice > 0 && this.itemData.price > 0 && this.itemData.tag != '') {
                var valid = false
                if (this.itemData.tag == 'service') {
                    valid = this.itemData.employe.name != '' ? true : false
                }else{
                    valid = true
                }
                if (valid) {
                    this.serviceSelecteds.push({
                        item: this.itemData.item,
                        price: this.itemData.realPrice,
                        discount: this.itemData.discountService == '' ? 0 : this.itemData.discountService,
                        additionalTotal: total,
                        additionals: this.microserviceSelecteds,
                        ifDiscount: this.itemData.discountServiceIf,
                        total: this.itemData.price + total,
                        commission: this.itemData.commission,
                        commissionEmploye: commissionEmploye,
                        totalLocal: this.itemData.tag == 'service' ? (this.itemData.price - commissionEmploye) + (total * 0.50) : (this.itemData.price * 0.50),
                        quantityProduct: this.itemData.tag != 'service' ? this.itemData.quantityProduct == 0 || this.itemData.quantityProduct == '' ? 1 : this.itemData.quantityProduct : 'none',
                        productsService: this.itemData.item.products ? this.itemData.item.products : [],
                        tag: this.itemData.tag,
                        employe: this.itemData.tag == 'service' ? this.itemData.employe : 'none',
                        description: description,
                        datesItem: 'none',
                        id: 'none'
                    })
                    this.itemData = {
                        item: {},
                        price: 0,
                        realPrice: 0,
                        discountServiceIf: false,
                        discountService: '',
                        employe: {
                            id: '',
                            name: '',
                            document: ''
                        },
                        quantityProduct: '',
                        commission: 0,
                        tag: ''
                    }
                    this.calculatedTotal()
                    this.microserviceSelecteds = []
                    console.log(this.serviceSelecteds)
                    $('.thisSelect .ant-select-selection__clear').click()
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe llenar todos los campos',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'Debe llenar todos los campos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        addShippingPrice(){
            this.calculatedTotal()
        },
        calculatedTotal(){
            console.log("calculatedTotal")
            var total = 0
            for (const items of this.serviceSelecteds) {
                total = total + items.total
            }
            this.totalSale = total + parseFloat(this.shipping == '' ? 0 : this.shipping )
            this.perPay = this.totalSale - this.totalPay
            this.restPay = this.perPay < 0 ? Math.abs(this.perPay) : 0
        },
        removeItem(key){
            const id = this.serviceSelecteds[key].id
            if (this.serviceSelecteds[key].datesItem != 'none') {
                var splices = new Array()
                this.datesFinally.push(this.serviceSelecteds[key].datesItem)
                for (const index in this.serviceSelecteds) {
                    const service = this.serviceSelecteds[index]
                    if (id == service.id) {
                        splices.push(index)
                    }
                }
                this.serviceSelecteds.splice(splices[0], splices.length)
            }else{
                this.serviceSelecteds.splice(key, 1)
            }
            
            this.calculatedTotal()
            if (this.serviceSelecteds.length == 0) {
                this.paysSelecteds = []
                this.perPay = 0
                this.totalPay = 0
                this.restPay = 0
            }
        },
        showPerPay(value){
            return value < 0 ? 0 : value
        },
        selectPay(key){
            for (const pay of this.typesPay) {
                pay.click = true
            }
            this.typesPay[key].click = false
            this.payment.type = this.typesPay[key].type
            this.payment.total = this.perPay
        },
        addPayment(){
            for (const pay of this.typesPay) {
                pay.click = true
            }
            var valid = true
            for (const pay of this.paysSelecteds) {
                if (pay.type == this.payment.type) {
                    pay.total = pay.total + this.payment.total
                    valid = false
                    break
                }
            }
            if (valid) {
                this.paysSelecteds.push({
                    type: this.payment.type,
                    total: this.payment.total
                })
            }
            var total = 0
            for (const pay of this.paysSelecteds) {
                total = total + pay.total
            }
            this.totalPay = total
            this.calculatedTotal()
            this.payment.type = ''
            this.payment.total = 0
        },
        removePay(key){
            this.totalPay = this.totalPay - this.paysSelecteds[key].total
            this.paysSelecteds.splice(key, 1)
            this.calculatedTotal()
        },
        addDiscountFunc(){
            console.log("addDiscountFunc")
            var discount = this.itemData.discountService < 10 ? '0'+this.itemData.discountService : this.itemData.discountService
            if (this.itemData.discountService != '') {
                this.itemData.price = this.itemData.realPrice - (this.itemData.realPrice * parseFloat('0.'+discount))
            }else{
                this.itemData.price = this.itemData.realPrice
            }
        },
        addDiscountFuncProduct(){
            
            var quantity = this.itemData.quantityProduct == 0 || this.itemData.quantityProduct == '' ? 1 : this.itemData.quantityProduct
            var discount = this.itemData.discountService < 10 ? '0'+this.itemData.discountService : this.itemData.discountService
            if (this.itemData.discountService != '') {
                this.itemData.price = (this.itemData.realPrice * quantity) - ((this.itemData.realPrice * quantity) * parseFloat('0.'+discount))
            }else{
                this.itemData.price = this.itemData.realPrice * quantity
            }
        },
        calculatedQuantity(){
            console.log("run this")
            if (this.itemData.quantityProduct != '') {
                if (this.itemData.quantityProduct == 0) {
                    this.itemData.price = this.itemData.realPrice
                }else{
                    this.itemData.price = this.itemData.realPrice * this.itemData.quantityProduct
                }  
            }else{
                this.itemData.price = this.itemData.realPrice
            }
        },
        changeRealPrice(){
            this.itemData.quantityProduct = ''
            this.itemData.realPrice = this.itemData.price
        },
        addDiscountTable(record, key){
            console.log("addDiscountTable")
            var discount = record < 10 ? '0'+record : record
            if (this.serviceSelecteds[key].discount > 0) {
                this.serviceSelecteds[key].total = this.serviceSelecteds[key].price - (this.serviceSelecteds[key].price * parseFloat('0.'+discount)) + this.serviceSelecteds[key].additionalTotal
            }else{
                this.serviceSelecteds[key].total = this.serviceSelecteds[key].price + this.serviceSelecteds[key].additionalTotal
            }
            this.calculatedTotal()
        },
        addDiscountTableProduct(record, key){
            console.log("addDiscountTableProduct")
            var discount = record < 10 ? '0'+record : record
            if (this.serviceSelecteds[key].discount > 0) {
                this.serviceSelecteds[key].total = (this.serviceSelecteds[key].price * this.serviceSelecteds[key].quantityProduct) - ((this.serviceSelecteds[key].price * this.serviceSelecteds[key].quantityProduct) * parseFloat('0.'+discount))
            }else{
                this.serviceSelecteds[key].total = this.serviceSelecteds[key].price * this.serviceSelecteds[key].quantityProduct
            }
            this.calculatedTotal()
        },
        async chooseProduct(value){
            console.log("chooseProduct")
            if (value) {
                try {
                    const product = await axios.get(`${endPoint.endpointTarget}/products/${value}`, this.configHeader)
                    console.log(product)
                    if (product.data.data.quantity <= 0) {
                        this.$swal({
                            title: 'El producto está agotado',
                            html: '<p style="font-size:1.4em;">¿Deseas hacer la venta?</p><p style="font-size:0.8em;">su inventario quedará en negativo</p>',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí',
                            cancelButtonText: 'No, cancelar',
                            showCloseButton: true,
                            showLoaderOnConfirm: true
                        }).then((result) => {
                            if (result.value) {
                                product.data.data.name =  product.data.data.product
                                this.itemData.item = product.data.data
                                this.itemData.price = product.data.data.price
                                this.itemData.realPrice = product.data.data.price
                                this.itemData.discountServiceIf = false
                                this.itemData.commission = 0
                                this.itemData.tag = 'product'
                            }else{
                                this.$swal({
                                    icon: 'info',
                                    title: 'No se selecciono el producto',
                                    showConfirmButton: false,
                                    timer: 1000
                                })
                                $('.thisSelect .ant-select-selection__clear').click()
                            }
                        })
                    }else{
                        product.data.data.name =  product.data.data.product
                        this.itemData.item = product.data.data
                        this.itemData.price = product.data.data.price
                        this.itemData.realPrice = product.data.data.price
                        this.itemData.discountServiceIf = false
                        this.itemData.commission = 0
                        this.itemData.tag = 'product'
                    }
                }catch(err){
                    console.log(err)
                }
            }else{
                this.itemData.item = {}
                this.itemData.price = 0
                this.itemData.realPrice = 0
                this.itemData.commission = 0
                this.itemData.discountServiceIf = false
                this.itemData.discountService = ''
                this.microserviceSelecteds = []
                this.itemData.tag = ''
            }
        },
        async proccessSale(){
            this.ifProccess = true
            console.log(this.perPay)
            console.log(this.totalSale.toFixed(1) - this.totalPay.toFixed(1))
            if (this.totalSale.toFixed(1) - this.totalPay.toFixed(1) <= 0) {
                try{
                    const proccesSale = await axios.post(`${endPoint.endpointTarget}/sales/process`, {
                        items: this.serviceSelecteds,
                        total: this.totalSale,
                        totalPay: this.totalPay,
                        typesPay: this.paysSelecteds,
                        client: this.registerClient,
                        clientId: this.editClientId,
                        date: this.dateToday,
                        restPay: this.restPay,
                        shipping: this.shipping
                    }, this.configHeader)
                    if (proccesSale.data.status == 'ok') {
                        this.$swal({
                            icon: 'success',
                            title: 'Venta procesada',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        this.initialState()
                        this.ifProccess = false
                    }else{
                        this.$swal({
                            icon: 'error',
                            title: 'Registre fondo de caja',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.modals.modal4 = true
                        this.ifProccess = false
                    }
                }catch(err){}
            }else{
                this.$swal({
                    icon: 'warning',
                    title: 'Debe completar los pagos',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.ifProccess = false
            }
        },
        async chooseClient(value){
            this.ifrecomend = false
            this.clientSelect = value
            if (this.clientSelect) {
                try {
                    const getClient = await axios.get(`${endPoint.endpointTarget}/clients/findOne/${value}`, this.configHeader)
                    this.newClient.text = "Editar cliente"
                    this.ifEdit = true
                    this.editClientId = getClient.data.data._id
                    this.registerClient.firstName = getClient.data.data.firstName
                    this.registerClient.lastName = getClient.data.data.lastName
                    this.registerClient.email = getClient.data.data.email
                    this.registerClient.phone = getClient.data.data.phone
                    this.registerClient.instagram = getClient.data.data.instagram
                    this.readyClient = false
                    console.log(this.registerClient.phone)
                    this.validRegister(2)
                    this.clientSelect = {
                        name: getClient.data.data.firstName,
                        email:getClient.data.data.email
                    }
                }catch(err){
                    console.log(err)
                }
            }else{
                this.newClient.text = "Nuevo cliente"
                this.ifEdit = false
                this.registerClient.firstName = ""
                this.registerClient.select = "Seleccione"
                this.registerClient.lastName = ""
                this.registerClient.email = ""
                this.registerClient.phone = {
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
                }
                this.registerClient.instagram = ""
                this.readyClient = true
                this.validRegister(2)
            }
        },
        initialState(){
            this.itemData = {
                item: {},
                price: 0,
                realPrice: 0,
                discountServiceIf: false,
                discountService: '',
                employe: {
                    id: '',
                    name: '',
                    document: ''
                },
                quantityProduct: '',
                commission: 0,
                tag: ''
            }
            this.serviceSelecteds = []
            this.totalSale = 0
            this.paysSelecteds = []
            this.perPay = 0
            this.restPay = 0
            this.totalPay = 0
            this.ifEdit = false
            $('.thisSelect .ant-select-selection__clear').click()
            $('.clientSelect .ant-select-selection__clear').click()
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
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
        validCode(){
            axios.get(endPoint.endpointTarget+'/pedidos/validCode/'+this.codeArticulo)
            .then( res =>{
                if (res.data) {
                    this.articulo = res.data.articulo
                    this.estadoArticulo = res.data.estado
                    this.idArticulo = res.data._id
                    this.compradorArticulo = res.data.cliente
                    this.medioPagoArticulo = res.data.tipoPago
                    this.totalArticulo = res.data.total
                    this.modals.modal6 = true
                }
                else{
                    this.$swal({
                        icon: 'error',
                        title: 'Código no existe',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        selectDate(date, dateString){
            if (date) {
                this.dateToday = date._d     
            }else{
                this.dateToday = new Date()
            }
        },
        verifyCode(){
            this.$swal({
					icon: 'warning',
					title: '¿Seguro que desea verificar el código?',
					showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#2dce89',
                    cancelButtonColor: '#f5365c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
				}).then((result) => {
                    if (result.value) {
                        var remp = this.totalArticulo.replace('.', "")
                        var remp1 = remp.replace(',00', "")
                        var remp2 = remp1.replace('$ ', "")
                        this.payOrder = remp2
                        this.haveCode = true
                        this.modals.modal5 = false
                        this.modals.modal6 = false
                    }
                })
        }
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 240}
        },
        screenWidth: () => {
            return screen.width < 780 ? "w-100" : "w-25"
        },
        screenWidthInput: () => {
            return screen.width < 780 ? "w-100" : "w-50"
        },
        marginAdditional: () => {
            return screen.width < 780 ? "mt-3" : "mt-0"
        }
    },
    mounted (){
        EventBus.$on('reloadServices', status => {
            this.getServices()
        })
        EventBus.$on('reloadLenders', status => {
            this.getLenders()
        })
        EventBus.$on('reloadClients', status => {
            this.getClient()
        })
        EventBus.$on('openModal', status => {
            this.initialState()
        })
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
        EventBus.$on('reloadProducts', status => {
            this.getProducts()
        })
        EventBus.$on('reloadMicroservices', status => {
            this.getMicroservices()
        })
    }
}
</script>
<style >
    .inputFilter{
        padding: 5px;
        border:1px solid #cad1d7;
        border-radius:0.375rem;
        font-weight: 400;
        line-height: 1.5;
        color: #8898aa;
        font-size: 0.675rem;
    }
    .table thead tr th{
        padding-bottom: 5px;
        padding-top: 5px;
        padding-left: 15px !important;
    }
    .table thead tr th .form-group{
        margin-bottom: 0;
    }
    .ListaProcesar{
        overflow:hidden;
		overflow-x: hidden;
		overflow-y:hidden;
		max-height: 220px;
		height:170px;
    }
    .align .form-control{
        text-align:center;
    }
    .shadowTop{
		-webkit-box-shadow: 0px -16px 21px -10px rgba(0,0,0,0.75);
		-moz-box-shadow: 0px -16px 21px -10px rgba(0,0,0,0.75);
		box-shadow: 0px -16px 21px -10px rgba(0,0,0,0.75);
    }
    .hundred{
        cursor: pointer;
        transition: all 0.5s ease-out;
    }
    .hundred:hover{
        background-color: rgba(31, 86, 115, 0.342);
        color: white !important;
        border-radius: 5px;
    }
    
    .vbt-table-tools th{
        padding: 5px !important;
        max-height: 20px !important;
        overflow: hidden !important;
    }
    .vbt-table-tools th div .col-md-8{
        display:none !important;
    }
    .vbt-table-tools th div .col-md-4{
        flex: 0 0 100%; 
        max-width: 100%;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .col-md-6{
        display:none;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .vbt-global-search{
        display:block !important;
        flex: 0 0 100%; 
        max-width: 100%;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .vbt-global-search .form-group{
        margin-bottom: 2px !important;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .vbt-global-search .form-group input{
       border-left: 1px solid #cad1d7;
       padding-left: 5px;
    }
    .maxHeight .card .card-header{
        display:none ;
    }
    .maxHeight .table td {
        padding: 5px;
        padding-bottom: 5px;
    } 
    .menuVerVentas{
	transition: all 0.3s ease-out;
	overflow: hidden;
}
.navSVenta{
	cursor: pointer;
	width:7%;
	top:3.5%;
	right:-11%;
	background-color: white;
	position: absolute;
	border-radius: 0 5px 5px 0;
}
.menuVerServi{
	transition: all 0.3s ease-out;
	overflow: hidden;
}
.navSServi{
	cursor: pointer;
	width:7%;
	top:9.5%;
	right:-11%;
	background-color: white;
	position: absolute;
	border-radius: 0 5px 5px 0;
}
.menuVerRedo{
	transition: all 0.3s ease-out;
	overflow: hidden;
}
.navSRedo{
	cursor: pointer;
	width:7%;
	top:15.5%;
	right:-11%;
	background-color: white;
	position: absolute;
	border-radius: 0 5px 5px 0;
}
.navSCode{
	cursor: pointer;
	width:7%;
	top:22.6%;
	right:-11%;
	background-color: white;
	position: absolute;
	border-radius: 0 5px 5px 0;
}
.menuVerVentas:hover{
	width: 33%;
	right:-37%;
	z-index:2;
}
.menuVerServi:hover{
	width: 33%;
	right:-37%;
	z-index:2;
}
.menuVerRedo:hover{
	width: 33%;
	right:-37%;
	z-index:2;
}

.card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 3px;
  padding-bottom: 40px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff !important;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent !important;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab:hover {
  color: #111111 !important;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff !important;
  background: #fff;
  color: #111111 !important;
  font-weight: 600 !important;
}

.separatorLeft{
    border-right: 5px solid #fff;
}
.ant-select-selection{
    border: 1px solid #d9d9d9;
}
.ubicateDate{
    position: fixed;
    top: 0%;
    left: 400px;
    z-index: 100;
    width: 48%;
}
</style>
