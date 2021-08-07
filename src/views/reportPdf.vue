<template>
    <div class="mx-2">
        <template v-if="dataSale != null">
            <h2>Detalle de la venta (ID: {{dataSale.uuid}}) <b v-if="!dataSale.status"># Anulada</b></h2>
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
                    <span class="ml-1">{{dataSale.client.firstName}} {{dataSale.client.email}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Despacho</b></label><br>
                    <span class="ml-1">{{dataSale.shipping | formatPrice}}</span>
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
            <hr class="mt-1 mb-1">
            <a-table :columns="columnsReport" :pagination="false" :data-source="dataSale.items">
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
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
export default {
    data(){
        return {
            dataSale: {},
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            id: this.$route.query.id,
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
        }
    },
    created(){
        this.getData()
    },
    methods: {
        async getData(){
            try {
                const sale = await axios.get(endPoint.endpointTarget+'/sales/getSale/'+this.id, this.configHeader)
                console.log(sale)
                this.dataSale = sale.data.data
                setTimeout(() => {
                    print()
                    setTimeout(() => {
                        window.close()
                    }, 200);
                }, 200);
            }catch(err){

            }
        }
    }
}
</script>