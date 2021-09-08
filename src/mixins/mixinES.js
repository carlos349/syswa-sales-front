import es_ES from 'ant-design-vue/lib/locale-provider/es_ES';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const mixinES = {
    data(){
        return {
            es_ES
        }
    }
}

export default mixinES