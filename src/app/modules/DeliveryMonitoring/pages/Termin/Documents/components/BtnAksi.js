import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SendIcon from "@material-ui/icons/Send";
import { shallowEqual, useSelector } from "react-redux";

const options = [
  "None",
  "Atria",
  "Callisto",
  "Dione",
  "Ganymede",
  "Hangouts Call",
  "Luna",
  "Oberon",
  "Phobos",
  "Pyxis",
  "Sedna",
  "Titania",
  "Triton",
  "Umbriel",
];

const ITEM_HEIGHT = 48;

const Item = {};

export default function BtnAksi({ item, isPeriodic, handleAction }) {
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
    (type, params) => {
      handleAction(type, params);
      handleClose();
    },
    [handleAction, handleClose]
  );
  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );

  const vendorMenu = React.useMemo(
    () => [
      {
        label: "Upload Draft",
        icon: "fas fa-upload text-primary",
        type: "upload",
        params: { upload_id: item?.id, isPeriodic },
      },
      //   {
      //     label: "Edit Draft",
      //     icon: "fas fa-edit text-warning",
      //     type: "edit",
      //     params: { edit_id: item?.id },
      //   },
      {
        label: "Resend Draft",
        icon: "fas fa-redo text-warning",
        type: "resend",
        params: { resend_id: item?.id },
      },
      {
        label: "Submit Document",
        icon: "fas fa-check-circle text-success",
        type: "submit",
        params: { submit_id: item?.id },
      },
    ],
    [item]
  );
  const adminMenu = React.useMemo(
    () => [
      {
        label: "Accept Document",
        icon: "fas fa-check-circle text-success",
        type: "accept",
        params: { accept_id: item?.id, percentage: "20%", isPeriodic },
      },
      {
        label: "Reject Document",
        icon: "fas fa-times-circle text-warning",
        type: "reject",
        params: { reject_id: item?.id },
      },
      {
        label: "Delete Document",
        icon: "fas fa-trash-alt text-danger",
        type: "delete",
        params: { delete_id: item?.id },
      },
    ],
    [item]
  );

  // console.log(`isPeriodic`, isPeriodic);
  const listUsed = status === "client" ? adminMenu : vendorMenu;
  React.useEffect(() => {
    if (item?.url === null)
      setExclude(["accept", "reject", "submit", "resend"]);
    else if (item?.url !== null) setExclude(["upload"]);
    else setExclude([]);
  }, [item]);
  return (
    <div>
      <IconButton
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{
          margin: "-8px 0px",
        }}
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
          .map((el, id) => (
            <MenuItem key={id} onClick={() => handleChange(el.type, el.params)}>
              <ListItemIcon>
                <i className={el.icon}></i>
              </ListItemIcon>
              <ListItemText primary={el.label} />
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
