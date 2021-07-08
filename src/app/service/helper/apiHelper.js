import Axios from "axios";
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
    console.log(`===>>>url`, url, params, type);
    switch (type) {
      case "post":
        return Axios.post(url, params);
      case "postForm":
        let newParams = new FormData();
        Object.keys(params).forEach((element) => {
          newParams.append(element, params[element]);
        });
        return Axios.post(url, newParams);
      case "get":
        return Axios.get(url);
      case "put":
        return Axios.put(url, params);
      case "delete":
        return Axios.delete(url);
      default:
        throw "please set type !";
    }
  },
  checkIsEmpty: (key, value, valueSet) => {
    return {
      [_.isEmpty(value) ? undefined : key]: valueSet ? valueSet : value,
    };
  },
};

export default apiHelper;
