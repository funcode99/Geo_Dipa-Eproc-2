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
    </React.Fragment>
  );
};

export default HeaderTableDoc;
