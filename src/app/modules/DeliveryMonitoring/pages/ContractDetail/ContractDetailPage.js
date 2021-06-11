import React from "react";
import {
  Paper,
  makeStyles,
  Icon,
  CircularProgress,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import {
  Send,
  Assignment,
  QueryBuilderSharp,
  FeaturedPlayList,
  Error,
  PeopleAlt,
  Description,
  FindInPage,
  MonetizationOn,
} from "@material-ui/icons";
import { Container } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { Link, useParams, withRouter } from "react-router-dom";
import Tabs from "../../../../components/tabs";
import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";
import useToast from "../../../../components/toast";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSelector, useDispatch } from "react-redux";
import { actionTypes } from "../../_redux/deliveryMonitoringAction";
import CustomTable from "../../../../components/tables";
import { StyledModal } from "../../../../components/modals";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import formatDate from "../../../../libs/date";
import * as Option from "../../../../service/Option";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormDetail, Item } from "./components/Detail";
import ParaPihak from "./components/ParaPihak";
import ParaPihak2 from "./components/ParaPihak/ParaPihak2";
import DokContract from "./components/DokContract";
import HargaPekerjaan from "./components/HargaPekerjaan";
import JangkaWaktu from "./components/JangkaWaktu";
import Jaminan from "./components/Jaminan";
import Denda from "./components/Denda";
import BAST from "./components/BAST";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  textField: {
    width: "75%",
    marginBottom: theme.spacing(2),
  },
}));

const TabLists = [
  {
    id: "detail",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
    icon: <FindInPage className="mb-0 mr-2" />,
  },
  {
    id: "para-pihak",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
    icon: <PeopleAlt className="mb-0 mr-2" />,
  },

  {
    id: "dokumen-kontrak",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
    icon: <Assignment className="mb-0 mr-2" />,
  },
  {
    id: "harga-pekerjaan",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
    icon: <MonetizationOn className="mb-0 mr-2" />,
  },
  {
    id: "jangka-waktu",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
    icon: <QueryBuilderSharp className="mb-0 mr-2" />,
  },
  {
    id: "jaminan",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
    icon: <FeaturedPlayList className="mb-0 mr-2" />,
  },
  {
    id: "denda",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.FINE" />,
    icon: <Error className="mb-0 mr-2" />,
  },
  {
    id: "para-pihak2",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
    icon: <PeopleAlt className="mb-0 mr-2" />,
  },
  {
    id: "bast",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.BAST" />,
    icon: <Description className="mb-0 mr-2" />,
  },
];

const tableHeaderTermin = [
  { label: "No" },
  { label: "Scope of Work", props: { align: "left" } },
  { label: "Due Date" },
  { label: "Bobot" },
  { label: "Harga Pekerjaan" },
  { label: "Project Progress" },
  { label: "Document Progress" },
  { label: "Deliverables Document" },
  { label: "Status" },
  { label: "Action" },
];

export const ContractDetailPage = () => {
  const classes = useStyles();
  const { contract_id } = useParams();
  const [Toast, setToast] = useToast();
  const { dataContractById, dataSubmitItems } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [tableContent, setTableContent] = React.useState([]);
  const [modals, setModals] = React.useState(false);
  const [update, setUpdate] = React.useState({ id: "", update: false });
  const [confirm, setConfirm] = React.useState({ show: false, id: "" });
  const [options, setOptions] = React.useState();

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Input minimal 3 karakter")
      .required("Field ini wajib diisi"),
    due_date: Yup.date()
      .required("Field ini wajib diisi")
      .nullable(),
  });

  const initialValues = {
    name: "",
    due_date: format(new Date(), "yyy-MM-dd"),
    status: 876,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        enableLoading();
        // console.log(values);
        // console.log(formik.errors);
        // console.log(formik.status);

        let requestData = {};

        if (update.update) {
          requestData = {
            name: values.name,
            due_date: values.due_date,
            task_status_id: values.status,
          };
        } else {
          requestData = {
            contract_id: contract_id,
            name: values.name,
            due_date: values.due_date,
            task_items: dataSubmitItems.task_items,
            task_services: dataSubmitItems.task_services,
          };
        }

        const {
          data: { status },
        } = update.update
          ? await deliveryMonitoring.submitTask(requestData, update)
          : await deliveryMonitoring.submitTask(requestData);

        if (status) {
          getContractById(contract_id);
          setInitialSubmitItems();
          setModals(false);
          setToast("Successfully create term");
        }
      } catch (error) {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        ) {
          setToast(error.response?.data.message, 5000);
          setSubmitting(false);
          setStatus("Failed Submit Data");
        }
      } finally {
        disableLoading();
      }
    },
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  // generate isi table task
  const generateTableContent = (data) => {
    setTableContent([]);
    data.forEach((item, index) => {
      const rows = [
        { content: (index += 1) },
        { content: item.name, props: { align: "left" } },
        {
          content:
            item.due_date !== null ? formatDate(new Date(item.due_date)) : null,
        },
        { content: `${item.weight}%` },
        { content: "" },
        { content: item.progress },
        { content: "" },
        {
          content: (
            <Link
              to={{
                pathname: `/client/delivery-monitoring/contract/task/${item.id}`,
              }}
            >
              <span>
                <FormattedMessage id="CONTRACT_DETAIL.TABLE_CONTENT.URL" />
              </span>
            </Link>
          ),
        },
        { content: item?.task_status?.name },
        {
          content: (
            <div className="d-flex flex-row justify-content-center">
              <button
                disabled={
                  item.task_status_id === "89a4fe6c-9ce2-4595-b8f0-914d17c91bb4"
                    ? true
                    : false
                }
                className="btn btn-sm p-1"
                onClick={() => handleModal("update", item)}
              >
                <Icon className="fas fa-edit text-primary" />
              </button>
              <button
                className="btn btn-sm p-1 mr-2"
                onClick={() => setConfirm({ show: true, id: item.id })}
              >
                <Icon className="fas fa-trash text-danger" />
              </button>
            </div>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  };

  const sortTerminByPaymentMethod = (data) => {
    data.sort((a, b) => {
      return a.payment - b.payment;
    });
  };

  const addCheckedField = (data, type) => {
    if (type === "jasa") {
      data.map((services) => {
        services.item_services.map((service) => {
          service.checked = false;
        });
      });
    }
    if (type === "barang") {
      data.map((item) => {
        item.checked = false;
      });
    }
  };

  const setInitialSubmitItems = () => {
    const initialSubmitItems = {
      task_items: [],
      task_services: [],
    };
    dispatch({
      type: actionTypes.SetSubmitItemsByContractId,
      payload: initialSubmitItems,
    });
  };

  // get data contract detail from api
  const getContractById = async (contract_id) => {
    try {
      dispatch({
        type: actionTypes.SetContractById,
        payload: [],
      });

      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getContractById(contract_id);

      // if (data?.payment_method === "gradually") {
      //   sortTerminByPaymentMethod(data?.tasks);
      // }

      addCheckedField(data?.services, "jasa");
      addCheckedField(data?.items, "barang");

      dispatch({
        type: actionTypes.SetContractById,
        payload: data,
      });

      generateTableContent(data?.tasks);
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        ) {
          setToast("Error API, please contact developer!");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getOptions = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await Option.getAllOptions();

      setOptions(data.task_status);
    } catch (error) {
      setToast("Error API, please contact developer!");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getContractById(contract_id);
    setInitialSubmitItems();
    getOptions();
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  const handleClose = () => {
    setModals(false);
  };

  const handleModal = async (type, items) => {
    if (type === "update") {
      // console.log(`type: ${type}`);
      // console.log(items);
      // console.log(items.due_date);

      setUpdate({ id: items.id, update: true });

      formik.setValues({
        name: items.name,
        due_date: items.due_date
          ? format(new Date(items.due_date), "yyy-MM-dd")
          : format(new Date(), "yyy-MM-dd"),
        status: items.task_status_id,
      });
    } else if (type === "create") {
      formik.setValues(initialValues);
      setUpdate({ id: "", update: false });
    }

    setModals(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deliveryMonitoring.deleteTask(confirm.id);
      setConfirm({ ...confirm, show: false });
      setToast("Successfully delete data.", 10000);
      getContractById(contract_id);
    } catch (error) {
      setToast("Error with API, please contact Developer!", 10000);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Toast />

      <StyledModal
        visible={modals}
        onClose={handleClose}
        hideCloseIcon={false}
        disableBackdrop
        minWidth="40vw"
        maxwidth="70vw"
      >
        <h3 className="mb-5">
          {update.update ? (
            <FormattedMessage id="CONTRACT_DETAIL.MODAL_TITLE.UPDATE" />
          ) : (
            <FormattedMessage id="CONTRACT_DETAIL.MODAL_TITLE.CREATE" />
          )}{" "}
          <FormattedMessage id="CONTRACT_DETAIL.MODAL_TITLE.TERM" />
        </h3>
        {dataSubmitItems?.task_items?.length === 0 &&
          dataSubmitItems?.task_services?.length === 0 && (
            <p>Tidak ada item yang dipilih</p>
          )}
        <div className="mb-5">
          {dataSubmitItems && dataSubmitItems.task_services.length > 0 && (
            <React.Fragment>
              <h5>Jasa</h5>
              <table className="table-md table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="bg-primary text-white">No</th>
                    <th className="bg-primary text-white">Name</th>
                    <th className="bg-primary text-white">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSubmitItems.task_services.map((item, index) => (
                    <tr key={item?.service_id}>
                      <td>{(index += 1)}</td>
                      <td>{item?.name}</td>
                      <td>{item?.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          )}
          {dataSubmitItems && dataSubmitItems.task_items.length > 0 && (
            <React.Fragment>
              <h5 className="mt-2">Barang</h5>
              <table className="table-md table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="bg-primary text-white">No</th>
                    <th className="bg-primary text-white">Name</th>
                    <th className="bg-primary text-white">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSubmitItems.task_items.map((item, index) => (
                    <tr key={item?.item_id}>
                      <td>{(index += 1)}</td>
                      <td>{item?.name}</td>
                      <td>{item?.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </React.Fragment>
          )}
        </div>

        <form
          noValidate
          autoComplete="off"
          className="d-flex flex-column"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            label="Scope of Work"
            variant="outlined"
            name="name"
            className={classes.textField}
            size="small"
            {...formik.getFieldProps("name")}
          />
          <p style={{ color: "red" }}>
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null}
          </p>

          <TextField
            label="Due Date"
            variant="outlined"
            name="due_date"
            className={classes.textField}
            size="small"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            {...formik.getFieldProps("due_date")}
          />
          <p style={{ color: "red" }}>
            {formik.touched.due_date && formik.errors.due_date
              ? formik.errors.due_date
              : null}
          </p>

          {update.update ? (
            <React.Fragment>
              <InputLabel id="task-status">Status</InputLabel>
              <Select
                labelId="task-status"
                id="task-status-id"
                name="status"
                size="small"
                className={classes.textField}
                {...formik.getFieldProps("status")}
              >
                <MenuItem value={876}>Select Item</MenuItem>
                {options &&
                  options.map((val) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.name}
                    </MenuItem>
                  ))}
              </Select>
              <p style={{ color: "red" }}>
                {formik.touched.status && formik.errors.status
                  ? formik.errors.status
                  : null}
              </p>
            </React.Fragment>
          ) : null}

          <div className="d-flex">
            <Button
              disabled={loading}
              className="btn btn-primary ml-auto"
              type="submit"
              variant="contained"
            >
              {loading ? <CircularProgress /> : null}&nbsp;
              {update.update ? (
                <FormattedMessage id="BUTTON.UPDATE" />
              ) : (
                <FormattedMessage id="BUTTON.CREATE" />
              )}
            </Button>
          </div>
        </form>
      </StyledModal>

      <StyledModal
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        hideCloseIcon={false}
        disableBackdrop
        minWidth="40vw"
      >
        <div className="d-flex justify-content-center mb-3">
          <h3>Are you sure want to delete?</h3>
        </div>
        <div>
          <Button
            variant="contained"
            disabled={loading}
            style={{
              width: "40%",
              background: "red",
              color: "white",
              marginInline: 10,
            }}
            onClick={() => handleDelete()}
          >
            {loading ? <CircularProgress /> : null}&nbsp;{" "}
            <FormattedMessage id="BUTTON.DELETE" />
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            style={{ width: "40%", marginInline: 10 }}
            onClick={() => setConfirm({ ...confirm, show: false })}
          >
            <FormattedMessage id="BUTTON.CANCEL" />
          </Button>
        </div>
      </StyledModal>

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}

      <Subheader
        text={
          dataContractById
            ? `${dataContractById?.contract_no} - ${dataContractById?.contract_name}`
            : null
        }
        IconComponent={
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")}
            style={{ color: "white" }}
          />
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: "List of Contract & PO",
            to: "/client/delivery-monitoring/contract",
          },
          {
            label: `${
              dataContractById ? dataContractById?.contract_name : "x"
            }`,
            to: "/",
          },
        ]}
      />

      <Paper className={classes.root}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
            variant="scrollable"
          />
        </Container>
        <hr className="p-0 m-0" />
        {tabActive === 0 && (
          <React.Fragment>
            <FormDetail />
            <Item />

            <Container>
              <div className="d-flex justify-content-end w-100 mt-3">
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={() => handleModal("create")}
                >
                  <span className="mr-1">Submit</span>
                  <Send />
                </Button>
              </div>

              <CustomTable
                tableHeader={tableHeaderTermin}
                tableContent={tableContent}
                marginY="my-5"
                hecto="hecto-16"
              />
            </Container>
          </React.Fragment>
        )}
        {tabActive === 1 && <ParaPihak />}
        {tabActive === 2 && <DokContract />}
        {tabActive === 3 && <HargaPekerjaan />}
        {tabActive === 4 && <JangkaWaktu />}
        {tabActive === 5 && <Jaminan />}
        {tabActive === 6 && <Denda />}
        {tabActive === 7 && <ParaPihak2 />}
        {tabActive === 8 && <BAST />}
      </Paper>
    </React.Fragment>
  );
};

export default withRouter(ContractDetailPage);
