// js/config.js
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? "http://localhost:3000"
  : "http://13.232.163.227:3000";

window.BASE_URL = BASE_URL;
