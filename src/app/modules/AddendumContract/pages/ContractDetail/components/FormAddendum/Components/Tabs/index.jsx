import React from "react";
import { makeStyles, Tabs as MuiTabs, Tab as MuiTab } from "@material-ui/core";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
} from "@material-ui/icons";

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

export default function TabsAddendum({
  tabLists = initialTabLists,
  tabActive,
  handleChange,
  grid,
  arrayLength,
  ...other
}) {
  const useStyles = makeStyles((theme) => ({
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${arrayLength}, minmax(0, 1fr))`,
    },
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
    tabWrapper1: {
      flexDirection: "row",
      fontSize: "1rem",
      fontWeight: "500",
      textTransform: "none",
      color: "#8c8a8a",
    },
    tabWrapper2: {
      flexDirection: "row",
      fontSize: "1rem",
      fontWeight: "500",
      textTransform: "none",
      color: "#3699ff",
    },
    customIndicatorColor: {
      // backgroundColor: "green",
    },
    customLabelColor: {
      color: "green",
    },
  }));

  const classes = useStyles();

  // console.log('isi grid', grid)

  return (
    <MuiTabs
      value={tabActive}
      onChange={handleChange}
      indicatorColor="secondary"
      textColor="secondary"
      variant="scrollable"
      scrollButtons="auto"
      classes={{
        root: classes.root,
        // MuiTabs-indicator
        indicator: classes.customIndicatorColor,
        flexContainer: grid === true ? classes.grid : "",
      }}
      TabIndicatorProps={{
        style: {
          backgroundColor: "#3699ff",
        },
      }}
      {...other}
    >
      {tabLists.map((item) => (
        // dilarang keras pake fragment disini
        <MuiTab
          key={item.id}
          label={item.label}
          icon={item.icon}
          style={{
            display: item?.display,
            textAlign: "center",
          }}
          classes={{
            root: classes.tabRoot,
            wrapper:
              item.addendum === true
                ? classes.tabWrapper2
                : item.addendum === undefined
                ? ""
                : classes.tabWrapper1,
          }}
        />
      ))}
    </MuiTabs>
  );
}
