<template>
    <div class="p-2">
        <p>
            <b>Total por gastar</b> {{totalPerExpense | formatPrice}} | <b>Total en stock</b> {{totalStock | formatPrice}}
        </p> 
        <a-config-provider>
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>No hay ningun registro</h2>
                </div>
            </template>
            <a-table :columns="columnsHistoryClosedReport" :data-source="dataHistoryClosedReport.products" :scroll="getScreen" :pagination="false">
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
                <template slot="ideal-slot" slot-scope="record">
                    {{record.toFixed(2)}}
                </template>
                <template slot="real-slot" slot-scope="record">
                    {{parseFloat(record).toFixed(2)}}
                </template>
                <template slot="buy-slot" slot-scope="record">
                    {{record.toFixed(2)}}
                </template>
                <template slot="real-slot" slot-scope="record">
                    {{parseFloat(record).toFixed(2)}}
                </template>
                <template slot="buy-slot" slot-scope="record">
                    {{record.toFixed(2)}}
                </template>
                <template slot="perExpense-slot" slot-scope="record, column">
                    {{column.totalBuy > 0 ? parseFloat(column.totalBuy) * column.promedyPrice : 0 | formatPrice}}
                </template>
                <template slot="stock-slot" slot-scope="record, column">
                    {{parseFloat(column.real) * column.promedyPrice | formatPrice}}
                </template>
            </a-table>
        </a-config-provider>  
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'

export default {
    data(){
        return {
            id: this.$route.query.id,
            dataHistoryClosedReport: {},
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database,
                    'x-access-token':localStorage.userToken
                }
            },
            columnsHistoryClosedReport: [
                {
                    title: 'Producto',
                    dataIndex: 'product',
                    key: 'product'
                },
                {
                    title: 'Medida',
                    dataIndex: 'measure',
                    key: 'measure'
                },
                {
                    title: 'Total ideal',
                    dataIndex: 'ideal',
                    key: 'ideal',
                    scopedSlots: { customRender: 'ideal-slot' }
                },
                {
                    title: 'Total real',
                    dataIndex: 'real',
                    key: 'real',
                    scopedSlots: { customRender: 'real-slot' }
                },
                {
                    title: 'Diferencia',
                    dataIndex: 'difference',
                    key: 'difference'
                },
                {
                    title: 'Meta',
                    dataIndex: 'goal',
                    key: 'goal',
                },
                {
                    title: 'Por comprar',
                    dataIndex: 'totalBuy',
                    key: 'totalBuy',
                    scopedSlots: { customRender: 'buy-slot' }
                },
                {
                    title: 'Por gastar',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'perExpense-slot' }
                },
                {
                    title: 'Stock',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'stock-slot' }
                }
            ],
            totalPerExpense: 0,
            totalStock: 0
        }
    },
    created(){
        this.getData()
    },
    methods: {
        getData(){
            this.closeDate = new Date()
            axios.get(endPoint.endpointTarget+'/stores/gethistoryclosedbyid/'+this.id, this.configHeader)
            .then(resData => {
                console.log(resData)
                this.dataHistoryClosedReport = resData.data.data
                this.totalPerExpense = 0
                this.totalStock = 0
                for (const product of this.dataHistoryClosedReport.products) {
                    const totalBuy = product.totalBuy > 0 ? parseFloat(product.totalBuy) : 0
                    this.totalPerExpense = this.totalPerExpense + (totalBuy * product.promedyPrice)
                    
                    this.totalStock = (this.totalStock + (parseFloat(product.real) * product.promedyPrice))
                }
                setTimeout(() => {
                    print()
                    setTimeout(() => {
                        window.close()
                    }, 200);
                }, 200);
            })
            .catch(err => {
                console.log(err )
            })
        },
    }
}
</script>