import React from "react";
import { FormDetail, Item } from "./index";
import { Container } from "@material-ui/core";
import ButtonAction from "../../../../../../components/buttonAction/ButtonAction";
import { formatDate } from "../../../../../../libs/date";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import useToast from "../../../../../../components/toast";
import * as deliveryMonitoring from "../../../../service/DeliveryMonitoringCrud";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import { connect } from "react-redux";
import ModalTerm from "./ModalTerm";
import { FormattedMessage } from "react-intl";
import ModalConfirmation from "../../../../../../components/modals/ModalConfirmation";
import { rupiah } from "../../../../../../libs/currency";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import ExpansionBox from "../../../../../../components/boxes/ExpansionBox";
import { NavLink } from "react-router-dom";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../../redux/globalReducer";

const tableHeaderTerminNew = [
  {
    id: "number",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.NO" />,
  },
  {
    id: "scope_of_work",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.SCOPE_OF_WORK" />,
  },
  {
    id: "start_date",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.START_DATE" />,
  },
  {
    id: "due_date",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE" />,
  },
  { id: "bobot", label: "Bobot" },
  {
    id: "price",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
  },
  {
    id: "project_progress",
    label: (
      <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.PROJECT_PROGRESS" />
    ),
  },
  {
    id: "document_progress",
    label: (
      <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DOCUMENT_PROGRESS" />
    ),
  },
  {
    id: "status",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
  },
  {
    id: "action",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
    sortable: false,
  },
];

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Input minimal 3 karakter")
    .required("Scope of work can not empty"),
  start_date: Yup.date()
    .required("Date can not empty")
    .nullable(),
  due_date: Yup.date()
    .required("Date can not empty")
    .nullable(),
});

const initialValues = {
  name: "",
  start_date: format(new Date(), "yyy-MM-dd"),
  due_date: format(new Date(), "yyy-MM-dd"),
  status: 876,
};

const keys = {
  option: "task-status-option",
  fetch: "get-data-contract-by-id",
};

const DetailPage = ({
  contractId,
  contract,
  dataSubmitItems,
  saveSubmitItems,
  saveContractById,
  authStatus,
  fetch_api_sg,
  loadings,
}) => {
  const [newContent, setNewContent] = React.useState([]);
  const [confirm, setConfirm] = React.useState({ show: false, id: "" });
  const [modals, setModals] = React.useState(false);
  const [update, setUpdate] = React.useState({ id: "", update: false });
  const [loading, setLoading] = React.useState(false);
  const [Toast, setToast] = useToast();
  const [options, setOptions] = React.useState();
  const [showForm, setShowForm] = React.useState(false);
  const { tasks } = contract;

  const addCheckedField = (data, type) => {
    if (type === "jasa") {
      data.forEach((services) => {
        services.item_services.map((service) => {
          service.checked = false;
        });
      });
    }

    if (type === "barang") {
      data.forEach((item) => {
        item.checked = false;
      });
    }
  };

  const setInitialSubmitItems = React.useCallback(() => {
    const initialSubmitItems = {
      task_items: [],
      task_services: [],
    };
    saveSubmitItems(initialSubmitItems);
  }, [saveSubmitItems]);

  const handleError = React.useCallback(
    (err) => {
      if (
        err.response?.code !== 400 &&
        err.response?.data.message !== "TokenExpiredError"
      ) {
        console.log("handle error");
        setToast(err.response?.data.message, 5000);
      }
    },
    [setToast]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        enableLoading();

        const requestData = update.update
          ? {
              name: values.name,
              start_date: values.start_date,
              due_date: values.due_date,
              task_status_id: values.status,
            }
          : {
              contract_id: contractId,
              name: values.name,
              start_date: values.start_date,
              due_date: values.due_date,
              task_items: dataSubmitItems.task_items,
              task_services: dataSubmitItems.task_services,
            };

        const res = update.update
          ? await deliveryMonitoring.submitTask(requestData, update)
          : await deliveryMonitoring.submitTask(requestData);

        if (res.data.status === true) {
          handleSuccess(res);
        }
      } catch (error) {
        setSubmitting(false);
        setStatus("Failed Submit Data");
        handleError(error);
      } finally {
        disableLoading();
        setModals(false);
      }
    },
  });

  const handleModal = React.useCallback(
    async (type, items) => {
      if (type === "update") {
        // console.log(`type: ${type}`);
        // console.log(items);
        // console.log(items.due_date);

        setUpdate({ id: items.id, update: true });

        formik.setValues({
          name: items.name,
          start_date: items.start_date
            ? format(new Date(items.start_date), "yyy-MM-dd")
            : format(new Date(), "yyy-MM-dd"),
          due_date: items.due_date
            ? format(new Date(items.due_date), "yyy-MM-dd")
            : format(new Date(), "yyy-MM-dd"),
          status: items.task_status_id,
        });
      } else if (type === "create") {
        const tempSubmitItems = dataSubmitItems;
        // console.log(tempSubmitItems);
        let totalPrice = 0;

        tempSubmitItems.task_services.forEach((item) => {
          totalPrice += parseFloat(item?.price * item.qty);
        });

        tempSubmitItems.task_items.forEach((item) => {
          totalPrice += parseFloat(item?.price * item.qty);
        });

        tempSubmitItems.total_price = totalPrice;

        saveSubmitItems(tempSubmitItems);

        formik.setValues(initialValues);
        setUpdate({ id: "", update: false });
      }

      setModals(true);
    },
    [dataSubmitItems, formik, initialValues, saveSubmitItems]
  );

  const handleAction = React.useCallback(
    (type, data) => {
      switch (type) {
        case "update":
          // console.log("masuk sini", data);
          handleModal("update", data);
          break;
        case "delete":
          setConfirm({ show: true, id: data.id });
          break;
        default:
          break;
      }
    },
    [handleModal]
  );

  // generate isi table task
  const generateTableContent = React.useCallback(
    (data) => {
      setNewContent([]);
      let arrData = [];
      arrData = data.map((item, index) => ({
        number: (index += 1),
        scope_of_work: (
          <NavLink
            to={`/${authStatus}/delivery-monitoring/contract/task/${item.id}`}
          >
            {item.name}
          </NavLink>
        ),
        start_date:
          item.start_date !== null
            ? formatDate(new Date(item.start_date))
            : null,
        due_date:
          item.due_date !== null ? formatDate(new Date(item.due_date)) : null,
        bobot: `${item.weight}%`,
        price: rupiah(item.nett_amount),
        project_progress: item.progress,
        document_progress: "",
        status: item?.task_status?.name,
        action: (
          <ButtonAction
            data={item}
            handleAction={handleAction}
            ops={[
              {
                label: "CONTRACT_DETAIL.TABLE_ACTION.DETAIL",
                icon: "fas fa-search",
                to: {
                  url: `/${authStatus}/delivery-monitoring/contract/task/${item.id}`,
                  style: {
                    color: "black",
                  },
                },
              },
              {
                label: "CONTRACT_DETAIL.TABLE_ACTION.EDIT",
                icon: "fas fa-edit text-primary",
                disabled:
                  item.task_status_id === "89a4fe6c-9ce2-4595-b8f0-914d17c91bb4"
                    ? true
                    : false,
                type: "update",
              },
              {
                label: "CONTRACT_DETAIL.TABLE_ACTION.DELETE",
                icon: "fas fa-trash text-danger",
                type: "delete",
              },
            ]}
          />
        ),
      }));
      setNewContent(arrData);
    },
    [handleAction]
  );

  const getContractById = React.useCallback(
    (contractId, toast = { visible: false, message: "" }) => {
      // enableLoading();

      fetch_api_sg({
        keys: keys.fetch,
        type: "get",
        url: `/delivery/contract/${contractId}`,
        onSuccess: (res) => {
          console.log(`res`, res.data);
          addCheckedField(res?.data?.services, "jasa");
          addCheckedField(res?.data?.items, "barang");
          saveContractById(res?.data);
          generateTableContent(res?.data?.tasks);
          setShowForm(true);
          if (toast.visible) {
            setToast(toast.message, 5000);
          }
        },
      });
    },
    [generateTableContent, saveContractById, setToast, fetch_api_sg]
  );

  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        getContractById(contractId, {
          visible: true,
          message: res?.data?.message,
        });
        setInitialSubmitItems();
      }
    },
    [getContractById, setInitialSubmitItems, contractId]
  );

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const handleClose = () => {
    setModals(false);
  };

  const handleDelete = async () => {
    try {
      enableLoading();
      await deliveryMonitoring.deleteTask(confirm.id);
      setConfirm({ ...confirm, show: false });
      getContractById(contractId, {
        visible: true,
        message: "Successfully delete data.",
      });
    } catch (error) {
      handleError(error);
      // console.error(error);
    } finally {
      disableLoading();
      setModals(false);
    }
  };

  const getOptions = async () => {
    fetch_api_sg({
      key: keys.option,
      type: "get",
      url: `/delivery/options`,
      onSuccess: (res) => {
        // console.log(`res.data`, res.data);
        const taskStatusOptions = res?.data?.task_status;
        setOptions(taskStatusOptions);
      },
    });
  };

  React.useEffect(() => {
    getContractById(contractId);
    if (tasks && tasks.length > 0) {
      generateTableContent(tasks);
    }

    getOptions();
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <Toast />

      <ModalTerm
        visible={modals}
        onClose={handleClose}
        update={update}
        loading={loading}
        formik={formik}
        options={options}
      />

      <ModalConfirmation
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        title={<FormattedMessage id="CONTRACT_DETAIL.MODAL_DELETE.TITLE" />}
        subTitle={
          <FormattedMessage id="CONTRACT_DETAIL.MODAL_DELETE.SUBTITLE" />
        }
        textYes={<FormattedMessage id="BUTTON.DELETE" />}
        textNo={<FormattedMessage id="BUTTON.CANCEL" />}
        onSubmit={() => handleDelete()}
        submitColor="danger"
      />
      {showForm && <FormDetail contractId={contractId} />}
      <Item handleClick={() => handleModal("create")} />
      <Container>
        <ExpansionBox title={"TITLE.TERM_TABLE"}>
          <TablePaginationCustom
            headerRows={tableHeaderTerminNew}
            rows={newContent}
            width={1500}
            loading={loadings.fetch}
            withSearch={false}
          />
        </ExpansionBox>
      </Container>
    </React.Fragment>
  );
};

const mapState = (state) => {
  const { deliveryMonitoring, auth } = state;
  return {
    dataSubmitItems: deliveryMonitoring.dataSubmitItems,
    contract: deliveryMonitoring.dataContractById,
    authStatus: auth.user.data.status,
    loadings: {
      fetch: getLoading(state, keys.option),
      option: getLoading(state, keys.option),
    },
  };
};

const mapDispatch = (dispatch) => ({
  saveSubmitItems: (payload) => {
    dispatch({
      type: actionTypes.SetSubmitItemsByContractId,
      payload: payload,
    });
  },
  saveContractById: (payload) => {
    dispatch({
      type: actionTypes.SetContractById,
      payload: payload,
    });
  },
  fetch_api_sg: (payload) => dispatch(fetch_api_sg(payload)),
});

export default connect(mapState, mapDispatch)(DetailPage);
