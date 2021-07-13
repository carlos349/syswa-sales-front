<template>
    <div>
        <base-header class="header pb-7 pt-5  d-flex align-items-center"
                     style="min-height: 400px; background-image: url(img/theme/profile-cover.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Hola {{model.first_name}}</h1>
                        <p class="text-white mt-0 mb-5">Este es tu perfil, puedes ver tu progreso trabajando para KKPrettyNails, en las diferentes secciones. Tambien puedes editar tus datos.</p>
                        <base-button class="mb-5" type="info" v-on:click="inspector = true">Editar perfil</base-button>
                        <base-button class="mb-5" type="info" v-on:click="modals.modal2 = true">Cambiar contraseña</base-button>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
                    <div class="card card-profile shadow">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image responsiveImageProfile">
                                    <a href="#">
                                        <img style="width:150px; height:150px;" v-if="haveImage == ''" src="img/theme/profile-default.png" class="rounded-circle">
                                        <img style="width:150px; height:150px;" v-else :src="model.image" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body pt-0 pt-md-4">
                            <div class="row mt-4">
                                <div class="col">
                                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <h3>
                                    {{model.first_name}} {{model.last_name}}
                                </h3>
                                <div class="h5">
                                    <p v-if="model.status == 1">Gerente</p>
                                    <p v-if="model.status == 2">Personal de caja</p>
                                    <p v-if="model.status == 3">Prestadora</p>
                                </div>
                            </div>
                            <hr class="my-4" />
                            <p>{{model.email}} <template v-if="model.about != ''">—</template> {{model.about}}</p>
                        </div>
                    </div>
                    <card v-if="model.status == 3" class="mt-3" shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Datos del mes</h3>
                                </div>
                            </div>
                        </div>
                        <div class="card-profile-stats d-flex justify-content-center">
                            <div>
                                <span class="heading">{{formatPrice(advancement)}}</span>
                                <span class="description">Adelantos</span>
                            </div>
                            <div>
                                <span class="heading">{{formatPrice(lenderBonus)}}</span>
                                <span class="description">Bonos</span>
                            </div>
                            <div>
                                <span class="heading">{{formatPrice(comision)}}</span>
                                <span class="description">Ingresos</span>
                            </div>
                        </div>
                        <div class="card-profile-stats d-flex justify-content-center" style="padding: 0.18rem;">
                            <div>
                                <span class="heading">{{formatPrice(totalForLender)}}</span>
                                <span class="description">Ingreso total</span>
                            </div>
                        </div>
                    </card>
                </div>

                <div class="col-xl-8 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Mi perfil</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">Información de usuario</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <base-input v-if="inspector"
                                                alternative=""
                                                label="Nombre"
                                                placeholder="Username"
                                                input-classes="form-control-alternative"
                                                v-model="model.first_name"
                                            />
                                            <base-input v-else
                                                disabled alternative=""
                                                label="Nombre"
                                                placeholder="Username"
                                                input-classes="form-control-alternative"
                                                v-model="model.first_name"
                                            />
                                        </div>
                                        <div class="col-lg-6">
                                            <base-input v-if="inspector"
                                                alternative=""
                                                label="Apellido"
                                                placeholder="jesse@example.com"
                                                input-classes="form-control-alternative"
                                                v-model="model.last_name"
                                            />
                                            <base-input v-else
                                                disabled alternative=""
                                                label="Apellido"
                                                placeholder="jesse@example.com"
                                                input-classes="form-control-alternative"
                                                v-model="model.last_name"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <base-input v-if="inspector"
                                                alternative=""
                                                label="Correo"
                                                placeholder="First name"
                                                input-classes="form-control-alternative"
                                                v-model="model.email"
                                            />
                                            <base-input v-else
                                                disabled alternative=""
                                                label="Correo"
                                                placeholder="Last name"
                                                input-classes="form-control-alternative"
                                                v-model="model.email"
                                            />
                                        </div>
                                        <div class="col-lg-6 form-group">
                                            <label><strong>Imagen de perfil</strong></label>
                                            <input v-if="inspector" type="file" id="fileProfile" ref="file" v-on:change="handleFileUpload()" class="form-control mb-3" >
                                            <input v-else type="file" id="fileProfile" ref="file" disabled class="form-control mb-3" >
                                        </div>
                                    </div>
                                </div>
                                <hr class="my-4" />
                                <!-- Description -->
                                <h6 class="heading-small text-muted mb-4">Sobre ti</h6>
                                <div class="pl-lg-4">
                                    <div class="form-group">
                                        <base-input alternative="" label="Sobre mi - proximamente">
                                            <textarea v-if="inspector" v-model="model.about" rows="4" class="form-control form-control-alternative" placeholder="Unas palabras sobre ti..."></textarea>
                                            <textarea v-else disabled v-model="model.about" rows="4" class="form-control form-control-alternative" placeholder="Unas palabras sobre ti..."></textarea>
                                        </base-input>
                                    </div>
                                </div>
                                <base-button class="float-right" v-if="inspector" type="info" v-on:click="editProfile">Editar</base-button>
                                <base-button class="float-left" v-if="inspector" type="danger" v-on:click="inspector = false">Cancelar</base-button>
                            </form>
                        </template>
                    </card>
                </div>
                 <div v-if="model.status == 3" class="col-xl-12 order-xl-3 mt-3">
                    <vue-bootstrap4-table :rows="sales" :columns="columnsLender" :classes="classes" :config="configLender" >
                        <template slot="format-date" slot-scope="props">
                            <span>{{formatDate(props.row.fecha)}}</span>
                        </template>
                        <template slot="format-services" slot-scope="props">
                            <template v-for="(service, index) of props.row.services">
                                <span v-if="index == 0" :key="service">
                                    {{service.service}}
                                </span>
                                <span v-else :key="service">
                                    - {{service.service}} 
                                </span>
                            </template>
                        </template>
                        <template slot="format-amount" slot-scope="props">
                            <span>{{formatPrice(props.row.commission)}}</span>
                        </template>
                    </vue-bootstrap4-table>
                </div>
            </div>
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
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h3>Cambie su contraseña</h3>
                    </div>
                </template>
                <template>
                    <form role="form">
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Antigua contraseña"
                                    v-on:change="validRegister()"
                                    v-model="pass.lastPass"
                                    type="password"
                                    addon-left-icon="ni ni-key-25">
                        </base-input>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nuevo contraseña"
                                    v-model="pass.newPass"
                                    type="password"
                                    addon-left-icon="ni ni-key-25">
                        </base-input>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Repita la contraseña"
                                    v-model="pass.newPassVerify"
                                    :valid="pass.valid"
                                    type="password"
                                    v-on:keyup="validFields"                                    
                                    >
                        </base-input>
                        <base-button v-if="!pass.validAll" type="default" disabled>
                            Cambiar
                        </base-button>  
                        <base-button v-else type="default" v-on:click="EditPass">
                            Cambiar
                        </base-button> 
                    </form>
            </template>
            </card>
        </modal>
    </div>
</template>
<script>
    import axios from 'axios'
    import router from '../router'
    import endPoint from '../../config-endpoint/endpoint.js'
    import jwtDecode from 'jwt-decode'

    import EventBus from '../components/EventBus'
    import VueBootstrap4Table from 'vue-bootstrap4-table'
    import * as moment from 'moment';
    import 'moment/locale/es';
    moment.locale('es');
    import mixinUserToken from '../mixins/mixinUserToken'
    export default {
        mixins: [mixinUserToken],
        name: 'user-profile',
        components: {
            VueBootstrap4Table
        },
        data() {
            const token = localStorage.userToken
			const decoded = jwtDecode(token)
            return {
                id: decoded._id,
                model: {
                    first_name: '',
                    last_name: '',
                    email: '',
                    access: '',
                    image: '',
                    about: ''
                },
                modals: {
                    modal1: false,
                    modal2: false,
                    message: "",
                    icon: '',
                    type:''
                },
                inspector: false,
                monthLender: 0,
                gainLender: 0,
                file: '',
                pass: {
                    newPass: '',
                    lastPass: '',
                    newPassVerify: '',
                    valid: null,
                    validAll: null
                },
                haveImage: '',
                lenderBonus: 0,
                advancement: 0,
                totalForLender: 0,
                sales: [],
                comision: 0,
                fecha: '',
                columnsLender: [
                    {
                        label: "Fecha",
                        name: "createdAt",
                        // filter: {
                        //     type: "simple",
                        //     placeholder: "id"
                        // },
                        slot_name: "format-date",
                        sort: true,
                    },
                    {
                        label: "Servicios",
                        name: "services",
                        slot_name: "format-services",
                        sort: false,
                    },
                    {
                        label: "Ingreso",
                        name: "commission",
                        slot_name: "format-amount",
                        sort: false,
                    }
                ],
                configLender: {
                    card_title: "Mis ventas del mes",
                    checkbox_rows: false,
                    rows_selectable : false,
                    highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                    per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                    show_refresh_button: false,
                    show_reset_button: false,  
                    selected_rows_info: false,
                    preservePageOnDataChange : true,
                    pagination_info : false,
                    pagination: true,
                    global_search: {
                        placeholder: "Busque el prestador",
                        visibility: false,
                        case_sensitive: false,
                        showClearButton: true,
                        searchOnPressEnter: false,
                        searchDebounceRate: 200,                      
                    },
                },
                classes: {
                    table: "table-bordered table-striped"
                },
                configHeader: {
                    headers:{
                        "x-database-connect": endPoint.database, 
                        "x-access-token": localStorage.userToken
                    }
                },
            }
        },
        created(){
            this.getData()
            this.getYourSales()
            this.getDataLender()
        },
        methods: {
            validFields(){
                this.pass.valid = this.pass.newPass == this.pass.newPassVerify ? true : false
                this.validRegister()
            },
            validRegister(){
                this.pass.validAll = this.pass.lastPass && this.pass.valid == true ? true : false
            },
            async getData() {
				try{
					const user = await axios.get(endPoint.endpointTarget+'/users/'+this.id, this.configHeader)
                    console.log(user)
					this.model.first_name = user.data.data.first_name
					this.model.last_name = user.data.data.last_name
					this.model.email = user.data.data.email
					this.model.status = user.data.data.status
                    this.model.access = user.data.data.LastAccess
                    this.model.about = user.data.data.about
					this.model.image = user.data.data.userImage
                    this.haveImage = user.data.data.userImage
				}catch(err) {
					this.$swal({
						type: 'error',
						title: 'Acceso invalido, ingrese de nuevo, si el problema persiste comuniquese con el proveedor del servicio',
						showConfirmButton: false,
						timer: 2500
					})
					router.push({name: 'login'})	
				}
				
            },
            async EditPass(){
				if (this.pass.newPassVerify == this.pass.newPass) {
					try{
						const pass = await axios.put(endPoint.endpointTarget+'/users/changePass/'+this.id, {
							newPass:this.pass.newPass,
							lastPass: this.pass.lastPass
						}, this.configHeader)
						if (pass.data.status == 'ok') {
							this.$swal({
                                type: 'success',
                                title: 'Contraseña editada con éxito.',
                                showConfirmButton: false,
                                timer: 1500
                            })
							this.pass.newPass = ''
							this.pass.lastPass = ''
                            this.pass.newPassVerify = ''
                            this.modals.modal2 = false
                            this.inspector = false
						}else{
							this.$swal({
                                type: 'error',
                                title: 'Contraseña incorrecta.',
                                showConfirmButton: false,
                                timer: 1500
                            })
							this.pass.newPass = ''
							this.pass.lastPass = ''
                            this.pass.newPassVerify = ''
                            
						}
					}catch(err)  {
                        console.log(err)
						// $('#ModalEditPass').modal('hide')
						// this.$swal({
						// 	type: 'error',
						// 	title: 'Acceso invalido, ingrese de nuevo, si el problema persiste comuniquese con el proveedor del servicio',
						// 	showConfirmButton: false,
						// 	timer: 2500
						// })
						// router.push({name: 'login'})
					}
				}else{
                    this.$swal({
                        icon: 'error',
                        title: 'Las contraseñas deben conincidir',
                        showConfirmButton: false,
                        timer: 2500
                    })
				}
				
			},
            async getYourSales(){
                console.log('hola')
				const ident = localStorage.userToken
				const decoded = jwtDecode(ident)
				const link = decoded.linkLender
                this.link = decoded.linkLender
				if (link != '') {
                    try {
                        const sales = await axios.get(endPoint.endpointTarget+'/employes/salesbyemploye/'+link, this.configHeader)
                        console.log(sales)
                        this.sales = sales.data.data
                        this.monthLender = sales.data.data.length
                        for (let index = 0; index < sales.data.data.length; index++) {
                            this.gainLender = this.gainLender + sales.data.data[index].commission
                        }
                    }catch(err){
                        console.log(err)
                    }
                    
				}
            }, 
            async getDataLender(){
                const ident = localStorage.userToken
				const decoded = jwtDecode(ident)
				const link = decoded.linkLender
                this.link = decoded.linkLender 
                if (link != '') {
                    try {
                        const employe = await axios.get(endPoint.endpointTarget+'/employes/justonebyid/'+link, this.configHeader)
                        console.log(employe)
                        this.advancement = employe.data.data.advancement
                        this.lenderBonus = employe.data.data.bonus
                        this.comision = employe.data.data.commission
                        const plus = this.advancement + this.lenderBonus
                        this.totalForLender = this.comision - plus
                    }catch(err) {
                        console.log(err)
                    }
                }
            },
            formatPrice(value) {
                let val = (value/1)
                return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            formatDate(date) {
                let dateFormat = new Date(date)
                return moment().format('DD-MM-YYYY');
            },
            handleFileUpload(){
                this.file = this.$refs.file.files[0]
                console.log(this.file)
            },
            async editProfile(){
				let formData = new FormData();
				formData.append('image', this.file)
				formData.append('first_name', this.model.first_name)
				formData.append('last_name', this.model.last_name)
                formData.append('email', this.model.email)
                formData.append('about', this.model.about)
				var dataChange = {
					name: this.model.first_name,
                    lastname: this.model.last_name,
                    image: ''
				}
				try {
					const image = await axios.post(endPoint.endpointTarget+'/users/editData/'+this.id, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
							"x-access-token": localStorage.userToken,
                            "x-database-connect": endPoint.database
						}
                    })
                    console.log(image)
					this.$swal({
                        type: 'success',
                        title: 'Usuario editado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.inspector = false
					// this.emitMethod(image.data.status)
					localStorage.setItem('firstname', dataChange.name)
                    localStorage.setItem('lastname', dataChange.lastname)
                    if (image.data.image != '') {
                        localStorage.setItem('imageUser', image.data.image)
                        dataChange.image = image.data.image
                    }
					EventBus.$emit('dataChange', dataChange)
					this.getData()
				} catch(err)  {
                    console.log(err)
					// this.$swal({
					// 	type: 'error',
					// 	title: 'Acceso invalido, ingrese de nuevo, si el problema persiste comuniquese con el proveedor del servicio',
					// 	showConfirmButton: false,
					// 	timer: 2500
					// })
					// router.push({name: 'login'})
				}
			}, 
        }
    };
</script>
<style></style>
