import "./svg_sprite"
import "@/scss/app.scss"

import Vue from 'vue'
import App from '@/js/vue/components/App.vue'

import '../blocks/header/header'

new Vue({
    render: h => h(App)
}).$mount('#app')