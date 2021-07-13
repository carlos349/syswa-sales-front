<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">10 Mejores clientes</h3>
        </div>
        <div class="col text-right">
          <a href="#!" class="btn btn-sm btn-primary">Ver todos</a>
        </div>
      </div>
    </div>
    
      <div class="table-responsive">
        <vue-custom-scrollbar class="maxHeight">
          <base-table thead-classes="thead-light" :data="attentions">
            <template slot="columns">
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Atenciones</th>
            </template>
            <template slot-scope="{row}">
              <th scope="row">
                {{row.name}}
              </th>
              <th scope="row">
                {{row.contact}}
              </th>
              <th scope="row">
                {{row.attention}}
              </th>
            </template>
          </base-table>
        </vue-custom-scrollbar >
      </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import endPoint from '../../../config-endpoint/endpoint.js'

  import vueCustomScrollbar from 'vue-custom-scrollbar'
  export default {
    components: {
      vueCustomScrollbar
    },
    name: 'page-visits-table',
    data() {
      return {
        attentions: []
      }
    },
    created(){
      this.getParticipacion()
    },
    methods: {
      getParticipacion() {
        axios.get(endPoint.endpointTarget+'/metrics/top')
        .then(res => {
          
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            this.attentions.push({name: element.nombre, contact: element.identidad, attention: element.participacion})
          }
          
        })
      },
    }
  }
</script>
<style>
.maxHeight{
    max-height: 395px;
    overflow: scroll;
}
</style>
