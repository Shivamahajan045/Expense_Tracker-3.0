// js/config.js
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? "http://localhost:3000"
  : "http://15.206.89.40:3000";

window.BASE_URL = BASE_URL;
