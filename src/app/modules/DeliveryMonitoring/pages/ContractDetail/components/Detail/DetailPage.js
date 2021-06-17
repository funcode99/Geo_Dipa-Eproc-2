import React from "react";
import { FormDetail, Item } from "./index";
import {
  CardContent,
  Collapse,
  Container,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Card } from "@material-ui/core";
import CustomTable from "../../../../../../components/tables";
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
import * as Option from "../../../../../../service/Option";

const tableHeaderTermin = [
  { label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.NO" /> },
  {
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.SCOPE_OF_WORK" />,
    props: { align: "left" },
  },
  { label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE" /> },
  { label: "Bobot" },
  { label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" /> },
  {
    label: (
      <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.PROJECT_PROGRESS" />
    ),
  },
  {
    label: (
      <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.DOCUMENT_PROGRESS" />
    ),
  },
  { label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" /> },
  { label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" /> },
];

const DetailPage = ({
  contractId,
  contract,
  dataSubmitItems,
  saveSubmitItems,
  saveContractById,
}) => {
  const [tableContent, setTableContent] = React.useState([]);
  const [confirm, setConfirm] = React.useState({ show: false, id: "" });
  const [modals, setModals] = React.useState(false);
  const [update, setUpdate] = React.useState({ id: "", update: false });
  const [show, setShow] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [Toast, setToast] = useToast();
  const [options, setOptions] = React.useState();
  const { tasks } = contract;

  const handleShow = React.useCallback(() => setShow((prev) => !prev), [
    setShow,
  ]);

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Input minimal 3 karakter")
      .required("Scope of work can not empty"),
    due_date: Yup.date()
      .required("Date can not empty")
      .nullable(),
  });

  const initialValues = {
    name: "",
    due_date: format(new Date(), "yyy-MM-dd"),
    status: 876,
  };

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
              due_date: values.due_date,
              task_status_id: values.status,
            }
          : {
              contract_id: contractId,
              name: values.name,
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
          totalPrice += parseFloat(item?.price);
        });

        tempSubmitItems.task_items.forEach((item) => {
          totalPrice += parseFloat(item?.price);
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
      setTableContent([]);
      data.forEach((item, index) => {
        const rows = [
          { content: (index += 1) },
          { content: item.name, props: { align: "left" } },
          {
            content:
              item.due_date !== null
                ? formatDate(new Date(item.due_date))
                : null,
          },
          { content: `${item.weight}%` },
          { content: "" },
          { content: item.progress },
          { content: "" },
          { content: item?.task_status?.name },
          {
            content: (
              <ButtonAction
                data={item}
                handleAction={handleAction}
                ops={[
                  {
                    label: "CONTRACT_DETAIL.TABLE_ACTION.DETAIL",
                    icon: "fas fa-search",
                    to: {
                      url: `/client/delivery-monitoring/contract/task/${item.id}`,
                      style: {
                        color: "black",
                      },
                    },
                  },
                  {
                    label: "CONTRACT_DETAIL.TABLE_ACTION.EDIT",
                    icon: "fas fa-edit text-primary",
                    disabled:
                      item.task_status_id ===
                      "89a4fe6c-9ce2-4595-b8f0-914d17c91bb4"
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
          },
        ];
        setTableContent((prev) => [...prev, rows]);
      });
    },
    [handleAction]
  );

  const getContractById = React.useCallback(
    (contractId, toast = { visible: false, message: "" }) => {
      enableLoading();

      deliveryMonitoring
        .getContractById(contractId)
        .then((res) => {
          const {
            data: { data },
          } = res;

          addCheckedField(data?.services, "jasa");
          addCheckedField(data?.items, "barang");

          saveContractById(data);

          generateTableContent(data?.tasks);

          if (toast.visible) {
            setToast(toast.message, 5000);
          }
        })
        .catch((err) => handleError(err))
        .finally(disableLoading());
    },
    [generateTableContent, handleError, saveContractById, setToast]
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
    try {
      setLoading(true);
      const {
        data: { data },
      } = await Option.getAllOptions();

      // console.log(`data`, data);

      setOptions(data.task_status);
    } catch (error) {
      setToast("Error API, please contact developer!", 5000);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (tasks && tasks.length > 0) {
      generateTableContent(tasks);
    }
    getOptions();
    // eslint-disable-next-line
  }, [contractId]);

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

      <FormDetail />
      <Item handleClick={() => handleModal("create")} />

      <Container>
        <FormControlLabel
          control={<Switch checked={show} onChange={handleShow} />}
          label="Show"
        />

        <Collapse in={show}>
          <Card className="mb-5">
            <CardContent>
              <CustomTable
                tableHeader={tableHeaderTermin}
                tableContent={tableContent}
                marginY="my-5"
                hecto="hecto-16"
              />
            </CardContent>
          </Card>
        </Collapse>
      </Container>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  dataSubmitItems: deliveryMonitoring.dataSubmitItems,
  contract: deliveryMonitoring.dataContractById,
});

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
});

export default connect(mapState, mapDispatch)(DetailPage);
