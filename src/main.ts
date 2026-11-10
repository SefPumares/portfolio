import { createApp } from 'vue'
import '@fontsource-variable/inter'
import './styles/main.css'
import App from './App.vue'
import { createAppRouter } from './router'

createApp(App).use(createAppRouter()).mount('#app')
