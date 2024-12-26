import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

if (process.env.NODE_ENV !== "production") {
  import("@vue/devtools").then((devtools) => {
    devtools.connect();
  });
}

const baseURL = "http://172.24.176.154:3500"; // Your base URL
const app = createApp(App);

// Set global properties
app.config.globalProperties.$baseURL = baseURL;

// Configure Axios base URL
axios.defaults.baseURL = baseURL;

app.use(router).mount("#app");
