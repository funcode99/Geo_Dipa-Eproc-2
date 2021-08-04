import React from "react";
import { FormattedMessage } from "react-intl";
import { shallowEqual, useSelector } from "react-redux";
import { StatsWidget11 } from "../../../../../../../_metronic/_partials/widgets";
import AreaChart from "../../../../../../components/charts/AreaChart";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { PROGRESS_CONF } from "../BASE_MODAL_CONF";
import { DocumentsContext } from "../Documents";
import CardProgress from "./CardProgress";

const HeaderTableDoc = ({ params }) => {
  const { handleAction, handleVisible } = React.useContext(DocumentsContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = React.useCallback(
    (type) => {
      handleAction(type);
      handleClose();
    },
    [handleAction, handleClose]
  );

  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );

  const [propsChart, setPropsChart] = React.useState({});
  const chartRef = React.useRef();
  const openChart = (data) => {
    chartRef.current.open();
    // setVisible(true);
    setPropsChart({
      baseColor: data.scheme,
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-end w-100 mb-5">
        {status === "client" && (
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => handleAction("create")}
          >
            <span className="nav-icon">
              <i className="flaticon2-plus"></i>
            </span>
            <span className="nav-text">Deliverables</span>
          </button>
        )}
      </div>
      {/* <!--begin:: Widgets/Stats--> */}
      <div className="kt-portlet">
        <div className="kt-portlet__body  kt-portlet__body--fit">
          <div className="row row-no-padding row-col-separator-xl">
            {PROGRESS_CONF.map((el, id) => (
              <div key={id} className="col-md-12 col-lg-6 col-xl-4">
                <CardProgress title={"Laporan"} onOpen={openChart} {...el} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <!--end:: Widgets/Stats--> */}
      {/* <StatsWidget11
        className="card-stretch card-stretch-half gutter-b"
        symbolShape="circle"
        baseColor="success"
      /> */}
      <DialogGlobal
        ref={chartRef}
        // visible={visible}
        isSubmit={false}
        isCancel={false}
        textNo={
          <FormattedMessage id="TITLE.MODAL_CREATE.LABEL.BUTTON_FAILED" />
        }
        title={"Chart Report"}
      >
        <AreaChart {...propsChart} />
        {/* <AreaChart /> */}
      </DialogGlobal>
    </div>
  );
};

export default HeaderTableDoc;
