import { MODAL } from "../service/modalSession/ModalService";
import { DEV_NODE } from "./BaseHost";
export default function setupAxios(axios, store) {
  axios.defaults.baseURL = DEV_NODE;
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken },
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      // config.headers.post["Access-Control-Allow-Origin"] = "*";
      // config.headers.post["Content-Type"] = "application/json";
      // config.headers["Connection"] = "close";
      // config.headers.post["Content-Type"] = "multipart/form-data";

      return config;
    },
    (err) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      if (
        (error.response?.status === 400 || error.response?.status === 401) &&
        (error.response?.data.message === "TokenExpiredError" ||
          error.response?.data.message === "UNAUTORIZED")
      ) {
        var title = "";
        var message = "";
        var button = "";
        if (
          localStorage.getItem("i18nConfig") &&
          JSON.parse(localStorage.getItem("i18nConfig")).selectedLang === "id"
        ) {
          title = "Sesi Masuk";
          message = "Waktu sesi Anda sudah berakhir. Silakan masuk lagi !!";
          button = "Keluar";
        } else {
          title = "Session Log In";
          message = "Your session time is over. Please sign in again !!";
          button = "Sign Out";
        }
        MODAL.showSession(title, message, button);
      }
      return Promise.reject(error);
    }
  );
}
