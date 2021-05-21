import { MODAL } from "../service/modalSession/ModalService";
import { DEV_NODE } from './BaseHost';
export default function setupAxios(axios, store) {
  axios.defaults.baseURL = DEV_NODE;
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      config.headers.post['Access-Control-Allow-Origin'] = '*';

      return config;
    },
    err => Promise.reject(err)
  );

  axios.interceptors.response.use(function (response) {
    // console.log("respons:", response );
    return response;
  }, function (error) {
    console.log("error", error);
    if(error.response?.status === 400 && error.response?.data.message === "TokenExpiredError"){
      var title = "";
      var message = "";
      var button = "";
      if(localStorage.getItem("i18nConfig") && JSON.parse(localStorage.getItem("i18nConfig")).selectedLang === "id"){
        title = "Sesi Masuk";
        message = "Waktu sesi Anda sudah berakhir. Silakan masuk lagi !!";
        button = "Keluar";
      }else{
        title = "Session Log In";
        message = "Your session time is over. Please sign in again !!";
        button = "Sign Out";
      }
      MODAL.showSession(title, message, button);
    }
    console.log("Error interceptors.response => ", error)
    return Promise.reject(error);
  });
}
