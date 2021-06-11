import { createApp } from 'vue'
import App from './App.vue'
import ValidationErrors from './components/shared/ValidationErrors.vue'
import FatalError from './components/shared/FatalError.vue'
import router from './router'
import store from './store'
import 'bulma/css/bulma.css'

// Create Vue app
const app = createApp(App)

app.component('v-errors', ValidationErrors)
app.component('fatal-error', FatalError)

app.use(store)
app.use(router)

app.mount('#app')

// Load logged in status from browser local storage
// Load authenticated user from server and set in global store
const init = async () => {
  await store.dispatch('loadStoredUser')
  await store.dispatch('loadUser')
}
init()
