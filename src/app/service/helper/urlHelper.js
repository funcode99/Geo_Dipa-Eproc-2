import { DEV_NODE } from "../../../redux/BaseHost";
import { MODAL } from "../../../service/modalSession/ModalService";
import _ from "lodash";
const urlHelper = {
  addBaseURL: (link) => {
    // if (link === undefined) return undefined;
    return DEV_NODE + "/" + link;
  },
};

export const openLinkTab = (link) => {
  //   console.log(`link`, link);
  if (_.isEmpty(link)) MODAL.showSnackbar("Link tidak Tersedia");
  else window.open(urlHelper.addBaseURL(link), "_blank");
};

export default urlHelper;
