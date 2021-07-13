import moment from 'moment'
const formatDate = {}

formatDate.install = (Vue) => {
    Vue.filter('formatDate', (date) => {
        let dateFormat = new Date(date)
		return moment(dateFormat).format("DD-MM-YYYY")
    })
}

export default formatDate