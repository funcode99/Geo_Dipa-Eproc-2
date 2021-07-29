import React from "react";
import { FormattedMessage } from "react-intl";
import { TerminPageContext } from "../../TerminPageNew";
import { useStyles } from "./styles";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
  LocalShipping,
} from "@material-ui/icons";
import { DUMMY_STEPPER, TERMIN_TAB_LIST } from "../../STATIC_DATA";
import { MODAL } from "../../../../../../../../service/modalSession/ModalService";
import { Container, Paper } from "@material-ui/core";
import StyledSubheader from "../../../../../../../components/subheader";
import SubBreadcrumbs from "../../../../../../../components/SubBreadcrumbs";
import Steppers from "../../../../../../../components/steppersCustom/Steppers";
import Tabs from "../../../../../../../components/tabs";
import Summary from "../../../Summary";
import Documents from "../../../Documents";

const TerminPaper = () => {
  const {
    history,
    task_id,
    states,
    items,
    dataBarang,
    task_sa,
    task_gr,
    dataContractById,
    authStatus,
    func,
  } = React.useContext(TerminPageContext);
  const stepperProg = React.useMemo(() => states.termin.stepper, [states]);
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);

  const checkDataBarang = () => {
    const temp = [...dataBarang];
    const find = temp?.find((el) => el.checked === true);
    return Array.isArray(items) && items.length > 0 && Boolean(find);
  };
  const isItemExists = checkDataBarang();
  const tabUsed = isItemExists
    ? TERMIN_TAB_LIST
    : TERMIN_TAB_LIST.filter((item) => item.id !== "delivery-order");
  const getTask = React.useCallback(() => {
    const task = dataContractById?.tasks?.find((item) => item.id === task_id);
    return task?.name ?? "";
  }, [dataContractById, task_id]);
  function handleChangeTab(e, newTabActive) {
    const lastTabIndex = tabUsed.length - 1;
    if (newTabActive === lastTabIndex) {
      if (!task_sa && !task_gr) {
        MODAL.showSnackbar("Mohon pastikan BAPP sudah di approve.", "warning");
      } else {
        setTabActive(newTabActive);
      }
    } else {
      setTabActive(newTabActive);
    }
  }
  return (
    <Container>
      <StyledSubheader
        text={getTask(task_id) || `Termin 1`}
        IconComponent={<DescriptionOutlined style={{ color: "white" }} />}
      />

      <SubBreadcrumbs
        items={[
          {
            label: "List of Contract & PO",
            to: `/${authStatus}/delivery-monitoring/contract`,
          },
          {
            label: `${dataContractById?.contract_name || "no data"}`,
            to: `/${authStatus}/delivery-monitoring/contract/${dataContractById?.id ||
              1}`,
          },
          {
            label: getTask(task_id) || `Termin`,
            to: "",
          },
        ]}
      />
      {DUMMY_STEPPER.length > 0 && (
        <Steppers
          steps={stepperProg.length > 0 ? stepperProg : DUMMY_STEPPER}
        />
      )}
      <Paper className={classes.paper}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={tabUsed}
          />
        </Container>
        <hr className="p-0 m-0" />
        <Container style={{ marginTop: 20, paddingBottom: 20 }}>
          {tabActive === 0 && <Summary taskId={task_id} />}
          {tabActive === 0 && (
            <Documents loadStepper={func.onRefresh} taskId={task_id} />
          )}
        </Container>

        {/* <Container style={{ marginTop: 20, paddingBottom: 20 }}>

          {isItemExists && tabActive === 1 && (
            <DeliveryOrder taskId={task_id} />
          )}
          {!isItemExists && tabActive === 1 && <BeritaAcara />}

          {isItemExists && tabActive === 2 && <BeritaAcara />}

          {!isItemExists && tabActive === 2 && <SAGRPage />}

          {isItemExists && tabActive === 3 && <SAGRPage />}

        </Container> */}
        {/* )} */}
      </Paper>
    </Container>
  );
};

export default TerminPaper;
