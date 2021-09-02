import React from "react";
import { connect } from "react-redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import Navs from "../../../../../components/navs";
import FormGR from "./components/FormGR";
import FormSA from "./components/FormSA";

const navLists = [
  { id: "form-sa", label: "Form Service Acceptance" },
  { id: "form-gr", label: "Form Good Receipt" },
];

const FormSAGR = (props) => {
  const [navActive, setNavActive] = React.useState("form-sa");

  return (
    <Card>
      <CardBody>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        />
        <div className="mt-5">
          {navActive === "form-sa" && <FormSA keys={keys} {...props} />}
          {navActive === "form-gr" && <FormGR keys={keys} {...props} />}
        </div>
      </CardBody>
    </Card>
  );
};

const keys = {
  upload_sa: "upload-sa-form",
  upload_ga: "upload-ga-form",
  fetch_wbs: "fetch-wbs-list",
};

const mapState = (state) => {
  const { auth } = state;
  return {
    status: auth.user.data.status,
    loadings_sg: {
      [keys.upload_sa]: getLoading(state, keys.upload_sa),
      [keys.upload_gr]: getLoading(state, keys.upload_gr),
      [keys.fetch_wbs]: getLoading(state, keys.fetch_wbs),
    },
  };
};
const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(FormSAGR);
