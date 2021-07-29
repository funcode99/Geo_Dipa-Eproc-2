import axios from "axios";
import { DEV_NODE, API_EPROC } from "../../../../redux/BaseHost";

export function verificationQr(term, role, type) {
  return axios.get(`/invoice/get_bkb_qrcode?term_id=${term}&role_id=${role}&type=${type}`);
}
