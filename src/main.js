import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import convertUtils from "@/utils/convert-utils";
import uploader from "@/utils/uploader.js";
import pdf from "@/utils/pdf.js";

const app = createApp(App);
const pinia = createPinia();

const $utils = {
    convert: { ...convertUtils },
    uploader: { ...uploader },
    pdf: { ...pdf }
};
app.provide('$utils', $utils);

app.use(pinia)
app.use(router);
app.mount('#app');
