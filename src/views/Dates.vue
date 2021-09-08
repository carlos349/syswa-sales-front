<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center" style="min-height: 50px; background-image: url(img/theme/inventario.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Citas</p>
                    </div>
                    <base-button class="float-right mt-7 mr-2" size="sm" @click="modals.modal1 = true" type="success">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Registrar
                    </base-button>
                </div>
            </div>
        </base-header>
        <vue-cal ref="vuecal" :locale="localee" :events="events" active-view="month" :disable-views="['years', 'year', 'week']"  events-count-on-month-view :time-from="8 * 60" :time-to="19 * 60" :time-step="15" />
        <a-modal v-model="modals.modal1" :width="600" :closable="true" >
            <template>

            </template>
            <template slot="footer">
                <base-button class="float-right mt-7 mr-2" size="sm" @click="modals.modal1 = true" type="success">
                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Registrar
                </base-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {Spanish} from 'flatpickr/dist/l10n/es.js';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/i18n/es.js'
export default {
    components: {
        flatPicker,
        VueCal
    },
    data(){
        return {
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            modals: {
                modal1: false
            },
            localee: 'es',
            events: [
                {
                    start: '2021-08-21 14:00',
                    end: '2021-08-21 16:00',
                    title: 'A big thing',
                    content: '<i class="v-icon material-icons">sentiment_satisfied_alt</i>',
                    class: 'class0'
                },
                {
                    start: '2021-08-21 12:00',
                    end: '2021-08-21 15:00',
                    title: 'Another thing',
                    content: '<i class="v-icon material-icons">thumb_up</i>',
                    class: 'class0'
                },
                {
                    start: '2021-08-20 10:30',
                    end: '2021-08-20 15:30',
                    title: 'Crossfit',
                    content: '<i class="v-icon material-icons">fitness_center</i>',
                    class: 'class0'
                }
            ],
            configDatePicker: {
                allowInput: true, 
                mode: 'range',
                dateFormat: 'd-m-Y',
                locale: Spanish, // locale for this instance only          
            },
        }
    },
    created(){
        this.getDates()
    },
    methods: {
        async getDates(){
            try{
                const dates = await axios.get(endPoint.endpointTarget+'/dates', this.configHeader)
                // this.dates = []
                // this.events = dates.data.data
            }catch(err){
                this.$swal({
                    icon: 'error',
                    title: 'Sin conexión',
                    showConfirmButton: false,
                    timer: 2500
                })
            }
        },
        onEventClick(){

        }
    }
}
</script>
<style>
    .vuecal__flex .vuecal__menu{
        color: #0a0a0a !important
    }
    .vuecal__arrow {
        color: white;
    }
    .vuecal__menu {background-color:transparent;border: none !important;border-radius: 5px 5px 0 0; }
    .vuecal__menu button{background-color:rgba(7, 7, 7, 0.116);outline: none}
    .vuecal__menu li {border-bottom-color: #fff;color: #fff;}
    .vuecal__menu li.active {background-color: rgba(255, 255, 255, 0.15);}
    .vuecal__title-bar {background-color: #172b4d;color: #fff !important}
    .vuecal__event-title{
        font-size: 1.3em;
        font-weight: 400;
    }
    .vuecal__cell {
        padding: 20px;
    }
    .vuecal__event-time{
        font-size: 1em;
        font-weight: 600;
    }
    .vuecal__event-content{
        font-size: 1.1em;
        font-weight: 400;
        font-style: italic;
    }
    .vuecal__title button{
        color: white !important
    }
    .vuecal__split-days-headers{
        height: 3em !important;
    }
    .day-split-header {
        background-color: rgba(23, 43, 77, 0.7);
    }
    .vuecal__cell--selected{
        z-index: 0 !important;
    }
    .vuecal__cell--selected .vuecal__cell-content{
        z-index: 0 !important;
    }
    .vuecal__body{
        background-color:white;
    }
    .vuecal__time-column .vuecal__time-cell{color:white;height:1vh;}
    .vuecal__event{color:#fff;cursor:pointer;}
    .vuecal__event:hover{
        opacity: .8;
    }
    /* Dot indicator */
    .vuecal__cell-events-count {
        width: 19px;
        min-width: 0;
        height: 17px;
        padding: 2px;
        font-size: 12px;
        background-color: #172b4d; 
    }
    .vuecal__header{background-color: rgba(238, 238, 238, 0.623);border-radius: 5px 5px 0 0;}
    .vuecal__cell.today div .vuecal__cell-events-count, .vuecal__cell.current {background-color: #353535 !important;}
    .vuecal:not(.vuecal--day-view) .vuecal__cell.selected {background-color: rgba(235, 255, 245, 0.4);}
    .vuecal__cell.selected:before {border-color: rgba(66, 185, 131, 0.5);}
    .vuecal__cell-date{color:#000;font-family: 'Raleway', sans-serif;
    font-weight:400;}
    .vuecal__heading span{color:#000;font-family: 'Raleway', sans-serif;
    font-weight:400;}
    .vuecal--green-theme .vuecal__title-bar {
        background-color: #1F5673;
    }
    .vuecal__time-column .vuecal__time-cell{
        color: #0F2027
    }
    .calen::-webkit-scrollbar {
        width: 8px !important;     /* Tamaño del scroll en vertical */
        height: 8px !important;    /* Tamaño del scroll en horizontal */
        display: none !important;  /* Ocultar scroll */
    }
    .class0 {
        background:#eb765e7a;
        border: 3px solid #eb755e;
        color: black;
    }
    .class1 {
        background:#eac5be8a;
        border: 3px solid #EAC5BE;
        color: black;
    }
    .class2 {
        background:#bcd1ff80;
        border: 3px solid #BCD1FF;
        color: black;
    }
    .class3 {
        background:#ddefbd85;
        border: 3px solid #DDEFBD;
        color: black;
    }
</style>