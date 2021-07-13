import router from '../router'

const mixinUserToken = {
    beforeCreate(){
        // console.log(localStorage.getItem('userToken'))
        if (!localStorage.getItem('userToken')) {
            this.$swal({ 
                icon: 'error',
                title: 'URL restringida',
                showConfirmButton: false,
                timer: 1500
            })
            router.push({name: 'login'})
        }
    }
}


// mixinUserToken.install = (Vue) => {
//     Vue.mixin({
//         beforeCreate(){
//             console.log(localStorage.getItem('userToken'))
//             if (!localStorage.getItem('userToken')) {
//                 this.$swal({ 
//                     type: 'error',
//                     title: 'URL restringida',
//                     showConfirmButton: false,
//                     timer: 1500
//                 })
//                 router.push({name: 'login'})
//             }
//         }
//     })
// }

export default mixinUserToken