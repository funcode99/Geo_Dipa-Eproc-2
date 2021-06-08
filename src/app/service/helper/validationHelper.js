import { string } from "yup";

const validation = {
  require: (text) => {
    return string().required(`${text} harus diisi.`);
  },
};

export default validation;
