import React from "react";
import { connect } from "react-redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import Navs from "../../../../../components/navs";
import { TerminPageContext } from "../TerminPageNew/TerminPageNew";
import FormGR from "./components/FormGR";
import FormSA from "./components/FormSA";

const navLists = [
  { id: "form-sa", label: "Form Service Acceptance" },
  { id: "form-gr", label: "Form Good Receipt" },
];

const FormSAGR = (props) => {
  const [docDate, setDocDate] = React.useState(null);
  const [navActive, setNavActive] = React.useState("form-sa");
  const [dataSAGR, setDataSAGR] = React.useState({});
  const { func, task_id } = React.useContext(TerminPageContext);

  const funcRefresh = () => {
    props.fetch_api_sg({
      key: keys.fetch_sagr,
      type: "get",
      url: `delivery/task-sa-gr/${task_id}`,
      onSuccess: (res) => {
        console.log(`res sagr`, res);
        setDataSAGR(res.data);
      },
    });
  };

  const fetchTask = () => {
    props.fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/delivery/task/${task_id}/news`,
      onSuccess: (res) => {
        const data = res?.data;
        
        if(data) {
          if(data?.news_bast?.date) {
            setDocDate(res?.data?.news_bast?.date);
          }
          else if(data?.news?.date) {
            setDocDate(res?.data?.news?.date);
          }
        }
      },
    });
  };

  React.useEffect(() => fetchTask(), []);
  React.useEffect(() => funcRefresh(), []);
  const parentProps = {
    docDate,
    dataSAGR,
    onRefresh: funcRefresh,
  };
  return (
    <Card>
      <CardBody>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        />
        <div className="mt-5">
          {navActive === "form-sa" && (
            <FormSA keys={keys} {...props} {...parentProps} />
          )}
          {navActive === "form-gr" && (
            <FormGR keys={keys} {...props} {...parentProps} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

const keys = {
  upload_sa: "upload-sa-form",
  upload_gr: "upload-ga-form",
  fetch_wbs: "fetch-wbs-list",
  fetch_sagr: "fetch-sa-gr",
  post_to_sap: "post_to_sap",
};

const mapState = (state) => {
  const { auth } = state;
  return {
    status: auth.user.data.status,
	dataContractById: state.deliveryMonitoring.dataContractById,
    loadings_sg: {
      [keys.upload_sa]: getLoading(state, keys.upload_sa),
      [keys.upload_gr]: getLoading(state, keys.upload_gr),
      [keys.fetch_wbs]: getLoading(state, keys.fetch_wbs),
      [keys.fetch_sagr]: getLoading(state, keys.fetch_sagr),
    },
  };
};
const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(FormSAGR);
