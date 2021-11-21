import { Container, Paper } from "@material-ui/core";
import { DescriptionOutlined } from "@material-ui/icons";
import React from "react";
import { MODAL } from "../../../../../../../../service/modalSession/ModalService";
import Steppers from "../../../../../../../components/steppersCustom/Steppers";
import SubBreadcrumbs from "../../../../../../../components/SubBreadcrumbs";
import StyledSubheader from "../../../../../../../components/subheader";
import Tabs from "../../../../../../../components/tabs";
import BeritaAcara from "../../../BeritaAcara";
import DeliveryOrder from "../../../DeliveryOrder.js/DeliveryOrder";
import Documents from "../../../Documents";
import FormSAGR from "../../../FormSAGR";
import SAGRPage from "../../../ServiceAccGR/SAGRPage";
import Summary from "../../../Summary";
import { DUMMY_STEPPER, KEYS_TERMIN, TERMIN_TAB_LIST } from "../../STATIC_DATA";
import { TerminPageContext } from "../../TerminPageNew";
import { useStyles } from "./styles";
// import SummaryTermin from "../SummaryTermin";

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
    loadings,
  } = React.useContext(TerminPageContext);
  const stepperProg = React.useMemo(() => states.termin.stepper, [states]);
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);
  const isClient = authStatus === "client";

  const checkDataBarang = () => {
    const temp = [...dataBarang];
    const find = temp?.find((el) => el.checked === true);
    return Array.isArray(items) && items.length > 0 && Boolean(find);
  };
  const isItemExists = checkDataBarang();
  const tabUsed = isItemExists
    ? isClient
      ? TERMIN_TAB_LIST
      : TERMIN_TAB_LIST.map((el) =>
          el.id === "form-sa-gr" ? { ...el, display: "none" } : { ...el }
        )
    : isClient
    ? TERMIN_TAB_LIST.filter((item) => item.id !== "delivery-order")
    : TERMIN_TAB_LIST.filter((item) => item.id !== "delivery-order").map((el) =>
        el.id === "form-sa-gr" ? { ...el, display: "none" } : { ...el }
      );
  const getTask = React.useCallback(() => {
    const task = dataContractById?.tasks?.find((item) => item.id === task_id);
    // return task?.name ?? "";
    return task;
  }, [dataContractById, task_id]);
  function handleChangeTab(e, newTabActive) {
    const lastTabIndex = tabUsed.length - 1;
    // let thisTask = getTask(task_id);
    let thisTask = states?.termin?.summary;

    if (newTabActive > 0 && thisTask?.approve_status?.name !== "APPROVED") {
      MODAL.showSnackbar("Mohon Approve termin ini terlebih dahulu", "warning");
      // } else if (newTabActive === lastTabIndex) {
      //   // if (!task_sa && !task_gr) {
      //   //   MODAL.showSnackbar("Mohon pastikan BAPP sudah di approve.", "warning");
      //   // } else {
      //   setTabActive(newTabActive);
      //   // }
    }
    // else if (
    //   thisTask?.document_status === false &&
    //   ((!isItemExists && newTabActive === 1) ||
    //     (isItemExists && newTabActive === 2))
    // ) {
    //   MODAL.showSnackbar("Mohon lengkapi dokumen terlebih dahulu", "warning");
    // }
    else {
      setTabActive(newTabActive);
    }
  }
  console.log(`states`, states.termin.summary);
  return (
    <Container>
      <StyledSubheader
        // text={getTask(task_id)?.name || `Termin 1`}
        text={states?.termin?.summary?.name || `Termin 1`}
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
            label: states?.termin?.summary?.name || `Termin`,
            to: "",
          },
        ]}
      />
      <Steppers
        steps={loadings[KEYS_TERMIN.f_termin] ? DUMMY_STEPPER : stepperProg}
      />
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
          {/* {tabActive === 0 && <SummaryTermin />} */}
          {tabActive === 0 && <Summary />}
          {tabActive === 0 && <Documents />}
          {isItemExists && tabActive === 1 && <DeliveryOrder />}
          {!isItemExists && tabActive === 1 && (
            <BeritaAcara handleChangeTab={() => handleChangeTab(null, 2)} />
          )}
          {isItemExists && tabActive === 2 && (
            <BeritaAcara handleChangeTab={() => handleChangeTab(null, 3)} />
          )}
          {!isItemExists && tabActive === 2 && (
            <FormSAGR isItemExists={isItemExists} />
          )}
          {isItemExists && tabActive === 3 && (
            <FormSAGR isItemExists={isItemExists} />
          )}
          {!isItemExists && tabActive === 3 && <SAGRPage />}
          {isItemExists && tabActive === 4 && <SAGRPage />}
        </Container>
      </Paper>
    </Container>
  );
};

export default TerminPaper;
