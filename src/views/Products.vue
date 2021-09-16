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
                    <base-button @click="modals.modal5 = true" class="float-right mt-7 mr-2" size="sm" type="warning">
                        <a-icon type="folder-open" class="mr-2" style="vertical-align:1.5px;font-size:1.4em;" />
                        Cerrar
                    </base-button>
                </div>
            </div>
        </base-header>
        <div>
            <template>
                <a-config-provider>
                    <template #renderEmpty>
                        <div style="text-align: center">
                            <a-icon type="warning" style="font-size: 20px" />
                            <h2>No hay ningun producto en sucursal</h2>
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
                                    <span>Devolver a inventario</span>
                                </template>
                                <base-button size="sm" @click="deleteProductByBranch(column._id, column.idInventory, column.quantity)" type="danger">
                                    <a-icon type="rollback" style="vertical-align: 1.5px; font-size:1.4em;" />
                                </base-button>
                            </a-tooltip>
                        </template>
                    </a-table>
                </a-config-provider>
            </template>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    data(){
        return {
            products: [],
            branch: localStorage.branch,
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database,
                    'x-access-token':localStorage.userToken
                }
            },
            productState: false,
            searchText: '',
            searchInput: null,
            searchedColumn: '',
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
            ]
        }
    },
    created(){
        this.getProducts()
    },
    methods: {
        getBranch(){
            this.branch = localStorage.branch
            this.getProducts()
        },
        async getProducts(){
            this.productState = true
            try {
                const getProducts = await axios.get(`${endPoint.endpointTarget}/products/productsbranch/${this.branch}`, this.configHeader)
                this.products = getProducts.data.data
                this.productState = false
            }catch(err){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas de conexión',
                    showConfirmButton: false,
                    timer: 1500
                })
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
        async deleteProductByBranch(_id, idInventory, quantity){
            try {
                const addProduct = await axios.put(`${endPoint.endpointTarget}/products/deleteProductToBranch/${this.branch}`, {
                    id: _id,
                    idInventory: idInventory,
                    quantity: quantity
                }, this.configHeader)
                if (addProduct.data.status == 'ok') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        title: 'Cambio exitoso',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.getProducts()
                }
            }catch(err){
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Problemas de conexión',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    },
    mounted (){
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    },
    getBack(product){

    }
}
</script>