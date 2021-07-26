import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { DocumentsContext } from "../Documents";

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

  return (
    <React.Fragment>
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
      <div className="kt-portlet__body">
        <div className="kt-widget25">
          <div className="kt-widget25__items">
            <div className="kt-widget25__item">
              <span className="kt-widget25__number">63%</span>
              <div className="progress kt-progress--sm">
                <div
                  className="progress-bar kt-bg-danger"
                  role="progressbar"
                  style={{ width: "63%" }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="kt-widget25__desc">Laporan Harian</span>
            </div>
            <div className="kt-widget25__item">
              <span className="kt-widget25__number">39%</span>
              <div className="progress m-progress--sm">
                <div
                  className="progress-bar kt-bg-success"
                  role="progressbar"
                  style={{ width: "39%" }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="kt-widget25__desc">Laporan Mingguan</span>
            </div>
            <div className="kt-widget25__item">
              <span className="kt-widget25__number">54%</span>
              <div className="progress m-progress--sm">
                <div
                  className="progress-bar kt-bg-warning"
                  role="progressbar"
                  style={{ width: "54%" }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="kt-widget25__desc">Laporan Bulanan</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HeaderTableDoc;
