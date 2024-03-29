import { DEV_NODE } from "../../../redux/BaseHost";
import { MODAL } from "../../../service/modalSession/ModalService";
import _ from "lodash";
const urlHelper = {
  addBaseURL: (link) => {
    // if (link === undefined) return undefined;
    if (link?.includes(DEV_NODE)) return link;
    return DEV_NODE + "/" + link;
  },
};

export const openLinkTab = (link) => {
  if (_.isEmpty(link)) MODAL.showSnackbar("Link tidak Tersedia");
  else {
    if (link.includes("http")) window.open(link, "_blank");
    else window.open(urlHelper.addBaseURL(link), "_blank");
  }
};

export default urlHelper;
