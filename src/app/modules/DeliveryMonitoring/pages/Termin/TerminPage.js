import React from "react";
import { Container, makeStyles, Paper } from "@material-ui/core";
import Subheader from "../../../../components/subheader";
import Tabs from "../../../../components/tabs";
import Summary from "./Summary";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
} from "@material-ui/icons";
import ServAccGR from "../ServiceAccGR/pages/ServiceAccDetail";
import Documents from "./Documents";
import BeritaAcara from "./BeritaAcara";
import BAPP from "./BAPP";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const TabLists = [
  {
    id: "summary",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.SUMMARY" />,
    icon: <DescriptionOutlined className="mb-0 mr-2" />,
  },
  {
    id: "berita-acara",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.OFFICIAL_REPORT" />,
    icon: <AssignmentOutlined className="mb-0 mr-2" />,
  },
  {
    id: "sa-gr",
    label: "SA / GR",
    icon: <BookmarkBorderOutlined className="mb-0 mr-2" />,
  },
];

const TerminPage = (props) => {
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);
  const { dataContractById } = useSelector((state) => state.deliveryMonitoring);
  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );
  const history = useHistory();
  const { task_id } = useParams();
  // const { state } = useLocation();

  const getTask = React.useCallback(
    (taskId) => {
      const task = dataContractById?.tasks?.find((item) => item.id === taskId);
      return task.name;
    },
    [task_id]
  );

  React.useEffect(() => {
    if (!task_id) {
      history.goBack();
    }
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(e, newTabActive) {
    setTabActive(newTabActive);
  }

  // console.log(task_id);
  // console.log(`state`, state);

  // if (!state) return <div />;

  return (
    <Container>
      <Subheader
        text="Termin 1"
        IconComponent={<DescriptionOutlined style={{ color: "white" }} />}
      />

      <SubBreadcrumbs
        items={[
          {
            label: "List of Contract & PO",
            to: "/client/delivery-monitoring/contract",
          },
          {
            label: `${dataContractById?.contract_name || "no data"}`,
            to: `/client/delivery-monitoring/contract/${dataContractById?.id ||
              1}`,
          },
          {
            label: getTask(task_id) || `Termin`,
            to: "",
          },
        ]}
      />

      <Paper className={classes.paper}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
          />
        </Container>
        <hr className="p-0 m-0" />
        {/* {state.hasOwnProperty('task_id') && ( */}
        <Container style={{ marginTop: 20, paddingBottom: 20 }}>
          {tabActive === 0 && <Summary taskId={task_id} />}
          {tabActive === 1 && <BAPP status={status} taskId={task_id} />}
          {tabActive === 2 && <ServAccGR />}
          {tabActive === 0 && <Documents taskId={task_id} />}
        </Container>
        {/* )} */}
      </Paper>
    </Container>
  );
};

export default TerminPage;
