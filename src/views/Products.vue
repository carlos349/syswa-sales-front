<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center" style="min-height: 50px; background-image: url(img/theme/inventario.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Productos</p>
                    </div>
                    <base-button @click="modals.modal1 = true, initialState(), typeModal = 'Registrar'" class="float-right mt-7 mr-2" size="sm" type="success">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Registrar
                    </base-button>
                </div>
            </div>
        </base-header>
        <!-- TABLA DE CLIENTES -->

        <tabs fill class="flex-column flex-md-row inventory inventoryTabs">
            <card class="quitPadding" shadow>
                <tab-pane>
                    <span id="productsTable" class="p-2" slot="title">
                        <a-icon type="shopping" style="font-size:1.6em;vertical-align:3px;" />
                        Productos
                    </span>
                    <template>
                        <a-config-provider>
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="warning" style="font-size: 20px" />
                                    <h2>No hay ningun producto registrado</h2>
                                </div>
                            </template>
                            <a-table :columns="columns" :loading="productState" :data-source="products">
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
                                <template slot="price-format" slot-scope="record, column">
                                    {{column.price | formatPrice}}
                                </template>
                                <template slot="total-format" slot-scope="record, column">
                                    {{column.quantity - column.consume}}
                                </template>
                                <template slot="Administrar" slot-scope="record, column">
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                        <span>Anexar productos</span>
                                        </template>
                                        <base-button size="sm" @click="modals.modal2 = true, productToAdd = column, productId = column._id" type="success" icon="fa fa-plus"></base-button>
                                    </a-tooltip>
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                        <span>Editar</span>
                                        </template>
                                            <base-button size="sm" type="default" @click="pushData(column._id, column.product, column.quantityProduction, column.price, column.rawMaterial)" icon="fas fa-edit"></base-button>
                                    </a-tooltip>
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                        <span>Eliminar</span>
                                        </template>
                                            <base-button size="sm" v-on:click="deleteProduct(column._id)" type="warning" icon="fas fa-trash"></base-button>
                                    </a-tooltip>
                                </template>
                            </a-table>
                        </a-config-provider>
                    </template>
                </tab-pane>
                <tab-pane>
                    <span class="p-2" slot="title">
                        <a-icon type="book" style="font-size:1.5em;vertical-align:3px;" />
                        Historial de producción
                    </span>
                    <template>
                        <a-config-provider>
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="warning" style="font-size: 20px" />
                                    <h2>No hay ninguna producción registrada</h2>
                                </div>
                            </template>
                            <a-table :columns="columnsHistory" :loading="productState" :data-source="historyProduction">
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
                                <template slot="slot-date" slot-scope="record, column">
                                    {{column.createdAt | formatDate}}
                                </template>
                            </a-table>
                        </a-config-provider>
                    </template>
                </tab-pane>
            </card>
        </tabs>
        
        <a-modal v-model="modals.modal1" class="modalTop" :title="typeModal+' producto'" :closable="true" >
            <template>
                <div class="row">
                    <div class="col-12">
                        <base-input  alternative
                            placeholder="Nombre del producto"
                            v-model="productData.product"
                            v-on:keyup="validRegister()"
                            addon-left-icon="ni ni-basket"
                            addon-right-icon="fa fa-asterisk text-danger">
                        </base-input>
                    </div>
                    <div class="col-md-6">
                        <base-input  alternative
                            placeholder="Cantidad por producción"
                            class="mt-2"
                            v-model="productData.quantityProduction"
                            v-on:keyup="validRegister()"
                            addon-left-icon="ni ni-basket"
                            addon-right-icon="fa fa-asterisk text-danger">
                        </base-input>
                    </div>
                    <div class="col-md-6 pt-0" style="margin-top:-15px;">
                        <label class="mb-1" for="price">Precio de venta por unidad</label>
                        <currency-input
                            locale="de"
                            addon-left-icon="ni ni-money-coins"
                            v-on:keyup="validRegister()"
                            v-model="productData.price"
                            class="form-control"
                        />
                    </div>
                    <div class="col-12">
                        <hr class="mt-1 mb-1">
                        <h3 class="text-center">Materia prima</h3>
                    </div>
                    <div class="col-md-5">
                        <a-select
                            show-search
                            placeholder="Materia prima"
                            option-filter-prop="children"
                            allowClear
                            class="w-100 materialSelect"
                            :filter-option="filterOption">
                            <a-select-option v-for="(material, index) in rawMaterials" :key="material._id" @click="selectMaterialClick(material, index)" :value="material._id" :disabled="material.disabled">
                                {{material.product}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="col-md-3">
                        <a-input :disabled="materialSelect.measure != 'Medida' && materialSelect.product != '' ? false : true" v-model="materialSelect.quantity" v-on:keyup.enter="addMaterialToProduct" class="w-100" placeholder="Cantidad" />
                    </div>
                    <div class="col-md-2 px-0">
                        <p class="mt-1 mr-0"><strong>{{materialSelect.measure}}</strong></p>
                    </div>
                    <div class="col-md-2">
                        <a-button :disabled="materialSelect.quantity > 0 && materialSelect.measure != 'Medida' && materialSelect.quantity != '' ? false : true" @click="addMaterialToProduct()" type="primary" shape="round">
                            <a-icon type="plus-circle" style="vertical-align:1.2px;" />
                        </a-button>
                    </div>
                    <div class="col-12">
                        <a-table :columns="columnsProducts" :loading="productState" :data-source="productData.rawMaterial" :pagination="false" :scroll="{ y: 200 }">
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
                            <template slot="quantity-slot" slot-scope="record, column">
                                {{column.quantity}} {{column.measure}}
                            </template>
                            <template slot="Administrar" slot-scope="record, column, index">
                                <base-button size="sm" v-on:click="removeProduct(index)" type="danger" icon="fa fa-trash"></base-button>
                            </template>
                        </a-table>
                    </div>  
                </div>
            </template>
            <template slot="footer">
                <base-button v-if="typeModal == 'Registrar'" @click="registerProduct" :disabled="validRegisterVar" size="sm" type="success">
                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Registrar
                </base-button>
                <base-button v-else @click="editProduct" :disabled="validRegisterVar" size="sm" type="success">
                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Editar
                </base-button>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal2" width="300px" title="Anexar productos" :closable="true" >
            <template>
                <base-input  alternative
                    placeholder="Cantidad producida"
                    class="mt-2"
                    v-model="productionQuantity"
                    addon-left-icon="ni ni-basket"
                    addon-right-icon="fa fa-asterisk text-danger">
                </base-input>
            </template>
            <template slot="footer">
                <base-button @click="addProduction" :disabled="productionQuantity != '' && productionQuantity > 0 ? false : true" size="sm" type="success">
                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Agregar
                </base-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
export default {
    data(){
        return {
            products: [],
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database,
                    'x-access-token':localStorage.userToken
                }
            },
            modals: {
                modal1: false,
                modal2: false
            },
            productData: {
                product: '',
                quantityProduction: '',
                price: 0,
                rawMaterial: [],
                id: ''
            },
            productionQuantity: '',
            materialSelect: {
                measure: 'Medida',
                quantity: '',
                product: '',
                promedyPrice: 0,
                id: '',
                index: 0
            },
            productId: '',
            productState: true,
            rawMaterials: [],
            searchText: '',
            searchInput: null,
            searchedColumn: '',
            productToAdd: new Object,
            rawMaterialsSelectds: [],
            columnsHistory: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    ellipsis: true,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'slot-date',
                    },
                    onFilter: (value, record) =>
                        record.createdAt
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
                    title: 'Producto',
                    dataIndex: 'product',
                    key: 'product',
                    ellipsis: true,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.product
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
                    title: 'Producido',
                    dataIndex: 'produced',
                    key: 'produced',
                    ellipsis: true
                }
            ],
            columnsProducts: [
                {
                    title: 'Producto',
                    dataIndex: 'product',
                    key: 'product',
                    ellipsis: true,
                    width: '40%',
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.product
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
                    title: 'Cantidad',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    ellipsis: true,
                    width: '40%',
                    scopedSlots: { customRender: 'quantity-slot' }
                },
                {
                    title: 'Acciones',
                    dataIndex: 'id',
                    width: '20%',
                    key: 'id',
                    scopedSlots: { customRender: 'Administrar' },
                }
            ],
            columns: [
                {
                    title: 'Producto',
                    dataIndex: 'product',
                    key: 'product',
                    ellipsis: true,
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender',
                    },
                    onFilter: (value, record) =>
                        record.product
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
                    title: 'Precio',
                    dataIndex: 'price',
                    key: 'price',
                    scopedSlots: { customRender: 'price-format' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.price - b.price,
                    ellipsis: true,
                },
                {
                    title: 'Cantidad',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    ellipsis: true
                },
                {
                    title: 'Consumo',
                    dataIndex: 'consume',
                    key: 'consume',
                    ellipsis: true,
                },
                {
                    title: 'Total',
                    dataIndex: 'quantityProduction',
                    key: 'quantityProduction',
                    scopedSlots: { customRender: 'total-format' },
                    ellipsis: true,
                },
                {
                    title: 'Acciones',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'Administrar' },
                }
            ],
            validRegisterVar: true,
            historyProduction: [],
            typeModal: ''
        }
    },
    created(){
        this.getProducts()
        this.getRawMaterial()
        this.getHistory()
        $('.productsTable').click()
    },
    methods: {
        selectMaterialClick(material, index){
            console.log(material)
            this.materialSelect.measure = material.measure
            this.materialSelect.product = material.product
            this.materialSelect.id = material._id
            this.materialSelect.index = index
            this.materialSelect.promedyPrice = material.promedyPrice
        },
        async getProducts(){
            this.productState = true
            const getProducts = await axios.get(`${endPoint.endpointTarget}/products`, this.configHeader)
            if (getProducts.data.status == 'ok') {
                this.products = getProducts.data.data
                this.productState = false
            }else{
                this.products = []
                this.productState = false
            }
        },
        async getHistory(){
            this.productState = true
            const getHistory = await axios.get(`${endPoint.endpointTarget}/products/getHistory`, this.configHeader)
            console.log(getHistory)
            if (getHistory.data.status == 'ok') {
                this.historyProduction = getHistory.data.data
                this.productState = false
                console.log(this.historyProduction)
            }else{
                this.historyProduction = []
                this.productState = false
                console.log(this.historyProduction)
            }
        },
        async getRawMaterial() {
            try{
                const getAllProducts = await axios.get(endPoint.endpointTarget+'/stores/getstore', this.configHeader)
                if (getAllProducts.data.status == 'ok') {
                    this.rawMaterials = getAllProducts.data.data
                    for (const material of this.rawMaterials) {
                        material.disabled = false
                    }
                    this.productState = false
                }else{
                    this.rawMaterials = []
                    this.productState = false
                }
            }catch(err){
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Problemas con el servidor',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(err)
            }
        },
        addMaterialToProduct(){
            if (this.materialSelect.quantity > 0) {
                this.rawMaterials[this.materialSelect.index].disabled = true
                this.productData.rawMaterial.push({
                    product: this.materialSelect.product,
                    quantity: this.materialSelect.quantity,
                    measure: this.materialSelect.measure,
                    promedyPrice: this.materialSelect.promedyPrice,
                    id: this.materialSelect.id,
                    index: this.materialSelect.index
                })
                $('.materialSelect .ant-select-selection__clear').click()
                this.materialSelect.measure = 'Medida'
                this.materialSelect.product = ''
                this.materialSelect.quantity = ''
                this.materialSelect.promedyPrice = 0
                this.materialSelect.id = ''
                this.materialSelect.index = 0
                this.validRegister()
            }
        },
        removeProduct(index){
            this.rawMaterials[this.productData.rawMaterial[index].index].disabled = false
            this.productData.rawMaterial.splice(index, 1)
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        validRegister(){
            this.validRegisterVar = this.productData.product != '' && this.productData.quantityProduction > 0 && this.productData.price > 0 && this.productData.rawMaterial.length > 0 ? false : true
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
        async deleteProduct(id){
            const deleteProduct = await axios.delete(`${endPoint.endpointTarget}/products/${id}`, this.configHeader)
            if (deleteProduct.data.status == 'ok') {
                this.getProducts()
                this.$swal({
                    type: 'success',
                    icon: 'success',
                    title: 'Producto eliminado',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else{
                this.getProducts()
            }
        },
        async registerProduct(){
            try {
                const registerProduct = await axios.post(`${endPoint.endpointTarget}/products`, {
                    product: this.productData.product,
                    quantityProduction: this.productData.quantityProduction,
                    price: this.productData.price,
                    rawMaterial: this.productData.rawMaterial
                }, this.configHeader)
                if (registerProduct.data.status == 'ok') {
                    this.getProducts()
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        title: 'Producto registrado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.productData.product = ''
                    this.productData.quantityProduction = ''
                    this.productData.price = 0
                    this.productData.rawMaterial = []
                    this.modals.modal1 = false
                    this.validRegisterVar = true
                    EventBus.$emit('reloadProducts', 'reload')
                }else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'El producto ya existe',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }catch(err){
                console.log(err)
            }
        },
        async editProduct(){
            try {
                const registerProduct = await axios.put(`${endPoint.endpointTarget}/products/${this.productData.id}`, {
                    product: this.productData.product,
                    quantityProduction: this.productData.quantityProduction,
                    price: this.productData.price,
                    rawMaterial: this.productData.rawMaterial
                }, this.configHeader)
                if (registerProduct.data.status == 'ok') {
                    this.getProducts()
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        title: 'Producto editado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.productData.product = ''
                    this.productData.quantityProduction = ''
                    this.productData.price = 0
                    this.productData.rawMaterial = []
                    this.modals.modal1 = false
                    this.validRegisterVar = true
                }else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'El producto ya existe',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }catch(err){
                console.log(err)
            }
        },
        pushData(id, product, quantityProduction, price, rawMaterial){
            this.initialState()
            this.productData.product = product
            this.productData.quantityProduction = quantityProduction
            this.productData.price = price
            this.productData.rawMaterial = rawMaterial
            this.productData.id = id
            this.modals.modal1 = true
            this.typeModal = "Editar"
            for (const material of this.rawMaterials) {
                for (const entryMaterial of this.productData.rawMaterial) {
                    if (material._id == entryMaterial.id) {
                        material.disabled = true
                        break
                    }
                }
            }
            this.validRegisterVar = false
        },
        initialState(){
            for (const material of this.rawMaterials) {
                material.disabled = false
            }
            this.productData = {
                product: '',
                quantityProduction: '',
                price: 0,
                rawMaterial: [],
                id: ''
            }
            this.materialSelect = {
                measure: 'Medida',
                quantity: '',
                product: '',
                promedyPrice: 0,
                id: '',
                index: 0
            }
            this.validRegisterVar = true
            $('.materialSelect .ant-select-selection__clear').click()
        },
        async addProduction(){
            try {
                const addProd = await axios.post(`${endPoint.endpointTarget}/products/addProduction/${this.productId}`, {
                    quantity: this.productionQuantity,
                    product: this.productToAdd
                }, this.configHeader)
                if (addProd.data.status == 'ok') {
                    this.productionQuantity = ''
                    this.$swal({
                        icon: 'success',
                        title: 'Producto agregado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.modals.modal2 = false
                    this.productId = ''
                    this.getProducts()
                    this.getHistory()
                    this.alertProducts()
                }
            }catch(err){
                console.log(err)
            }
        },
        alertProducts(){
            axios.get(endPoint.endpointTarget+'/stores/alertProducts')
            .then(res => {
                console.log(res)
                if (res.data.status == 'ok') {
                    var Detail = ''
                    if (res.data.productsToAlert.length == 1) {
                        Detail = 'Hace falta reintegrar la materia prima: '
                    }else{
                        Detail = 'Hace falta reintegrar las materias primas: '
                    }
                    for (let index = 0; index < res.data.productsToAlert.length; index++) {
                        const element = res.data.productsToAlert[index];
                        if (index == 0) {
                            Detail = Detail + element.nameProduct
                        }else{
                            Detail = Detail + ', ' + element.nameProduct
                        } 
                    } 
                    axios.post(endPoint.endpointTarget+'/notifications', {
                        userName: "Alerta del sistema",
                        userImage: "",
                        detail: Detail,
                        link: 'Inventario'
                    })
                    .then(res => {
                        this.socket.emit('sendNotification', res.data)
                    })
                }
            })
        }
    }
}
</script>
<style>
    .modalTop .ant-modal{
        top: 2% !important;
    }
    .inventory .nav-item .active{
    background-color:#172b4d !important;
    color: white !important;
  }
  .inventory .nav-link {
    color: #172b4d !important;
  }
  .inventory .card-header{
    display:none;
  }
  .nav-item{
    padding-left: 1rem;
  }
  .inventoryTabs .nav-item:last-child{
    padding-right: 1rem !important;
  }
  .quitPadding .card-body{
      padding: 0px !important;
      padding-right: 2px !important;
  }
</style>