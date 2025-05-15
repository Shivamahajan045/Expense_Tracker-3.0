// js/config.js
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost ? "http://localhost:3000" : "http://52.66.66.94"; //remove port once using nginx

window.BASE_URL = BASE_URL;
