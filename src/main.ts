import './assets/main.css'

import { createApp, watch } from 'vue'
import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga-full-vars.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from 'pinia'
import { userSessionStore } from './stores/userSessions'
import { supabase } from './services/supabase'
const pinia = createPinia()
library.add(fas, fab);
const app = createApp(App)
app.component("VueFontawesome", FontAwesomeIcon)
app.use(router)
app.use(pinia)
app.use(Oruga, {
    iconPack: 'fas',
    iconComponent: 'vue-fontawesome'
})
app.mount('#app')
const userSession = userSessionStore()

watch(() => userSession.defaultTitle, async (newVal) => {
    const {data, error} = await supabase
    .from('UserPreferences')
    .upsert([
        { 
            id: userSession.session.user.id,
            title: newVal 
        }
    ])
    console.log(data, error)
})