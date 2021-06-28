import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import { ModalSubmit, ModalUpdate, ModalDetail } from "./components";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { FormattedMessage } from "react-intl";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import {
  formatDate,
  formatInitialDate,
  formatUpdateDate,
} from "../../../../../libs/date";
import ButtonAction from "../../../../../components/buttonAction/ButtonAction";
import * as Yup from "yup";
import { useFormik } from "formik";
import useToast from "../../../../../components/toast";

const tblHeadDlvItem = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "desc",
    label: <FormattedMessage id="TITLE.DESCRIPTION" />,
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
  {
    id: "remarks",
    label: <FormattedMessage id="TITLE.REMARKS" />,
  },
  {
    id: "action",
    label: <FormattedMessage id="TITLE.ACTION" />,
    sortable: false,
  },
];

const FormSchema = Yup.object().shape({
  name: Yup.string().required(<FormattedMessage id="TITLE.DESC_IS_REQUIRE" />),
  date: Yup.date()
    .required(<FormattedMessage id="TITLE.DATE_IS_REQUIRE" />)
    .nullable(),
  remarks: Yup.string(),
});

const initialValues = {
  name: "",
  date: formatInitialDate(),
  remarks: "",
  // qty: 1,
};

const DeliveryOrder = ({
  taskId,
  items,
  orderItems,
  tempOrderItems,
  setTempOrderItems,
  saveDataTask,
  updateOrderItems,
}) => {
  const [open, setOpen] = React.useState({
    create: false,
    delete: false,
    update: false,
    detail: false,
    tempParams: {},
  });
  const [tableContent, setTableContent] = React.useState([]);
  const [loading, setLoading] = React.useState({
    fetch: false,
    create: false,
    delete: false,
    update: false,
  });
  const [Toast, setToast] = useToast();

  const handleVisible = (key, tempParams = {}) => {
    // console.log(`tempParams`, tempParams);
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
      tempParams: { ...prev.tempParams, ...tempParams },
    }));
  };

  const handleError = (type, err) => {
    switch (type) {
      case "api":
        if (
          err.response?.code !== 400 &&
          err.response?.data.message !== "TokenExpiredError"
        ) {
          getTask({ visible: "true", message: err.response?.data.message });
          // setToast(err.response?.data.message, 5000);
        }
        break;

      default:
        break;
    }
  };

  const getTask = (toast = { visible: false, message: "" }) => {
    handleLoading("fetch", true);

    deliveryMonitoring
      .getTaskById(taskId)
      .then((res) => {
        if (res.data.status === true) {
          // console.log(`res.data.data`, res.data.data);
          saveDataTask(res.data.data);
          // generateTableContent(orderItems);
          if (toast.visible) {
            setToast(toast.message, 5000);
          }
        }
      })
      .catch((err) => handleError("api", err))
      .finally(() => handleLoading("fetch", false));
  };

  const handleSuccess = (res) => {
    if (res?.data?.status === true) {
      getTask({ visible: "true", message: res?.data?.message });
    }
  };

  const [errors, setErrors] = React.useState({});

  const handleErrorSubmit = (type, err) => {
    setErrors((prev) => ({ ...prev, [type]: err }));
  };

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      let submitItem = [];
      if (open.update) {
        submitItem = updateOrderItems.filter((item) => item.checked === true);
      } else if (open.create) {
        submitItem = tempOrderItems.filter((item) => item.checked === true);
      }

      if (submitItem.length < 1) {
        handleErrorSubmit("item", true);
      } else {
        try {
          let requestData = {};

          let res = {};
          if (open.update) {
            requestData = {
              name: values.name,
              date: values.date,
              remarks: values.remarks,
              items: submitItem.map((item) => ({
                task_item_id: item.task_item_id,
                qty: item.qty,
              })),
            };
            // console.log(`requestData`, requestData);
            handleLoading("update", true);
            res = await deliveryMonitoring.postDeliveryItem(
              "update",
              open?.tempParams?.id,
              requestData
            );
          } else if (open.create) {
            requestData = {
              name: values.name,
              date: values.date,
              remarks: values.remarks,
              items: submitItem.map((item) => ({
                task_item_id: item.id,
                qty: item.qty,
              })),
            };
            handleLoading("create", true);
            res = await deliveryMonitoring.postDeliveryItem(
              "create",
              taskId,
              requestData
            );
          }
          if (res.data.status === true) {
            handleSuccess(res);
          }
        } catch (error) {
          setSubmitting(false);
          setStatus("Failed Submit Data");
          handleError("api", error);
        } finally {
          if (open.update) {
            // console.log(`open.update`, open.update);
            handleLoading("update", false);
            handleVisible("update");
          } else if (open.create) {
            console.log(`open.create`, open.create);
            handleLoading("create", false);
            handleVisible("create");
          }
        }
      }
    },
  });

  const handleDelete = async () => {
    try {
      handleLoading("delete", true);
      // console.log(open.tempParams);
      // const itemId = open?.tempParams?.id;
      const res = await deliveryMonitoring.postDeliveryItem(
        "delete",
        open?.tempParams?.id
      );
      if (res?.data?.status === true) {
        handleSuccess(res);
      }
    } catch (error) {
      handleError(error);
      // console.error(error);
    } finally {
      handleLoading("delete", false);
      handleVisible("delete");
    }
  };

  const handleModal = (type, data) => {
    const option = ["update", "detail"];
    if (option.includes(type)) {
      // console.log(`type`, type);
      // console.log(`data`, data);

      formik.setValues({
        name: data.name,
        date: data.date
          ? formatUpdateDate(new Date(data.date), "yyy-MM-dd")
          : formatUpdateDate(new Date(), "yyy-MM-dd"),
        remarks: data.remarks,
      });
    } else if (type === "create") {
      formik.setValues(initialValues);
    }
  };

  const handleAction = (type, data) => {
    // console.log(`type`, type);
    // console.log(`data`, data);
    switch (type) {
      case "create":
        handleModal("create");
        handleVisible("create", data);
        break;
      case "delete":
        handleVisible("delete", data);
        break;
      case "update":
        handleVisible("update", data);
        handleModal("update", data);
        break;
      case "detail":
        handleVisible("detail", data);
        handleModal("detail", data);
        break;

      default:
        break;
    }
  };

  const generateTableContent = (data) => {
    let dataArr = [];
    // console.log(`data`, data);
    data
      ? data.forEach((item, index) => {
          // console.log(`item`, item);
          let objData = {
            no: (index += 1),
            desc: item?.name || "",
            date: item?.date !== null ? formatDate(new Date(item?.date)) : null,
            remarks: item.remarks || "",
            action: (
              <ButtonAction
                hoverLabel="More"
                data={item}
                handleAction={handleAction}
                ops={[
                  {
                    label: "TITLE.VIEW_DETAILS_DATA",
                    icon: "fas fa-search text-info",
                    type: "detail",
                  },
                  {
                    label: "TITLE.EDIT_DATA",
                    icon: "fas fa-edit text-primary",
                    type: "update",
                  },
                  {
                    label: "TITLE.DELETE_DATA",
                    icon: "fas fa-trash text-danger",
                    type: "delete",
                  },
                ]}
              />
            ),
          };
          dataArr.push(objData);
        })
      : (dataArr = tblHeadDlvItem.map((item) => ({ [item.id]: "" })));
    setTableContent(dataArr);
  };

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const setInitAvailItems = (data) => {
    let temp = data.filter((item) => item.checked === true);
    setTempOrderItems(temp.map((item) => ({ ...item, checked: false })));
  };

  React.useEffect(() => {
    generateTableContent(orderItems);
    setInitAvailItems(items);
  }, [orderItems]);

  return (
    <React.Fragment>
      <Toast />

      <ModalConfirmation
        visible={open.delete}
        onClose={() => handleVisible("delete")}
        title={<FormattedMessage id="TITLE.MODAL_DELETE.TITLE" />}
        subTitle={<FormattedMessage id="TITLE.MODAL_DELETE.SUBTITLE" />}
        textYes={<FormattedMessage id="BUTTON.DELETE" />}
        textNo={<FormattedMessage id="BUTTON.CANCEL" />}
        submitColor="danger"
        onSubmit={() => handleDelete()}
        loading={loading.delete}
      />

      <ModalSubmit
        visible={open.create}
        onClose={() => handleVisible("create")}
        formik={formik}
        loading={loading.create}
        errors={errors}
        handleError={handleErrorSubmit}
      />

      <ModalUpdate
        visible={open.update}
        onClose={() => {
          handleVisible("update");
        }}
        formik={formik}
        loading={loading.update}
        updateData={open.tempParams}
        errors={errors}
        handleError={handleErrorSubmit}
      />

      <ModalDetail
        visible={open.detail}
        onClose={() => handleVisible("detail")}
        formik={formik}
        updateData={open.tempParams}
      />

      <Card>
        <CardContent>
          <div className="d-flex justify-content-end w-100 mb-5">
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => handleAction("create")}
            >
              <span className="nav-icon">
                <i className="flaticon2-plus"></i>
              </span>
              <span className="nav-text">
                <FormattedMessage id="TITLE.ADD" />
              </span>
            </button>
          </div>

          <TablePaginationCustom
            headerRows={tblHeadDlvItem}
            rows={tableContent}
            width={1000}
            loading={loading.fetch}
            withSearch={false}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  items: deliveryMonitoring.dataBarang,
  orderItems: deliveryMonitoring.dataTask?.task_deliveries,
  tempOrderItems: deliveryMonitoring.dataTempOrderItems,
  updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
});

const mapDispatch = (dispatch) => ({
  setTempOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataTempOrderItems,
      payload: payload,
    });
  },
  saveDataTask: (payload) => {
    dispatch({
      type: actionTypes.SetDataTask,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(DeliveryOrder);
