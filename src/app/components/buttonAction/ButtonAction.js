import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export default function ButtonAction({ data, handleAction, ops }) {
  const [exclude, setExclude] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  const handleChange = React.useCallback(
    (type, data) => {
      if (typeof handleAction === "function") handleAction(type, data);
      handleClose();
    },
    [handleAction, handleClose]
  );

  const listUsed = ops;
  React.useEffect(() => {
    setExclude(["resend"]);
  }, [data]);
  return (
    <div>
      <IconButton
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 300,
            marginLeft: -50,
          },
        }}
      >
        {listUsed
          .filter((el) => !exclude.includes(el.type))
          .map((el, id) => {
            if (el.to) {
              return (
                <Link key={id} to={el.to?.url} style={el.to?.style}>
                  <MenuItem>
                    <ListItemIcon>
                      <i className={el.icon}></i>
                    </ListItemIcon>
                    <ListItemText
                      primary={<FormattedMessage id={el.label} />}
                    />
                  </MenuItem>
                </Link>
              );
            } else {
              return (
                <MenuItem
                  key={id}
                  onClick={() => handleChange(el.type, data)}
                  disabled={el.disabled}
                >
                  <ListItemIcon>
                    <i className={el.icon}></i>
                  </ListItemIcon>
                  <ListItemText primary={<FormattedMessage id={el.label} />} />
                </MenuItem>
              );
            }
          })}
      </Menu>
    </div>
  );
}
