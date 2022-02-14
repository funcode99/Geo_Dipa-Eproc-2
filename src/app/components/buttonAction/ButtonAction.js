import React from "react";
import {
  IconButton,
  Tooltip,
  withStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
}))(Tooltip);

export default function ButtonAction({
  data,
  handleAction,
  ops,
  label = null,
  exclude = [],
}) {
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

  return (
    <div>
      {label ? (
        <CustomTooltip
          title={<FormattedMessage id={label} />}
          placement="bottom"
        >
          <IconButton
            aria-label="More"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
        </CustomTooltip>
      ) : (
        <IconButton
          aria-label="More"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{
            margin: "-6px 0px",
            padding: 8,
          }}
        >
          <MoreVert />
        </IconButton>
      )}
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
    // </LightTooltip>
  );
}
