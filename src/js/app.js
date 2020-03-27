import "./svg_sprite"
import "@/scss/app.scss"

import Vue from 'vue'
import App from '@/js/vue/components/App.vue'

import '../components/header/header'

new Vue({
    render: h => h(App)
}).$mount('#app')

document.querySelector('#button').addEventListener('click', ()=>{
    import(/* webpackChunkName: "dynamic/dynamic" */ '@/js/dynamic/dynamic')
})