<template>
  <div>
    <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center" style="min-height: 50px; background-image: url(img/theme/inventario.jpg); background-size: cover; background-position: center top;">
        <!-- Mask -->
        <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
        <!-- Header container -->
        <div class="row">
            <div class="col-12">
                <div class="text-absolute">
                    <p class="mb-0 display-2 text-white">Bodega</p>
                    <p class="text-white font-weight-bolder">CLP STOCK - {{totalStockActual | formatPrice}}</p>
                </div>
                <base-button class="float-right mt-7 ml-2" title="Generar excel" size="sm" type="primary"> 
                    <a-icon type="file-excel" style="vertical-align:1.5px;font-size:1.2em;" />
                </base-button>
                <base-button class="float-right mt-7 mr-0" size="sm" @click="modals.modal4 = true" type="warning">
                    <i class="fa fa-archive mr-2" style="vertical-align:1px;font-size:1.2em;"></i>
                    Cerrar
                </base-button>
                <base-button class="float-right mt-7 mr-2" size="sm" @click="modals.modal3 = true, providerSup.typeProvider = 'Registrar', initialState(2)" type="primary">
                    <a-icon type="shopping-cart" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    proveedores
                </base-button>
                <base-button class="float-right mt-7 mr-2" size="sm" @click="modals.modal1 = true ,validForm = 1, initialState(3)" type="success">
                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Registrar
                </base-button>
            </div>
        </div>
    </base-header>
    <tabs fill class="flex-column flex-md-row inventory inventoryTabs">
        <card shadow>
            <tab-pane>
                <span class="p-2" slot="title">
                    <i class="fa fa-box-open"></i>
                    Tabla de productos
                </span>
                <template>
                    <div class="p-2">
                        <a-config-provider>
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="warning" style="font-size: 20px" />
                                    <h2>No hay ningun producto registrado</h2>
                                </div>
                            </template>
                            <a-table :columns="columns" :loading="productState" :data-source="products" :scroll="getScreen">
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
                                <template slot="total" slot-scope="record,column">
                                  <span class="text-danger" v-if="(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume) < column.alertTotal">
                                    {{((parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume)) | formatNumber}}
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            <span>Este producto necesita ser reabastecido.</span>
                                        </template>
                                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;font-size:1.1em" type="exclamation-circle" />
                                    </a-tooltip>
                                  </span>
                                  <span v-else>
                                    {{((parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume)) | formatNumber}}
                                  </span>
                                    
                                </template>
                                <template slot="consume" slot-scope="record, column">
                                    {{column.consume | formatNumber}}
                                </template>
                                <template slot="quantity" slot-scope="record, column">
                                    {{column.quantity | formatNumber}}
                                </template>
                                <template slot="price" slot-scope="record">
                                    {{record | formatPrice}}
                                </template>
                                <template slot="actions" slot-scope="record, column">
                                    <b>
                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Descontar productos</span>
                                            </template>
                                            <base-button  title="Descontar" size="sm" type="danger" @click="modals.modal7 = true, discountProduct = '', productToDiscount = column.product, productDiscountId = column._id, productMeasure = column.measure, productPromedy = column.promedyPrice, initialState(1, column._id)" icon="fa fa-minus"></base-button>
                                        </a-tooltip>

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Anexar productos</span>
                                            </template>
                                            <base-button  title="Compras" size="sm" type="success" @click="modals.modal1 = true, validForm = 3, dataProduct.entry = '', dataProduct.measure = column.measure, dataProduct.product = column.product, initialState(1,column._id)" icon="fa fa-plus"></base-button>
                                        </a-tooltip>

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                                <span>Editar producto</span>
                                            </template>
                                            <base-button title="Editar producto" size="sm" type="default" icon="fa fa-edit" @click="pushDataProduct(column.product, column.measure, column.alertTotal, column._id)"></base-button>
                                        </a-tooltip>  

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Eliminar</span>
                                            </template>
                                            <base-button  title="Eliminar" size="sm" type="danger" @click="deleteItem(column._id)" icon="fa fa-trash"></base-button>
                                        </a-tooltip> 
                                    </b>
                                </template>
                            </a-table>
                        </a-config-provider>    
                    </div>
                </template>
            </tab-pane>

            <tab-pane title="Profile">
                <span id="provedorBtn" slot="title">
                    <i class="fa fa-user-tie"></i>
                    Tabla de provedores
                </span>
                <template>
                    <div class="p-2">
                        <a-config-provider>
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="warning" style="font-size: 20px" />
                                    <h2>No hay ningun provedor registrado</h2>
                                </div>
                            </template>
                            <a-table :columns="columnsProviders" :loading="productState" :data-source="providerTable" :scroll="getScreen">
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
                                            <span>Editar</span>
                                          </template>
                                          <base-button size="sm" type="default" @click="modals.modal3 = true, providerSup.typeProvider = 'Editar', pushDataProvider(column.name, column.document, column.contact,column.contactPlus,column.location,column._id)" icon="fas fa-edit"></base-button>
                                        </a-tooltip>

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Eliminar</span>
                                            </template>
                                            <base-button size="sm" type="danger" @click="deleteProvider(column._id)" icon="fa fa-trash"></base-button>
                                        </a-tooltip> 
                                    </b>
                                </template>
                            </a-table>
                        </a-config-provider>    
                    </div>
                </template>
            </tab-pane>

            <tab-pane>
                <span slot="title">
                  <i class="ni ni-calendar-grid-58"></i>
                  Historial
                </span>
                <tabs fill class="flex-column flex-md-row">
                    <card shadow>
                        <tab-pane>
                            <span slot="title">
                                <i class="fa fa-money-check-alt"></i>
                                Historial de compras y abastecimientos
                            </span>
                            <template>
                              <div class="p-2">
                                  <a-config-provider>
                                      <template #renderEmpty>
                                          <div style="text-align: center">
                                              <a-icon type="warning" style="font-size: 20px" />
                                              <h2>No hay ningun registro de historial</h2>
                                          </div>
                                      </template>
                                      <a-table :columns="columnsHistory" :loading="productState" :data-source="dataHistory" :scroll="getScreen">
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
                                          <template slot="date" slot-scope="record">
                                              {{record | formatDate}}
                                          </template>
                                          <template slot="anexe" slot-scope="record">
                                              {{record | formatNumber}}
                                          </template>
                                          <template slot="price" slot-scope="record">
                                              {{record | formatPrice}}
                                          </template>
                                      </a-table>
                                  </a-config-provider>    
                              </div>
                          </template>
                        </tab-pane>

                        <tab-pane title="Profile">
                            <span slot="title">
                                <i class="fa fa-file-contract"></i>
                                Historial de cierres
                            </span>
                            <template>
                              <div class="p-2">
                                  <a-config-provider>
                                      <template #renderEmpty>
                                          <div style="text-align: center">
                                              <a-icon type="warning" style="font-size: 20px" />
                                              <h2>No hay ningun registro de cierre</h2>
                                          </div>
                                      </template>
                                      <a-table :columns="columnsHistoryClosed" :loading="productState" :data-source="dataHistoryClosed" :scroll="getScreen">
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
                                          <template slot="date" slot-scope="record">
                                              {{formatDate(record)}}
                                          </template>
                                          <template slot="user" slot-scope="record">
                                              {{record.email}}
                                          </template>
                                          <template slot="report" slot-scope="record, column">
                                            <a-tooltip placement="top">
                                              <template slot="title">
                                                <span>Ver informe</span>
                                              </template>
                                              <base-button size="sm" type="default" @click="modals.modal5 = true ,validForm = 2, dataHistoryClosedReport = column.products, idReport = column.createdAt,  sumTotals(column.products)" icon="ni ni-bullet-list-67"></base-button>
                                            </a-tooltip>
                                          </template>
                                      </a-table>
                                    </a-config-provider> 
                                     
                              </div>
                          </template>
                        </tab-pane>
                    </card>
                </tabs>
            </tab-pane>
        </card>
    </tabs>
    <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
        <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
        <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
            </template>
            <template>
                <a-spin size="large" :spinning="loadData">
                    <div v-if="validForm != 3" style="margin-top:-30%" class="text-center text-muted mb-4">
                        <small>Datos del producto</small>
                    </div>
                    <div v-else style="margin-top:-30%" class="text-center text-muted mb-4">
                        <small>Anexa mas productos a {{dataProduct.product}}</small>
                    </div>
                    <form role="form">
                    <div class="row" v-if="validForm == 3">
                        <div class="col-7">
                            <base-input alternative
                                placeholder="Cantidad"
                                v-model="dataProduct.entry"
                                addon-left-icon="fa fa-box-open">
                            </base-input>
                        </div>
                        <div class="col-5 mt-2">
                            {{dataProduct.measure}}
                        </div>
                    </div>
                        
                        <base-input v-if="validForm == 3" addon-left-icon="ni ni-calendar-grid-58">
                            <flat-picker slot-scope="{focus, blur}"
                                @on-open="focus"
                                @on-close="blur"
                                :config="configDatePicker"
                                class="form-control datepicker"
                                v-model="dateAdd"
                                placeholder="Seleccione una fecha de compra">
                            </flat-picker>
                        </base-input>
                        
                        <base-input v-if="validForm != 3" alternative
                            class="mb-3"
                            placeholder="Nombre"
                            v-model="dataProduct.product"
                            addon-left-icon="fa fa-edit">
                        </base-input>
                        <select v-if="validForm != 3" class="form-control mb-3"  v-model="dataProduct.measure">
                        <option style="color:black;" selected value="">Seleccione el tipo de medida</option>
                        <option style="color:black;" value="Gramo(s)">Gramo(s)</option>
                        <option style="color:black;" value="Kilogramo(s)">Kilogramo(s)</option>
                        <option style="color:black;" value="Litro(s)">Litro(s)</option>
                        <option style="color:black;" value="Mililitro(s)">Mililitro(s)</option>
                        <option style="color:black;" value="Unidad">Unidad</option>
                        </select>
                        <base-input v-if="validForm == 1" alternative
                            placeholder="Numero para alerta"
                            v-model="dataProduct.alertTotal"
                            addon-left-icon="fa fa-bell">
                        </base-input>
                        <currency-input
                            v-if="validForm == 3"
                            locale="de"
                            placeholder="Precio total"
                            addon-left-icon="ni ni-money-coins"
                            v-model="dataProduct.price"
                            class="form-control mb-3"
                            style="margin-top:-10px;"
                        />
                        <base-button icon="fa fa-plus" @click="modals.modal3 = true, providerSup.typeProvider = 'Registrar', initialState(2)" v-if="validForm == 3" class="mb-2" size="sm" type="success">Registrar provedor</base-button>
                        <a-select class="input-group-alternative w-100 mb-4 mt-2 resetProv" v-if="validForm == 3" placeholder="Seleccione un proveedor" size="large" allowClear>
                            <a-select-option v-for="provider of providers" :key="provider" @click="selectProviderForProduct(provider)" :value="provider">
                                {{provider}}
                            </a-select-option>
                        </a-select>
                        
                        <div class="text-center">
                            <base-button v-on:click="addProduct()" v-if="validForm == 1" :disabled="dataProduct.product != '' && dataProduct.measure != '' && dataProduct.price != null && dataProduct.alertTotal != '' ? false : true" type="default">Registrar</base-button>
                            <base-button v-on:click="updateProducts()" v-if="validForm == 2" type="default">Editar</base-button>
                            
                            <base-button  v-on:click="addMore(dataProduct.id)" :disabled="dataProduct.entry != '' && dataProduct.price != null && dateAdd != '' && dataProduct.price != '' && dataProduct.price != 0 && provider.name != '' ? false : true" v-if="validForm == 3" type="success">Agregar</base-button>
                        </div>
                    </form>
                </a-spin>
            </template>
        </card>
    </modal>
    <modal :show.sync="modals.modal6"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
        <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
        <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
                <div style="margin-top:-30%" class="text-center mb-4">
                    Editar producto
                </div>
                <form role="form">
                    <base-input alternative
                                class="mb-3"
                                placeholder="Nombre"
                                v-model="dataProduct.product"
                                addon-left-icon="fa fa-edit">
                    </base-input>
                    <select  class="form-control mb-3"  v-model="dataProduct.measure">
                      <option style="color:black;" selected value="">Seleccione el tipo de medida</option>
                      <option style="color:black;" value="Gramo(s)">Gramo(s)</option>
                      <option style="color:black;" value="Kilogramo(s)">Kilogramo(s)</option>
                      <option style="color:black;" value="Litro(s)">Litro(s)</option>
                      <option style="color:black;" value="Mililitro(s)">Mililitro(s)</option>
                      <option style="color:black;" value="Unidad">Unidad</option>
                    </select>
                    <base-input alternative
                          placeholder="Numero para alerta"
                          v-model="dataProduct.alertTotal"
                          addon-left-icon="fa fa-bell">
                    </base-input>	
                </form>
            </template>
            <div class="text-center">
              <base-button v-on:click="editProduct()" :disabled="dataProduct.product != '' && dataProduct.measure != '' && dataProduct.alertTotal != '' ? false : true" type="default">Editar</base-button>
            </div>
        </card>
    </modal>
    <modal :show.sync="modals.modal3"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
        <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
        <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
                <div style="margin-top:-30%" class="text-center text-muted mb-4">
                    <small>Datos del provedor</small>
                </div>
                <form role="form">
                    <base-input  alternative
                                placeholder="Nombre de la empresa"
                                v-model="provider.name"
                                v-on:keyup="validProviders()"
                                addon-left-icon="fa fa-user-tie"
                                addon-right-icon="fa fa-asterisk text-danger">
                    </base-input>
                    <base-input  alternative
                                placeholder="RUT de la empresa"
                                v-model="provider.document"
                                v-on:change="provider.rut = formatRut(provider.rut)"
                                addon-left-icon="fa fa-key"
                                addon-right-icon="fas fa-plus text-default">
                    </base-input>
                    <base-input  alternative
                                placeholder="Contacto de la empresa"
                                v-model="provider.contact"
                                v-on:keyup="validProviders()"
                                addon-left-icon="fa fa-address-book"
                                addon-right-icon="fa fa-asterisk text-danger"
                                >
                    </base-input>
                    <base-input  alternative
                                placeholder="Contacto adicional"
                                v-model="provider.contactPlus"
                                addon-left-icon="fa fa-address-book"
                                addon-right-icon="fas fa-plus text-default">
                    </base-input>
                    <base-input  alternative
                                placeholder="Dirección de la empresa"
                                v-model="provider.location"
                                v-on:keyup="validProviders()"
                                addon-left-icon="fas fa-route"
                                addon-right-icon="fa fa-asterisk text-danger">
                    </base-input>
                </form>
            </template>
            <div class="text-center">
              <base-button v-on:click="providerFunction()"  :disabled="providerSup.validProvider" type="default">{{providerSup.typeProvider}}</base-button>
            </div>
        </card>
    </modal>
    <a-modal v-model="modals.modal4" width="60%" title="Cierre de inventario" :closable="true" >
        <template>
            <a-table :columns="columnsByClose" :data-source="productsToClose" :pagination="false" :scroll="getScreen">
                <template slot="goal-slot" slot-scope="record, column, index" index>
                    <a-input placeholder="Meta a consumir" @wheel="$event.target.blur()" type="number" @keyup="calculatedTotal(column.goal, index)" v-model="column.goal"/>
                </template>
                <template slot="total-slot" slot-scope="record, column, index">
                    <a-input placeholder="Peso real" @wheel="$event.target.blur()" type="number" @keyup="calculatedTotal(column.real, index)" v-model="column.real"/>
                </template>
                <template slot="consume-slot" slot-scope="record">
                    {{record.toFixed(2)}}
                </template>
                
            </a-table>
        </template>
        <template slot="footer">
            <base-button v-on:click="closeStore" size="sm" type="success">
                <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                Cerrar inventario
            </base-button>
        </template>
    </a-modal>
    <!-- <modal :show.sync="modals.modal4" modal-classes="modal-dialog-centered modal-lg">
      <h6 slot="header" class="modal-title" id="modal-title-default">Cierre de inventario</h6>
      <vue-custom-scrollbar style="height:30vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
        <div class="row p-2 m-2">
          <div class="col-6">
            Nombre del producto
          </div>
          <div class="col-6 text-left">
            Total real
          </div>
        </div> 
        <div v-for="(data, index) in products" :key="index" class="row p-2 m-2">
          <dt class="col-6 mt-2">{{data.product}}</dt>

          <base-input class="col-6" v-model="countProduct[index].count" :placeholder="'Ingrese cantidad en '+data.measure"></base-input>
        </div>
      </vue-custom-scrollbar> 
      
      <template slot="footer">
          <base-button v-on:click="closeStore" type="default">Cerrar inventario</base-button>
          <base-button type="link" class="ml-auto" @click="modals.modal4 = false">Salir
          </base-button>
      </template>
    </modal> -->
    <modal  modal-classes="modal-dialog-centered modal-xl" :show.sync="modals.modal5">
        <h6 slot="header" class="modal-title" id="modal-title-default">Informe de cierre</h6>

        <template>
            <div class="p-2">
                <a-config-provider>
                    <template #renderEmpty>
                        <div style="text-align: center">
                            <a-icon type="warning" style="font-size: 20px" />
                            <h2>No hay ningun registro</h2>
                        </div>
                    </template>
                    <a-table :columns="columnsHistoryClosedReport" :loading="productState" :data-source="dataHistoryClosedReport" :scroll="getScreen">
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
                <p>
                    <b>Total por gastar</b> {{totalPerExpense | formatPrice}} | <b>Total en stock</b> {{totalStock | formatPrice}}
                </p>   
            </div>
        </template>
        <base-button type="default" size="sm" class="float-right" @click="printHistory">Imprimir reporte</base-button>
    </modal>
    <modal modal-classes="modal-dialog-centered modal-xl" :show.sync="modalAdminProduct.modal1">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestion de sucursales</h6>
        <base-button v-for="branch in branches" :key="branch" class="col-12 mt-1" v-on:click="getInventoryByBranch(branch._id, branch.name)" type="primary">
            <span class="float-left">{{branch.name}}</span>
            <span class="float-right ml-1">{{branch.productsCount}}</span> 
            <a-tooltip placement="topLeft">
                <template slot="title">
                    <span>Productos totales.</span>
                </template>
                <a-icon class="float-right" style="cursor: pointer;vertical-align: -0.4em;font-size:1.4em" type="inbox" />
            </a-tooltip>      
        </base-button>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="modalAdminProduct.modal1 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-lg" :show.sync="modalAdminProduct.modal2">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestionar productos de sucursal </h6>
        <a-empty v-if="branchData.length == 0">
            <span slot="description"> Esta sucursal no posee ningun producto registrado </span>
        </a-empty>
        <base-button v-for="(branch, index) in branchData" :key="branch" class="col-12 mb-1" style="cursor:default" size="sm" type="secondary">
            <div class="row p-0">
                <div class="col-5 p-0">
                    <base-button size="sm" class="float-left ml-2 mr-0" type="danger" @click="deleteProductByBranch(branch)" icon="fa fa-trash"></base-button>
                    <base-button size="sm" class="float-left ml-1" type="primary" @click="modalAdminProduct.modal4 = true, idForAlert = branch._id, branchAlert = branch.alertTotal" icon="ni ni-bell-55"></base-button>
                    <span style="vertical-align: -0.4em;" class="text-danger" v-if="(parseFloat(branch.quantity) + parseFloat(branch.entry)) - parseFloat(branch.consume) < branch.alertTotal">
                        {{branch.product}}
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <span>Este producto necesita ser reabastecido.</span>
                            </template>
                            <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;font-size:1.1em" type="exclamation-circle" />
                        </a-tooltip>
                    </span>
                    <span style="vertical-align: -0.4em;" v-else>
                        {{branch.product}}
                    </span>
                </div>
                <div class="col-7 row p-0">
                    <a-input
                        :placeholder="'Ingrese cantidad en '+branch.measure"
                        class="w-75 ml-auto float-right"
                        v-model="branchEntry[index].count"
                    />
                    <base-button size="sm" class="float-right ml-auto" type="success" @click="addToProductBranch(branch._id, branch.storeId, branch.measure, index)" icon="fa fa-plus"></base-button>
                </div>
            </div>
        </base-button>
        <template slot="footer">
            <base-button type="success" class="ml-auto" @click="modalAdminProduct.modal3 = true, selectLoad()">Agregar un producto
            </base-button>
            <base-button type="link" class="mr-auto" @click="modalAdminProduct.modal2 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-lg" :show.sync="modalAdminProduct.modal3">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestionar productos de sucursal </h6>
        <a-empty v-if="productsForBranch.length == 0">
            <span slot="description"> No existen productos en la bodega </span>
        </a-empty>
        <a-select v-if="productsForBranch.length > 0" class="input-group-alternative w-100 mb-4 mt-2" default-value="Seleccione un producto"   size="large">
            <a-select-option v-for="product of productsForBranch" :key="product" :value="product.name" @click="selectProductForBranch(product.data)" :disabled="product.disabled">
                {{product.name}}
            </a-select-option>
        </a-select>
        <template slot="footer">
            <base-button type="success" class="ml-auto" @click="addProductToBranch">Agregar
            </base-button>
            <base-button type="link" class="mr-auto" @click="modalAdminProduct.modal3 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-lg" :show.sync="modalAdminProduct.modal4">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestionar productos de sucursal </h6>
        <div class="text-center text-muted mb-4">
            <small>Anexa mas productos.</small>
        </div>
        <base-input alternative
            placeholder="Numero para alerta"
            v-model="branchAlert"
            addon-left-icon="fa fa-bell">
        </base-input>
        <template slot="footer">
            <base-button type="success" class="ml-auto" @click="addAlertToBranch">Agregar
            </base-button>
            <base-button type="link" class="mr-auto" @click="modalAdminProduct.modal4 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <a-modal v-model="modals.modal7" width="300px" :title="'Descontar a '+productToDiscount" :closable="true" >
        <template>
            <base-input  alternative
                placeholder="Cantidad a reducir"
                class="mt-2"
                v-model="discountProduct"
                addon-left-icon="ni ni-basket"
                addon-right-icon="fa fa-asterisk text-danger">
            </base-input>
        </template>
        <template slot="footer">
            <base-button @click="discountProduction" :disabled="discountProduct != '' && discountProduct > 0 ? false : true" size="sm" type="success">
                <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                Descontar
            </base-button>
        </template>
    </a-modal>
  </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import EventBus from '../components/EventBus'
import { Empty } from 'ant-design-vue';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {Spanish} from 'flatpickr/dist/l10n/es.js';
import XLSX from 'xlsx'
// COMPONENTS

import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        flatPicker,
        vueCustomScrollbar
    },
    data() {
      return {
        countProduct:[],
        usuario: localStorage.nombre + ' ' + localStorage.apellido,
        myId:null,
        historyClosed:[],
        validForm:0,
        branches:[],
        branchData:[],
        selectedBranchName: '',
        branchEntry: [],
        branchAlert: '',
        idForAlert:'',
        selectedBranch:'',
        productsForBranch:[],
        productForBranch:'',
        productState: true,
        discountProduct: '',
        productToDiscount: '',
        productDiscountId: '',
        productMeasure: '',
        productPromedy: 0,
        providerSup:{
          validProvider:false,
          typeProvider:'',
        }, 
        loadData: false,
        idReport: '',
        history:[],
        provider:{
          name: 'Seleccione un proveedor',
          document:'',
          contact:'',
          contactPlus:'',
          location:'',
        },
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database,
                'x-access-token':localStorage.userToken
            }
        },
        providers:[],
        providerTable:[],
        dateAdd:'',
        addValid:true,
        configDatePicker: {
          allowInput: true,
          dateFormat: 'm-d-Y',
          locale: Spanish,        
        },
        modals: {
          modal1: false,
          modal3: false,
          modal4: false,
          modal5: false,
          modal6: false,
          modal7: false
        },
        modalAdminProduct: {
          modal1: false,
          modal2: false,
          modal3: false,
          modal4: false
        },
        dataProduct:{
          product:'',
          price:'',
          measure:'',
          quantity:'',
          entry:'',
          alertTotal:'',
          id:null
        },
        products: [],
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        productsToClose: [],
        columnsByClose: [
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
                title: 'Consume del mes',
                dataIndex: 'consume',
                key: 'consume',
                scopedSlots: { customRender: 'consume-slot' },
            },
            {
                title: 'Meta',
                dataIndex: 'goal',
                key: 'goal',
                scopedSlots: { customRender: 'goal-slot' },
            },
            {
                title: 'Total real',
                dataIndex: 'real',
                key: 'real',
                scopedSlots: { customRender: 'total-slot' },
            }
        ],
        columns: [
            {
                title: 'Producto',
                dataIndex: 'product',
                key: 'product',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
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
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Precio promedio',
                dataIndex: 'promedyPrice',
                key: 'promedyPrice',
                ellipsis: true,
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.promedyPrice - b.promedyPrice,
            },
            {
                title: 'Tipo de medida',
                dataIndex: 'measure',
                key: 'measure',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.measure.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Cantidad inicial',
                dataIndex: 'quantity',
                key: 'quantity',
                ellipsis: true,
                scopedSlots: { customRender: 'quantity' },
                sorter: (a, b) => a.quantity - b.quantity,
            },
            {
                title: 'Cantidad ingresada',
                dataIndex: 'entry',
                key: 'entry',
                ellipsis: true,
                scopedSlots: { customRender: 'entry' },
                sorter: (a, b) => a.entry - b.entry,
            },
             {
                title: 'Consumo',
                dataIndex: 'consume',
                key: 'consume',
                ellipsis: true,
                scopedSlots: { customRender: 'consume' },
                sorter: (a, b) => a.consume - b.consume,
            },
            {
                title: 'Total',
                key: '_id',
                ellipsis: true,
                scopedSlots: { customRender: 'total' },
                sorter: (a, b) => (a.quantity + a.entry - a.consume) - (b.quantity + b.entry - b.consume),
            },
            {
                title: 'Acciones',
                dataIndex: 'action',
                key: 'action',
                scopedSlots: { customRender: 'actions' },
                width: '15%'
            }
        ],
        columnsProviders: [
            {
                title: 'Nombre de la empresa',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.name > b.name) {
                        return -1;
                    }
                    if (b.name > a.name) {
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
                onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Documento',
                dataIndex: 'document',
                key: 'document',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.document.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Contacto',
                dataIndex: 'contact',
                key: 'contact',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.contact.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Contacto adicional',
                dataIndex: 'contactPlus',
                key: 'contactPlus',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.contactPlus.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Ubicación',
                dataIndex: 'location',
                key: 'location',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.location.toString().toLowerCase().includes(value.toLowerCase()),
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
        columnsHistory: [
            {
                title: 'Fecha',
                dataIndex: 'date',
                key: 'date',
                ellipsis: true,
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
                scopedSlots: {
                    customRender: 'date',
                },
            },
            {
                title: 'Producto',
                dataIndex: 'product',
                key: 'product',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
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
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Anexado',
                dataIndex: 'entry',
                key: 'entry',
                ellipsis: true,
                scopedSlots: { customRender: 'anexe' },
            },
            {
                title: 'Medida',
                dataIndex: 'measure',
                key: 'measure',
                ellipsis: true
            },
            {
                title: 'Precio',
                dataIndex: 'price',
                key: 'price',
                ellipsis: true,
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.price - b.price,
            },
            {
                title: 'Provedor',
                dataIndex: 'provider',
                key: 'provider',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'provide',
                },
                onFilter: (value, record) => record.provider.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Precio por medida',
                dataIndex: 'promedyPrice',
                key: 'promedyPrice',
                ellipsis: true
            },
        ],
        columnsHistoryClosed: [
            {
                title: 'Fecha',
                dataIndex: 'createdAt',
                key: 'createdAt',
                ellipsis: true,
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                scopedSlots: {
                    customRender: 'date',
                },
            },
            {
                title: 'Encargado del cierre',
                dataIndex: 'user',
                key: 'user',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.user > b.user) {
                        return -1;
                    }
                    if (b.user > a.user) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'user',
                },
                onFilter: (value, record) => record.user.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Productos totales',
                dataIndex: 'totalProduct',
                key: 'totalProduct',
                ellipsis: true
            },
            {
                title: 'Informe',
                dataIndex: '_id',
                scopedSlots: {
                    customRender: 'report',
                },
                key: '_id',
                ellipsis: true
            },
        ],
        columnsHistoryClosedReport: [
            {
                title: 'Producto',
                dataIndex: 'product',
                key: 'product',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'product',
                },
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Medida',
                dataIndex: 'measure',
                key: 'measure',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.measure > b.measure) {
                        return -1;
                    }
                    if (b.measure > a.measure) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'measure',
                },
                onFilter: (value, record) => record.measure.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Total ideal',
                dataIndex: 'ideal',
                key: 'ideal',
                ellipsis: true,
                scopedSlots: { customRender: 'ideal-slot' }
            },
            {
                title: 'Total real',
                dataIndex: 'real',
                key: 'real',
                ellipsis: true,
                scopedSlots: { customRender: 'real-slot' }
            },
            {
                title: 'Diferencia',
                dataIndex: 'difference',
                key: 'difference',
                ellipsis: true
            },
            {
                title: 'Meta',
                dataIndex: 'goal',
                key: 'goal',
                ellipsis: true
            },
            {
                title: 'Por comprar',
                dataIndex: 'totalBuy',
                key: 'totalBuy',
                ellipsis: true,
                scopedSlots: { customRender: 'buy-slot' }
            },
            {
                title: 'Por gastar',
                dataIndex: '_id',
                key: '_id',
                ellipsis: true,
                scopedSlots: { customRender: 'perExpense-slot' }
            },
            {
                title: 'Stock',
                dataIndex: 'createdAt',
                key: 'createdAt',
                ellipsis: true,
                scopedSlots: { customRender: 'stock-slot' }
            }
        ],
        firstNameUser: '',
        lastNameUser: '',
        emailUser: '',
        idUser: '',
        dataHistoryClosed: [],
        dataHistoryClosedReport: [],
        dataHistory: [],
        branchName: '',
        branch: '',
        totalPerExpense: 0,
        totalStock: 0,
        totalStockActual: 0
      };
    },
    created(){
      this.getProducts();
      this.getProviders();
      this.getHistoryClosed();
      this.getUserData()
      this.getHistory()
    //   this.getBranches()
    //   this.getBranch()
    },
    methods: {
        getUserData(){
            this.firstNameUser = localStorage.firstname  
            this.lastNameUser = localStorage.lastname
            this.emailUser = localStorage.email
            this.idUser = localStorage._id
        },
        calculatedTotal(record, index){
            if (record.length > 0) {
                this.productsToClose[index].totalBuy = parseFloat(this.productsToClose[index].goal) - parseFloat(this.productsToClose[index].real)
            }
        },
        sumTotals(products){
            this.totalPerExpense = 0
            this.totalStock = 0
            for (const product of products) {
                const totalBuy = product.totalBuy > 0 ? parseFloat(product.totalBuy) : 0
                this.totalPerExpense = this.totalPerExpense + (totalBuy * product.promedyPrice)
                
                this.totalStock = (this.totalStock + (parseFloat(product.real) * product.promedyPrice))
            }
        },
        async getProducts() {
            this.countProduct = []
            this.totalStockActual = 0
            try{
                const getAllProducts = await axios.get(endPoint.endpointTarget+'/stores/getstore', this.configHeader)
                if (getAllProducts.data.status == 'ok') {
                    this.products = getAllProducts.data.data
                    for (const product of this.products) {
                        product.action = new Date().getTime()
                    }
                    this.productsToClose = getAllProducts.data.data
                    for (const productToClose of this.productsToClose) {
                        productToClose.goal = ''
                        productToClose.real = ''
                        productToClose.totalBuy = parseFloat(productToClose.consume)
                    }
                    for (let index = 0; index < this.products.length; index++) {
                        var ideal = (this.products[index].quantity + this.products[index].entry) - this.products[index].consume
                        this.countProduct.push({id: this.products[index]._id,count: '', ideal: ideal, measure: this.products[index].measure, product: this.products[index].product, difference: ''})
                        this.totalStockActual = this.totalStockActual + (((this.products[index].quantity + this.products[index].entry) - this.products[index].consume) * this.products[index].promedyPrice)
                    } 
                    this.productState = false
                }else{
                    this.products = []
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
        async discountProduction(){
            try{
                const updateProduct = await axios.put(endPoint.endpointTarget+'/stores/discountProductStore/'+this.productDiscountId, {
                    quantity: this.discountProduct,
                    firstNameUser: localStorage.firstname,
                    lastNameUser: localStorage.lastname,
                    emailUser: localStorage.email,
                    product: this.productToDiscount,
                    measure: this.productMeasure,
                    productPromedy: this.productPromedy
                }, this.configHeader)
                if (updateProduct.data.status == 'ok') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        title: 'Descuento hecho con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.discountProduct = ''
                    this.productToDiscount = ''
                    this.productDiscountId = ''
                    this.productMeasure = ''
                    this.productPromedy = 0
                    this.modals.modal7 = false
                    this.getProducts()
                    this.getHistory()
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
        async getProviders() {
          try{
            const getProviders = await axios.get(endPoint.endpointTarget+'/stores/getproviders', this.configHeader)
            if (getProviders.data.status == 'ok') {
              this.providerTable = getProviders.data.data
              for (let i = 0; i < getProviders.data.data.length; i++) {
                  this.providers.push(getProviders.data.data[i].name)
              }
            }else{
                this.providerTable = []
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
        async getHistory() {
          try{
            const getHistory = await axios.get(endPoint.endpointTarget+'/stores/getstorehistory', this.configHeader)
            if (getHistory) {
              this.dataHistory = getHistory.data.data
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
        async getBranches() {
            try{
                const getBranches = await axios.get(endPoint.endpointTarget+'/branches', this.configHeader)
                if (getBranches) {
                    this.branches = getBranches.data.data
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
        selectLoad(){
            this.productsForBranch = []
            for (let i = 0; i < this.products.length; i++) {
                var valid = false
                const element = this.products[i];
                if (this.branchData) {
                   for (let e = 0; e < this.branchData.length; e++) {
                        const elementE = this.branchData[e];
                        if (elementE.product == element.product ) {
                            valid = true
                            break
                        }
                    } 
                }
                if (valid) {
                    this.productsForBranch.push({data:element, name: element.product, disabled:true})
                }else{
                    this.productsForBranch.push({data:element, name: element.product, disabled:false})
                }
            }
        },
        selectProductForBranch(value){
            this.productForBranch = value
        },
        addProductToBranch() {
            this.$swal({
                title: '¿Está seguro que desea agregar este producto?',
                type: 'warning',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Estoy seguro',
                cancelButtonText: 'No, evitar acción',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.post(endPoint.endpointTarget+'/stores/registertobranch',{
                        branch: this.selectedBranch,
                        storeId: this.productForBranch._id,
                        product: this.productForBranch.product,
                        measure: this.productForBranch.measure,
                        price: this.productForBranch.price 
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'product registered') {
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                title: 'El producto fue agregado a la sucursal',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getInventoryByBranch(this.selectedBranch)
                            this.getBranches()
                            this.productsForBranch = []
                            setTimeout(() => {
                                this.selectLoad()
                            }, 200);   
                        }
                    }).catch(err => {
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            title: 'Problemas con el servidor',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        console.log(err)
                    })
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        addToProductBranch(id, storeId, measure, index) {
            axios.get(endPoint.endpointTarget+'/stores/getstorebyid/' + storeId, this.configHeader)
            .then(res => {
                var total = (res.data.data.quantity + res.data.data.entry) - res.data.data.consume
                if (this.branchEntry[index].count <= total ) {
                    this.productForBranch = res.data.data
                    this.$swal({
                        title: '¿Está seguro que desea agregar ' + this.branchEntry[index].count + ' ' + measure + ' a este producto?',
                        type: 'warning',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Estoy seguro',
                        cancelButtonText: 'No, evitar acción',
                        showCloseButton: true,
                        showLoaderOnConfirm: true
                    }).then((result) => {
                        if(result.value) {
                            axios.post(endPoint.endpointTarget+'/stores/addtobranch',{
                                branch: this.selectedBranch,
                                branchName: this.selectedBranchName,
                                id:id,
                                storeId: this.productForBranch._id,
                                product: this.productForBranch.product,
                                measure: this.productForBranch.measure,
                                price: this.productForBranch.price,
                                entry: this.branchEntry[index].count,
                                firstNameUser: this.firstNameUser,
                                lastNameUser: this.lastNameUser,
                                emailUser: this.emailUser,
                                idUser: this.idUser 
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == 'added') {
                                    axios.post(endPoint.endpointTarget+'/expenses/', {
                                        branch: this.branch,
                                        detail: `Producto (${this.productForBranch.product}) ingresado al inventario`,
                                        amount: this.productForBranch.price * this.branchEntry[index].count,
                                        type: 'Inventario',
                                    }, this.configHeader)
                                    .then(res => {
                                        if (res.data.status == 'ok') {
                                            this.$swal({
                                                type: 'success',
                                                icon: 'success',
                                                title: 'La cantidad fue agregada a la sucursal',
                                                showConfirmButton: false,
                                                timer: 1500
                                            })
                                            this.branchEntry = []
                                            for (let i = 0; i < this.branchData.length; i++) {
                                                this.branchEntry.push({count: ''})
                                            }
                                            this.getProducts()
                                            this.getHistory()
                                        }
                                    }).catch(err => {
                                        this.$swal({
                                            type: 'error',
                                            icon: 'error',
                                            title: 'Problemas con el servidor',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        console.log(err)
                                    })
                                }
                            }).catch(err => {
                                this.$swal({
                                    type: 'error',
                                    icon: 'error',
                                    title: 'Problemas con el servidor',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                console.log(err)
                            })
                        }
                        else{
                            this.$swal({
                                type: 'error',
                                icon: 'error',
                                title: 'Acción cancelada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'La bodega no dispone de la cantidad ingresada',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            })
            
        },
        deleteProductByBranch(data){
            this.$swal({
            title: '¿Está seguro de eliminar el producto de la sucursal?',
            type: 'warning',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Estoy seguro',
            cancelButtonText: 'No, evitar acción',
            showCloseButton: true,
            showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.delete(endPoint.endpointTarget+'/stores/deleteinventoryproduct/'+data._id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'product deleted') {
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                title: 'El producto fue eliminado con exito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getProducts()
                            this.getInventoryByBranch(this.selectedBranch)
                        }
                    }).catch(err => {
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            title: 'Problemas con el servidor',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        console.log(err)
                    })
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        async getHistoryClosed() {
            try{
                const getHistoryClosed = await axios.get(endPoint.endpointTarget+'/stores/getstoreclosed', this.configHeader)
                console.log(getHistoryClosed)
                if (getHistoryClosed.data.status == 'ok') {
                    this.dataHistoryClosed = getHistoryClosed.data.data
                }else{
                    this.dataHistoryClosed = []
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
        validDataProduct(){
            if (this.dataProduct.product != '' && this.dataProduct.measure != '' && this.dataProduct.price != null && this.dataProduct.alertTotal != '' && this.dataProduct.price != 0) {
                return true
            }else{
                return false
            }
        },
        addAlertToBranch(){
            axios.put(endPoint.endpointTarget+'/stores/editstockalarmfrominventory/'+ this.idForAlert, {
                stock: this.branchAlert
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        title: 'Alerta actualizada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.getInventoryByBranch(this.selectedBranch)
                    this.modalAdminProduct.modal4 = false
                }
            }).catch(err => {
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Problemas con el servidor',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(err)
            })
        },
        addProduct(){
            this.loadData = true
            axios.post(endPoint.endpointTarget+'/stores', {
                product: this.dataProduct.product,
                measure: this.dataProduct.measure,
                alertTotal: this.dataProduct.alertTotal
            }, this.configHeader)
            .then(res => {  
                if (res.data.status === 'product registered') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        title: '¡Producto registrado con exito!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.modals.modal1 = false
                    this.loadData = false
                    this.getProducts();
                    this.initialState(3)
                }else{
                    this.loadData = false
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: '¡Producto ya existe!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch(err => {
                this.loadData = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Problemas con el servidor',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(err)
            })
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
        addProvider(){
            axios.post(endPoint.endpointTarget+'/stores/addprovider', {
              name: this.provider.name,
              document:this.provider.document,
              contact:this.provider.contact,
              contactPlus:this.provider.contactPlus,
              location:this.provider.location
            }, this.configHeader)
            .then(res => {
              if (res.data.status === 'provider registered') {
                  this.$swal({
                    type: 'success',
                    icon: 'success',
                    title: 'Provedor registrado',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  this.provider = {
                    name:'',
                    rut:'',
                    contact:'',
                    contactPlus:'',
                    direction:'',
                  }
                  this.modals.modal3 = false
                  if (this.modals.modal1 == false) {
                      document.getElementById("provedorBtn").click()
                  } 
                  this.getProducts();
                  this.getProviders();
              }else{
                  this.$swal({
                  type: 'error',
                  title: 'Provedor existe',
                  showConfirmButton: false,
                  timer: 1500
                  })
              }
            }).catch(err => {
                this.$swal({
                    type: 'error',
                    title: 'Problemas con el servidor',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(err)
            })
        },
        initialState(type,id){
            if (type == 1) {
                this.myId = id
                this.dateAdd = ''
                this.dataProduct.price = ''
                this.provider.name = ''
                $('.resetProv .ant-select-selection__clear').click()
                
            }
            if (type == 2) {
            this.provider = {
                name:'',
                rut:'',
                contact:'',
                contactPlus:'',
                direction:'',
            }
            this.providerSup.validProvider = true
            }
            if(type == 3){
            this.dataProduct = {
                product:'',
                price:0,
                measure:'',
                quantity:'',
                entry:'',
                alertTotal:'',
                id:null
            }
            this.unit = ''
            }
        },
        printHistory(){
            var dataArray = []
            for (const product of this.dataHistoryClosedReport) {
                dataArray.push({
                    Producto: product.product,
                    Medida: product.measure,
                    "Total ideal": product.ideal,
                    "Total real": product.real,
                    Diferencia: product.difference,
                    Meta: product.goal,
                    "Por comprar": product.totalBuy,
                    "Por gastar": product.totalBuy > 0 ? parseFloat(product.totalBuy) * product.promedyPrice : 0,
                    Stock: parseFloat(product.real) * product.promedyPrice
                })
            }
            var Datos = XLSX.utils.json_to_sheet(dataArray) 
            var wb = XLSX.utils.book_new() 
            XLSX.utils.book_append_sheet(wb, Datos, 'Datos') 
            XLSX.writeFile(wb, 'Cierre '+this.$options.filters.formatDate(this.idReport)+'.xlsx') 

//             let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
// width=0,height=0,left=-1000,top=-1000`;
//             var win = window.open(endPoint.url+'/#/pdfReportHistory?id='+this.idReport, '_blank', params)
//             win.focus();
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return dateFormat.getDate()+"-"+(dateFormat.getMonth() + 1)+"-"+dateFormat.getFullYear()
        },
        formatPrice(value) {
            if (value == 'Abastecimiento') {
                return value
            }else{
                let val = (value/1).toFixed(2).replace('.', ',')
                return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
        },
        updateProvider(){
            axios.put(endPoint.endpointTarget+'/stores/updateProvider/'+this.provider.id, {
                name:this.provider.name,
                document: this.provider.document,
                contact:this.provider.contact,
                contactPlus:this.provider.contactPlus,
                location:this.provider.location
            }, this.configHeader)
            .then(res => {
              if (res.data.status == 'provider edited') {
                this.$swal({
                    type: 'success',
                    icon: 'success',
                    title: 'Provedor Actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.getProviders();
                this.modals.modal3 = false
              }else{
                this.$swal({
                  type: 'error',
                  icon: 'error',
                  title: 'El nuevo documento del provedor ya se encuentra registrado',
                  showConfirmButton: false,
                  timer: 1500
                })
              }    
            }).catch(err => {
              this.$swal({
                type: 'error',
                title: 'El provedor no fue actualizado intente de nuevo',
                showConfirmButton: false,
                timer: 1500
              })
              console.log(err)
            })
        },
        addMore(){
            this.loadData = true
            axios.put(endPoint.endpointTarget+'/stores/add/'+this.myId, {
                entry: this.dataProduct.entry,
                history: {
                    id:this.myId,
                    date:this.dateAdd,
                    product:this.dataProduct.product,
                    entry:this.dataProduct.entry,
                    measure:this.dataProduct.measure,
                    price:this.dataProduct.price,
                    provider: this.provider.name,
                    firstNameUser: this.firstNameUser,
                    lastNameUser: this.lastNameUser,
                    emailUser: this.emailUser,
                    idUser: this.idUser
                },  
            }, this.configHeader)
            .then(res => {
                this.$swal({
                    type: 'success',
                    icon: 'success',
                    title: '¡Producto actualizado con exito!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.provider.name = ''
                this.modals.modal1 = false
                this.loadData = false 
                this.getProducts();
                this.getHistory()
            }).catch(err => {
                this.loadData = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'El producto no fue actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(err)
            })
        },
        selectProviderForProduct(value){
            this.provider.name = value
        },
        deleteProvider(id){
            this.$swal({
            title: '¿Está seguro de borrar el provedor?',
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
                    axios.delete(endPoint.endpointTarget+'/stores/deleteprovider/'+id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'provider deleted') {
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                title: 'Provedor borrado con exito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getProviders()
                        }
                    }).catch(err => {
                        this.$swal({
                            type: 'error',
                            title: 'Problemas con el servidor',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        console.log(err)
                    })
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Accion cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        deleteItem(id){
            this.$swal({
                title: '¿Está seguro de borrar el producto? tambien se borrara de todas las sucursales donde este registrado.',
                text: 'No puedes revertir esta acción',
                type: 'warning',
                icon:'warning',
                showCancelButton: true,
                confirmButtonText: 'Estoy seguro',
                cancelButtonText: 'No, evitar acción',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.delete(endPoint.endpointTarget+'/stores/deletestoreproduct/'+id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'product deleted') {
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                title: 'Producto borrado con exito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getProducts()
                        }
                    })
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        closeStore(){
            // console.log(this.productsToClose)
            var valid = true
            for (const product of this.productsToClose) {
                product.goal = product.goal != '' || product.goal.includes('.' || ',') ? parseFloat(product.goal.replace('.' || ',', '')) : ''
                product.real = product.real != '' || product.goal.includes('.' || ',') ? parseFloat(product.real.replace('.' || ',', '')) : ''
                if (product.goal == '' || product.real == '') {
                    valid = false
                    break
                }
            }
            if (valid) {
                axios.post(endPoint.endpointTarget+'/stores/closestore', {
                    firstNameUser: this.firstNameUser,
                    lastNameUser: this.lastNameUser,
                    emailUser: this.emailUser,
                    idUser: this.idUser, 
                    products: this.productsToClose
                }, this.configHeader)
                .then(res => {
                    if (res.data.status === 'closed') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            title: 'Cierre realizado con exito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.getProducts();
                        this.getHistoryClosed()
                    }
                    else{
                        this.$swal({
                            type: 'error',
                            title: 'Ya se hizo un cierre este mes',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }).catch(err => {
                    this.$swal({
                        type: 'error',
                        title: 'Problemas tecnicos intente de nuevo',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
            }else{
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Por favor llene todos los campos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        validProviders(){
            if (this.provider.name != '' && this.provider.contact != '' && this.provider.location != '') {
              this.providerSup.validProvider = false
            }
            else{
              this.providerSup.validProvider = true
            }
        },
        pushDataProvider(name,document,contact,contactPlus,location,id){
            this.provider = {
              name:name,
              document:document,  
              contact:contact,
              contactPlus:contactPlus,
              location:location,
              id:id
            }
        },
        providerFunction(){
            if (this.providerSup.typeProvider == 'Registrar') {
              this.addProvider()
            }
            else{
              this.updateProvider()
            }
        },
        pushDataProduct(product, measure, alertTotal, id){
            this.modals.modal6 = true
            console.log(product, measure, alertTotal, id)
            this.dataProduct = {
                product: product,
                price: '',
                measure: measure,
                quantity:'',
                entry:'',
                alertTotal: alertTotal,
                id:id
            }
        },
        editProduct(){
            this.$swal({
              title: '¿Está seguro de editar el producto? tambien se editara de todas las sucursales donde este registrado.',
              text: 'No puedes revertir esta acción',
              type: 'warning',
              icon:'warning',
              showCancelButton: true,
              confirmButtonText: 'Estoy seguro',
              cancelButtonText: 'No, evitar acción',
              showCloseButton: true,
              showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.put(endPoint.endpointTarget+'/stores/'+this.dataProduct.id, {
                        product:this.dataProduct.product,
                        measure:this.dataProduct.measure,
                        price:this.dataProduct.price,
                        alertTotal:this.dataProduct.alertTotal,
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'store edited') {
                            this.$swal({
                                icon: 'success',
                                title: 'Producto editado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.modals.modal6 = false
                            this.getProducts();
                        }
                        else if (res.data.status == 'product already in use') {
                            this.$swal({
                                type: 'error',
                                icon: 'error',
                                title: 'El nombre del producto ya se encuentra registrado en la bodega',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else{
                            this.$swal({
                                type: 'error',
                                icon:'error',
                                title: 'Hubo un problema',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }
                else{
                    this.$swal({
                        type: 'error',
                        icon:'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        formatRut(value) {
            let around = value.length - 2
            let concat = ''
            for (let index = 0; index < value.length; index++) {
              concat = concat + value[index]
              if (around == index) {
                concat = concat + '.'
              }
            } 
            let val = concat.replace('.', '-')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    },
    mounted() {
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 400 }
        }
    }
  }
</script>
<style lang="scss">
  .card-header{
    font-size: 2.5vw;
  }
  .cursor-pointer{
    cursor: pointer;
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
</style>