import axios from "axios";
import _ from "lodash";

const apiHelper = {
  handleError: (err, setToast) => {
    if (
      err.response?.code !== 400 &&
      err.response?.data.message !== "TokenExpiredError"
    ) {
      setToast(err.response?.data.message, 5000);
    }
  },
  fetchGlobalApi: ({ url, params, type }) => {
    switch (type) {
      case "post":
        return axios.post(url, params);
      case "postForm":
        let newParams = new FormData();
        Object.keys(params).forEach((element) => {
          if (Array.isArray(params[element])) {
            newParams.append(element, JSON.stringify(params[element]));
          } else {
            newParams.append(element, params[element]);
          }
        });
        return axios.post(url, newParams);
      case "get":
        return axios.get(url);
      case "put":
        return axios.put(url, params);
      case "delete":
        return axios.delete(url);
      case "getParams":
        return axios.get(url, { params });
      default:
        throw "please set type !";
    }
  },
  checkIsEmpty: (key, value, valueSet) => {
    return {
      [_.isEmpty(value) ? undefined : key]: valueSet ? valueSet : value,
    };
  },
  approveId: "5d28463c-a435-4ec3-b0dc-e8dcb85aa800",
  rejectId: "f11b1105-c234-45f9-a2e8-2b2f12e5ac8f",
  revisionId: "f3b12af0-a6de-44b0-a88b-10b118546838",
};

export default apiHelper;
