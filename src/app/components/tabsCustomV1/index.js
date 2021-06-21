import React from "react";
import { makeStyles, Tabs as MuiTabs, Tab as MuiTab } from "@material-ui/core";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& button.Mui-selected": {
      color: "#3699FF",
    },
  },
  tabRoot: {
    minWidth: "max-content",
    minHeight: "max-content",
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  tabWrapper: {
    flexDirection: "row",
    fontSize: "1rem",
    fontWeight: "500",
    textTransform: "none",
  },
  customIndicatorColor: {
    backgroundColor: "#3699FF",
  },
  customIndicatorColorTwo: {
    backgroundColor: "unset",
  },
}));

const initialTabLists = [
  {
    id: "tab-1",
    label: "Tab One",
    icon: <DescriptionOutlined className="mb-0 mr-2" />,
  },
  {
    id: "tab-2",
    label: "Tab Two",
    icon: <AssignmentOutlined className="mb-0 mr-2" />,
  },
  {
    id: "tab-3",
    label: "Tab Three",
    icon: <BookmarkBorderOutlined className="mb-0 mr-2" />,
  },
];

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function Tabs({
  tabLists = initialTabLists,
  tabActive,
  handleChange,
  handleChangeTwo,
  ...other
}) {
  const classes = useStyles();

  return (
    <div className="d-flex justify-content-between">
      <MuiTabs
        value={tabActive}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="standard"
        variant="scrollable"
        scrollButtons="auto"
        classes={{
          root: classes.root,
          indicator: classes.customIndicatorColor,
        }}
        {...other}
      >
        {tabLists.map((item) => (
          <MuiTab
            key={item.id}
            label={item.label}
            icon={item.icon}
            classes={{
              root: classes.tabRoot,
              wrapper: classes.tabWrapper,
            }}
            {...a11yProps(item.id)}
          />
        ))}
      </MuiTabs>
      <div>
        <MuiTabs
          value={99}
          onChange={handleChangeTwo}
          indicatorColor="secondary"
          textColor="secondary"
          variant="standard"
          classes={{
            root: classes.root,
            indicator: classes.customIndicatorColorTwo,
          }}
          {...other}
        >
          <MuiTab
            value={99}
            icon={<i className="fas fa-pause-circle text-danger fa-2x"></i>}
            classes={{
              root: classes.tabRoot,
              wrapper: classes.tabWrapper,
            }}
          />
        </MuiTabs>
      </div>
    </div>
  );
}
