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
  checkIsEmpty: (key, value) => {
    return { [_.isEmpty(value) ? undefined : key]: value };
  },
};

export default apiHelper;
