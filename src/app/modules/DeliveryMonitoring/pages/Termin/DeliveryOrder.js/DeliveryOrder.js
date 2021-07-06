import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import {
  ModalSubmit,
  ModalDetail,
  RowCollapse,
  BtnAction,
  DeliveryOrderItem,
} from "./components";
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
import * as Option from "../../../../../service/Option";
import DevOrderItem from "./components/DevOrderItem";

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
    id: "approve_status",
    label: <FormattedMessage id="TITLE.STATUS" />,
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
  status: 4,
  status_remarks: "",
};

const DeliveryOrder = ({
  taskId,
  items,
  orderItems,
  tempOrderItems,
  setTempOrderItems,
  saveDataTask,
  updateOrderItems,
  status,
}) => {
  const [open, setOpen] = React.useState({
    submit: false,
    delete: false,
    detail: false,
    change_status: false,
    tempParams: {},
  });
  const [tableContent, setTableContent] = React.useState([]);
  const [loading, setLoading] = React.useState({
    fetch: false,
    submit: false,
    detail: false,
    delete: false,
    change_status: false,
  });
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const isVendor = status === "vendor";
  const excludeAction = isVendor ? ["change_status"] : ["update", "delete"];
  const [Toast, setToast] = useToast();
  const [dataOrderItem, setDataOrderItem] = React.useState({});

  const handleVisible = (key, tempParams = {}, state) => {
    // console.log(`tempParams`, tempParams);
    // if (key === "change_status") {
    //   setOpen((prev) => ({
    //     ...prev,
    //     [key]: true,
    //     tempParams: { ...tempParams },
    //   }));
    // } else {
    if (dataOrderItem !== {}) setDataOrderItem({});
    setOpen((prev) => ({
      ...prev,
      [key]: state !== undefined ? state : !prev[key],
      tempParams: { ...tempParams },
    }));
    // }
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

      case "options":
        if (
          err.response?.code !== 400 &&
          err.response?.data.message !== "TokenExpiredError"
        ) {
          setToast(err.response?.data.message, 5000);
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
      // untuk update approval status
      if (open.detail) {
        console.log(`values`, values);

        try {
          const requestData = {
            approve_status_id: values.status,
            reject_text: values.status_remarks,
          };

          handleLoading("detail", true);

          const res = await deliveryMonitoring.postDeliveryItem(
            "delivery_order_status",
            open?.tempParams?.id,
            requestData
          );

          if (res.data.status === true) {
            handleSuccess(res);
          }
        } catch (error) {
          setSubmitting(false);
          setStatus("Failed Submit Data");
          handleError("api", error);
        } finally {
          handleLoading("detail", false);
          handleVisible("detail");
        }
      }

      // untuk create atau update data
      if (open.submit) {
        let submitItem = [];

        if (open.submit) {
          submitItem = tempOrderItems.filter((item) => item.checked === true);
        }

        if (open.submit && submitItem.length < 1) {
          handleErrorSubmit("item", true);
        } else {
          try {
            let requestData = {};

            requestData = {
              name: values.name,
              date: values.date,
              remarks: values.remarks,
              items: submitItem.map((item) => ({
                task_item_id: item.id,
                qty: item.qty,
              })),
            };
            handleLoading("submit", true);

            let res = {};
            if (isUpdate) {
              res = await deliveryMonitoring.postDeliveryItem(
                "update",
                open?.tempParams?.id,
                requestData
              );
            } else if (open.submit) {
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
            handleLoading("submit", false);
            handleVisible("submit");
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
        status: data.approve_status_id || initialValues.status,
        status_remarks: data.reject_text || initialValues.status_remarks,
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
        setIsUpdate(false);
        handleModal("create");
        handleVisible("submit", data);
        break;
      case "delete":
        setIsUpdate(false);
        handleVisible("delete", data);
        break;
      case "update":
        setIsUpdate(true);
        handleVisible("submit", data);
        handleModal("update", data);
        break;
      case "detail":
        setIsUpdate(false);
        handleVisible("detail", data);
        handleModal("detail", data);
        break;

      case "change_status":
        // console.log(`type`, type, data);
        // console.log(`data`, data);
        // handleVisible("change_status", data, true);
        setDataOrderItem({});
        setTimeout(() => {
          setDataOrderItem(data);
        }, 350);
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
            approve_status: item?.approve_status?.name,
            history: item?.task_delivery_histories,
            action: (
              <BtnAction
                status={item?.approve_status?.code}
                label="TITLE.MORE"
                data={item}
                handleAction={handleAction}
                exclude={excludeAction}
                ops={[
                  {
                    label: "TITLE.VIEW_DETAILS_DATA",
                    icon: "fas fa-search text-info",
                    type: "detail",
                  },
                  {
                    label: "TITLE.CHANGE_ITEM_STATUS",
                    icon: "fas fa-edit text-primary",
                    type: "change_status",
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

  const getOptions = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await Option.getAllOptions();

      setOptions(data?.approve_status);
    } catch (error) {
      handleError("options", error);
    } finally {
      // setLoading(false);
    }
  };

  React.useEffect(() => {
    generateTableContent(orderItems);
    setInitAvailItems(items);
    getOptions();
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
        visible={open.submit}
        onClose={() => handleVisible("submit")}
        formik={formik}
        loading={loading.submit}
        errors={errors}
        handleError={handleErrorSubmit}
        updateData={open.tempParams}
        isUpdate={isUpdate}
      />

      <ModalDetail
        visible={open.detail}
        onClose={() => handleVisible("detail")}
        formik={formik}
        updateData={open.tempParams}
        userStatus={status}
        options={options}
        handleError={handleError}
        loading={loading.detail}
      />

      <Card>
        <CardContent>
          {isVendor && (
            <div className="d-flex justify-content-end w-100 mb-5">
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => handleAction("create", null)}
              >
                <span className="nav-icon">
                  <i className="flaticon2-plus"></i>
                </span>
                <span className="nav-text">
                  <FormattedMessage id="TITLE.ADD" />
                </span>
              </button>
            </div>
          )}

          <TablePaginationCustom
            headerRows={tblHeadDlvItem}
            rows={tableContent}
            // width={1000}
            maxHeight={300}
            loading={loading.fetch}
            withSearch={false}
            withPagination={false}
            renderRows={({ item, index }) => {
              return (
                <RowCollapse key={index} row={item} childData={item?.history} />
              );
            }}
          />

          {/* <DeliveryOrderItem
              headerRows={tblHeadDlvItem}
              rows={tableContent}
              data={open.tempParams}
            /> */}
        </CardContent>
      </Card>
      {<DevOrderItem data={dataOrderItem} />}
    </React.Fragment>
  );
};

const mapState = ({ auth, deliveryMonitoring }) => ({
  items: deliveryMonitoring.dataBarang,
  orderItems: deliveryMonitoring.dataTask?.task_deliveries,
  tempOrderItems: deliveryMonitoring.dataTempOrderItems,
  updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
  status: auth.user.data.status,
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
