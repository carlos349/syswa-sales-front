<template>
    <div class="row justify-content-center">
        <div v-if="ifStart" class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="btn-wrapper text-center mb-4">
                        <span class="mb-5"><img style="width:30%" src="img/brand/syswa-isotipo.png"></span> <br><br>
                    </div>
                    <form v-if="loading == false" class="mt-3" role="form">
                        <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Nombre"
                                    v-on:keyup="validFields()"
                                    addon-left-icon="ni ni-single-02"
                                    v-model="model.firstname">
                        </base-input>

                        <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Apellido"
                                    v-on:keyup="validFields()"
                                    addon-left-icon="ni ni-single-02"
                                    v-model="model.lastname">
                        </base-input>

                        <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Correo"
                                    v-on:keyup="validFields()"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email">
                        </base-input>

                        <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Repita Correo"
                                    v-on:keyup="validFields()"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.emailRepeat">
                        </base-input>

                        <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Contraseña"
                                    v-on:keyup="validFields()"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password">
                        </base-input>

                         <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Repita Contraseña"
                                    v-on:keyup="validFields()"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.passwordRepeat">
                        </base-input>

                        <base-input class="input-group-alternative mt-2 mb-1"
                                    placeholder="Credenciales de ingreso"
                                    v-on:keyup="validFields()"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.credential">
                        </base-input>

                        <div class="text-center">
                            <base-button :disabled="validField" type="default" v-on:click="registerFirst()" class="my-2">Ingresar</base-button>
                        </div>
                    </form>
                    <center v-else>
                       <a-spin  class="mx-auto my-5 py-5" /> 
                    </center>
                    
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    
                </div>
            </div>
        </div>
        <div v-else class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="btn-wrapper text-center mb-4">
                        <span class="mb-5"><img style="width:30%" src="img/brand/syswa-isotipo.png"></span> <br><br>
                    </div>
                    <form v-if="loading == false" class="mt-3" role="form">
                        <base-input class="input-group-alternative mt-4 mb-3"
                                    placeholder="Correo"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email">
                        </base-input>

                        <base-input class="input-group-alternative"
                                    placeholder="Contraseña"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password">
                        </base-input>

                        <div class="text-center">
                            <base-button type="default" v-on:click="login()" class="my-2">Ingresar</base-button> <br>
                            <a v-on:click="modals.modal2 = true"><dt>¿Has olvidado la contraseña?</dt></a> 
                        </div>
                    </form>
                    <center v-else>
                       <a-spin  class="mx-auto my-5 py-5" /> 
                    </center>
                    
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    
                </div>
            </div>
        </div>
        <modal :show.sync="modals.modal2"
               body-classes="p-4"
               modal-classes="modal-dialog-centered modal-md">
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                       <h3>Confirme su correo</h3> 
                    </div>
                </template>
                <template>
                    <form role="form">
                        <base-input alternative
                            class="mb-3"
                            placeholder="Correo electronico registrado"
                            addon-left-icon="ni ni-single-copy-04"
                            v-model="emailRenew">
                        </base-input>
                        <div class="text-center">
                            <base-button type="primary" v-on:click="SendNewPass">Enviar</base-button>
                        </div>
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
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

  export default {
    name: 'login',
    components: {
        VuePhoneNumberInput
    },
    data() {
      return {
            model: {
                firstname: '',
                lastname: '',
                email: '',
                emailRepeat: '',
                password: '',
                passwordRepeat: '',
                credential: ''
            },
            ifStart: false,
            configHeader: {
                headers:{"x-database-connect": endPoint.database}
            },
            modals: {
                modal: false,
                modal2: false
            },
            emailRenew: '',
            loading: false,
            validField: true
      }
    },
    beforeCreate(){
        localStorage.removeItem('userToken')
        localStorage.removeItem('firstname')
        localStorage.removeItem('lastname')
        localStorage.removeItem('email')
        localStorage.removeItem('status')
    },
    created(){
        this.getUsers()
    },
    methods: {
        validFields(){
            const emailValidate = this.model.email.split('@')
            if (emailValidate[1]) {
                if (emailValidate[1].split('.')[1]) {
                    this.validField = this.model.email == this.model.emailRepeat && this.model.password.length > 8 && this.model.password == this.model.passwordRepeat && this.model.credential.length === 20 && this.model.firstname.length > 1 && this.model.lastname.length > 1 ? false : true
                }else{
                    this.validField = true
                }
            }else{
                this.validField = true
            }
        },
        async getUsers(){
            try {
                const getUsers = await axios.get(`${endPoint.endpointTarget}/users/getUsersCount`, this.configHeader)
                if(getUsers.data.status == 'ok'){
                    this.ifStart = false
                }else{
                    this.ifStart = true
                }
            }catch(err){
                console.log(err)
            }
        },
        async registerFirst(){
            this.loading = true
            try {
                const registerUser = await axios.post(`${endPoint.endpointTarget}/users/registerFirst`, {
                    first_name: this.model.firstname,
                    last_name: this.model.lastname,
                    email: this.model.email,
                    password: this.model.password,
                    credential: this.model.credential
                }, this.configHeader)
                if (registerUser.data.status == 'ok') {
                    this.$swal({
                        icon: 'success',
                        title: 'Registro exitoso, puede ingresar',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    this.ifStart = false
                    this.password = ''
                    this.loading = false
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Credenciales de ingreso incorrectas',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    this.loading = false
                }
            }catch(err){
                console.log(err)
            }
        },
        login() {
            this.loading = true
            axios.post(endPoint.endpointTarget+'/users/login', {
                email: this.model.email,
                password: this.model.password
            }, this.configHeader).then(res => {
                if(res.data.error == 'pass incorrecto'){
                    this.$swal({
                        type: 'error',
                        title: 'Contraseña incorrecta',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }else if(res.data.error == 'User does not exist'){
                    this.$swal({
                        type: 'error',
                        title: 'No esta registrado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }else{
                    localStorage.setItem('userToken', res.data.token)
                    this.email = ''
                    this.password = ''
                    const token = localStorage.userToken
                    const decoded = jwtDecode(token)
                    localStorage.setItem('firstname', decoded.first_name)
                    localStorage.setItem('lastname', decoded.last_name)
                    localStorage.setItem('email', decoded.email)
                    localStorage.setItem('showNav', true)
                    localStorage.setItem('status', decoded.status)
                    router.push({path: '/Ventas'})
                    this.emitMethod(decoded.status)
                }
            })
            .catch(err =>{
                this.$swal({
                    type: 'error',
                    title: 'Problemas de conexión',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.loading = false
            })
        },
        async emitMethod(status) {
            EventBus.$emit('loggedin', status)
            localStorage.setItem('logged-in', status)
        },
        SendNewPass(){
            if (this.emailRenew == '') {
                this.modals = {
                    modal: true,
                    message: "Debe llenar el dato de correo",
                    icon: 'ni ni-fat-remove ni-5x',
                    type: 'danger'
                }
                setTimeout(() => {
                    this.modals = {
                        modal:false,
                        modal2:true,
                        message: "",
                        icon: '',
                        type: ''
                    }
                }, 1500);
            }else{
                axios.post(endPoint.endpointTarget+'/users/sendNewPass', {
                    email: this.emailRenew
                }) 
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.modals = {
                            modal: true,
                            message: "Se le envio un correo, con la contraseña provicional",
                            icon: 'ni ni-check-bold ni-5x',
                            type: 'success'
                        }
                        setTimeout(() => {
                            this.modals = {
                                modal: false,
                                modal2: false,
                                message: "",
                                icon: '',
                                type: ''
                            }
                        }, 2500);
                        this.emailRenew = ''
                    }else{
                        this.modals = {
                            modal: true,
                            message: "El correo no esta registrado",
                            icon: 'ni ni-fat-remove ni-5x',
                            type: 'danger'
                        }
                        setTimeout(() => {
                            this.modals = {
                                modal: false,
                                modal2: true,
                                message: "",
                                icon: '',
                                type: ''
                            }
                        }, 2000);
                    }
                })
            }
        }
    }
  }
</script>
