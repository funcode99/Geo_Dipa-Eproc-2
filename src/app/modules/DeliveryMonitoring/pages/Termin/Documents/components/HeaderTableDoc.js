import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
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

  return (
    <React.Fragment>
      <div className="d-flex justify-content-end w-100 mb-5">
        {/* <div>
          <Button
            //   aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Open Action
          </Button>
          <Menu
            //   id="simple-menu"
            anchorEl={anchorEl}
            //   keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <h3>VENDOR</h3>
            <MenuItem onClick={handleClose}>Upload Draft</MenuItem>
            <MenuItem onClick={handleClose}>Preview Draft</MenuItem>
            <MenuItem onClick={handleClose}>Edit Draft</MenuItem>
            <MenuItem onClick={() => handleOpen("submit")}>
              Submit Draft
            </MenuItem>
            <MenuItem onClick={handleClose}>Resend Draft</MenuItem>
            <h3>ADMIN</h3>

            <MenuItem onClick={handleClose}>Add Document</MenuItem>
            <MenuItem onClick={handleClose}>Preview</MenuItem>
            <MenuItem onClick={() => handleOpen("accept")}>Accept</MenuItem>
            <MenuItem onClick={() => handleOpen("reject")}>Reject</MenuItem>
          </Menu>
        </div> */}
        <button
          className="btn btn-outline-success btn-sm"
          onClick={() => handleAction("create")}
        >
          <span className="nav-icon">
            <i className="flaticon2-plus"></i>
          </span>
          <span className="nav-text">Deliverables</span>
        </button>
      </div>
    </React.Fragment>
  );
};

export default HeaderTableDoc;
