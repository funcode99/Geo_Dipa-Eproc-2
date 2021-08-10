import { Card, CardContent } from "@material-ui/core";
import React, { createContext } from "react";
import { connect } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import {
  ModalSubmit,
  ModalDetail,
  RowCollapse,
  BtnAction,
  // DeliveryOrderItem,
  ModalSubmitItem,
  ModalDelete,
} from "./components";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { FormattedMessage } from "react-intl";
import {
  formatDate,
  formatInitialDate,
  formatUpdateDate,
} from "../../../../../libs/date";
import * as Yup from "yup";
import { useFormik } from "formik";
import DevOrderItem from "./components/DevOrderItem";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import { tblHeadDlvItem } from "./components/fieldData";
import { TerminPageContext } from "../TerminPageNew/TerminPageNew";
import { MODAL } from "../../../../../../service/modalSession/ModalService";

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

const addClassToOptions = (data) => {
  data.map((item, index) => {
    switch (item.name) {
      case "WAITING APPROVAL":
        item.class = "dark";
        break;

      case "APPROVED":
        item.class = "success";
        break;

      case "REJECTED":
        item.class = "danger";
        break;

      default:
        break;
    }
  });
};

const changeSequenceOptions = (arr) => {
  let temp = [];
  arr.forEach((item) => {
    if (item.code === "rejected") {
      temp[0] = item;
    }

    if (item.code === "approved") {
      temp[1] = item;
    }

    if (item.code === "waiting") {
      temp[2] = item;
    }
  });
  return temp;
};

const DeliveryOrder = ({
  // taskId,
  items,
  orderItems,
  tempOrderItems,
  setTempOrderItems,
  saveDataTask,
  status,
  fetchApi,
  loadings,
}) => {
  const { func, task_id } = React.useContext(TerminPageContext);
  const taskId = task_id;
  const [open, setOpen] = React.useState({
    submit: false,
    delete: false,
    detail: false,
    confirm: false,
    tempParams: {},
    tempItems: [],
  });
  const [tableContent, setTableContent] = React.useState([]);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const isVendor = status === "vendor";
  const excludeAction = isVendor ? [""] : ["update", "delete"];
  const [dataOrderItem, setDataOrderItem] = React.useState({});
  const [itemForm, setItemForm] = React.useState({});
  const submitItemRef = React.useRef();
  const deleteRef = React.useRef();
  const submitRef = React.useRef();
  const detailRef = React.useRef();

  const handleVisible = (key, tempParams = {}, tempItems = [], state) => {
    // console.log(`tempParams`, tempParams);
    // if (key === "change_status") {
    //   setOpen((prev) => ({
    //     ...prev,
    //     [key]: true,
    //     tempParams: { ...tempParams },
    //   }));
    // } else {
    // if (dataOrderItem !== {}) setDataOrderItem({});
    if (key === "confirm") {
      setOpen((prev) => ({
        ...prev,
        [key]: state !== undefined ? state : !prev[key],
        tempItems: [...tempItems],
      }));
    } else {
      setOpen((prev) => ({
        ...prev,
        [key]: state !== undefined ? state : !prev[key],
        tempParams: { ...tempParams },
      }));
    }
    // }
  };

  const getTask = () => {
    fetchApi({
      keys: keys.fetch,
      type: "get",
      url: `/delivery/task/${taskId}/delivery-order`,
      onSuccess: (res) => {
        // console.log(`res`, res.data);
        saveDataTask(res?.data);
        generateTableContent(res?.data.task_deliveries);
        setInitAvailItems(items);
        if (dataOrderItem !== {}) {
          let findItem = res?.data?.task_deliveries.filter(
            (el) => el.id === dataOrderItem.id
          )[0];
          setDataOrderItem(findItem);
        }
      },
    });
  };

  const [errors, setErrors] = React.useState({});

  const handleErrorSubmit = (type, err) => {
    setErrors((prev) => ({ ...prev, [type]: err }));
  };

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      console.log(`masuk sini`);
      console.log(`open`, open);

      // untuk update approval status
      if (open.detail) {
        console.log(`masuk sini`, values);
        if (values.status === 4) {
          MODAL.showSnackbar("Mohon isikan delivery order status.", "error");
          return;
        }
        fetchApi({
          key: keys.detail,
          type: "post",
          url: `delivery/task-delivery/${open?.tempParams?.id}/status`,
          params: {
            approve_status_id: values.status,
            reject_text: values.status_remarks,
          },
          alertAppear: "both",
          onSuccess: (res) => {
            // console.log(`res`, res);
            getTask();
            // handleVisible("detail", {});
            detailRef.current.close();
          },
          onFail: (error) => {
            console.log(`error`, error);
            setSubmitting(false);
            setStatus("Failed Submit Data");
          },
        });
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
          // console.log(`isUpdate`, isUpdate);

          fetchApi({
            key: keys.submit,
            type: isUpdate ? "put" : "post",
            url: isUpdate
              ? `/delivery/task-delivery/${open?.tempParams?.id}`
              : `/delivery/task-delivery/${taskId}`,
            params: {
              name: values.name,
              date: values.date,
              remarks: values.remarks,
              items: submitItem.map((item) => ({
                task_item_id: item.id,
                qty: item.qty,
              })),
            },
            alertAppear: "both",
            onSuccess: (res) => {
              // console.log(`res`, res);
              console.log(`open`, open);
              getTask();
              func.onRefresh();

              // handleVisible("submit", {});
              submitRef.current.close();
            },
            onFail: (error) => {
              // console.log(`error`, error);
              setSubmitting(false);
              setStatus("Failed Submit Data");
            },
          });
        }
      }
    },
  });

  const handleDelete = async () => {
    fetchApi({
      key: keys.delete,
      type: "delete",
      url: `/delivery/task-delivery/${open?.tempParams?.id}`,
      alertAppear: "both",
      onSuccess: (res) => {
        // console.log(`res`, res);
        func.onRefresh();
        getTask();
        handleVisible("delete", {});
        deleteRef.current.close();
      },
    });
  };

  const handleConfirmItem = React.useCallback(() => {
    // console.log(`itemForm`, itemForm, dataOrderItem, Object.values(itemForm));
    fetchApi({
      key: keys.submit_item,
      type: "post",
      url: `delivery/task-delivery-item/${dataOrderItem.id}/status`,
      alertAppear: "both",
      params: {
        items: Object.values(itemForm).map((el) => ({
          ...el,
          qty_approved: parseFloat(el.qty_approved),
        })),
      },
      onSuccess: (res) => {
        getTask();
        func.onRefresh();
        submitItemRef.current.close();
        handleVisible("confirm", {}, []);
      },
    });
  }, [dataOrderItem, itemForm, fetchApi]);

  const handleModal = (type, data) => {
    const option = ["update", "detail"];
    if (option.includes(type)) {
      // console.log(`type`, type);
      // console.log(`data`, data);
      const displayedStatus = ["approved", "rejected"];

      formik.setValues({
        name: data.name,
        date: data.date
          ? formatUpdateDate(new Date(data.date), "yyy-MM-dd")
          : formatUpdateDate(new Date(), "yyy-MM-dd"),
        remarks: data.remarks,
        status: displayedStatus.includes(data.approve_status.code)
          ? data.approve_status_id
          : initialValues.status,
        status_remarks: data.reject_text || initialValues.status_remarks,
      });
    } else if (type === "create") {
      formik.setValues(initialValues);
    }
  };

  const processingData = (oldItems, itemForm) => {
    let olds = [...oldItems];
    let news = [...itemForm];
    let result = [];
    olds.forEach((item1, index1) => {
      news.forEach((item2, index2) => {
        if (item1.id === item2.id) {
          let objData = {};
          objData = {
            name: item1?.item?.desc,
            qty: item1?.qty,
            qty_approved: item2?.qty_approved,
            approve_status: item2.approve_status,
            reject_text: item2.reject_text,
          };
          result.push(objData);
        }
      });
    });
    return result;
  };

  const createItemForm = (arrItems) => {
    let temp = [...arrItems];
    let result = [];
    temp.forEach((el) => {
      let objData = {};
      if (el?.approve_status?.code !== "waiting") {
        objData = {
          name: el?.item?.desc,
          qty: el?.qty,
          qty_approved: el?.qty_approved,
          approve_status: el?.approve_status?.name,
          reject_text: el?.reject_text,
        };
        result.push(objData);
      }
    });
    return result;
  };

  const handleAction = (type, data) => {
    // console.log(`type`, type);
    // console.log(`data`, data);
    switch (type) {
      case "create":
        setIsUpdate(false);
        handleModal("create");
        handleVisible("submit", data);
        submitRef.current.open();
        break;
      case "delete":
        handleVisible("delete", data);
        deleteRef.current.open();
        break;
      case "update":
        setIsUpdate(true);
        handleVisible("submit", data);
        handleModal("update", data);
        submitRef.current.open();
        break;
      case "detail":
        handleVisible("detail", data);
        handleModal("detail", data);
        detailRef.current.open();
        break;

      case "change_status":
        // dibuat gini supaya ke refresh data yang munculs
        setDataOrderItem({});
        setTimeout(() => setDataOrderItem(data), 350);
        break;

      case "confirm":
        let dataArr = [];

        if (Object.keys(itemForm).length === 0) {
          dataArr = createItemForm(data?.task_delivery_items);
        } else {
          dataArr = processingData(
            data?.task_delivery_items,
            Object.values(itemForm)
          );
        }

        setTimeout(() => {
          handleVisible("confirm", data, dataArr);
          submitItemRef.current.open();
        }, 200);
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
                isVendor={isVendor}
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
                    label: isVendor
                      ? "TITLE.DETAIL_ITEMS"
                      : "TITLE.CHANGE_ITEM_STATUS",
                    icon: isVendor
                      ? "fas fa-eye text-grey"
                      : "fas fa-edit text-primary",
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

  const setInitAvailItems = (data) => {
    let temp = data.filter((item) => item.checked === true);
    setTempOrderItems(
      temp.map((item) => ({ ...item, checked: false, qty_avail: item.qty }))
    );
  };

  const getOptions = async () => {
    fetchApi({
      key: keys.option,
      type: "get",
      url: `/delivery/options`,
      onSuccess: (res) => {
        let approveStatusOptions = res?.data?.approve_status;
        approveStatusOptions = changeSequenceOptions(approveStatusOptions);
        addClassToOptions(approveStatusOptions);
        setOptions(approveStatusOptions);
      },
    });
  };

  React.useEffect(() => {
    getTask();
    // generateTableContent(orderItems);
    setInitAvailItems(items);
    getOptions();
  }, [items]);

  const handleRefresh = () => {
    getTask();
    func.onRefresh();
    // let tempData = { ...dataOrderItem };
    // setDataOrderItem({});
    // setTimeout(() => setDataOrderItem(tempData), 350);
  };

  return (
    <React.Fragment>
      <ModalSubmitItem
        innerRef={submitItemRef}
        visible={open.confirm}
        onClose={() => handleVisible("confirm", {}, [])}
        onSubmit={() => handleConfirmItem()}
        loading={loadings.submit_item}
        data={open.tempItems}
      />

      <ModalDelete
        innerRef={deleteRef}
        visible={open.delete}
        onClose={() => handleVisible("delete", {})}
        onSubmit={() => handleDelete()}
        loading={loadings.delete}
      />

      <ModalSubmit
        innerRef={submitRef}
        visible={open.submit}
        onClose={() => handleVisible("submit")}
        formik={formik}
        loading={loadings.submit}
        errors={errors}
        handleError={handleErrorSubmit}
        updateData={open.tempParams}
        isUpdate={isUpdate}
      />

      <ModalDetail
        innerRef={detailRef}
        visible={open.detail}
        onClose={() => handleVisible("detail")}
        formik={formik}
        updateData={open.tempParams}
        userStatus={status}
        options={options}
        loading={loadings.detail}
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
            loading={loadings.fetch}
            withSearch={false}
            withPagination={true}
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
      {dataOrderItem && (
        <DevOrderItem
          data={dataOrderItem}
          options={options}
          setItem={setItemForm}
          handleAction={handleAction}
          isVendor={isVendor}
          onRefresh={handleRefresh}
          // handleSubmit={() => handleAction("confirm", null)}
        />
      )}
    </React.Fragment>
  );
};

const keys = {
  submit_item: "submit-item",
  fetch: "fetch-task",
  submit: "submit-delivery-order",
  detail: "update-delivery-order-status",
  delete: "delete-delivery-order",
  option: "approve-status-option",
};

const mapState = (state) => {
  const { auth, deliveryMonitoring } = state;
  return {
    items: deliveryMonitoring.dataBarang,
    orderItems: deliveryMonitoring.dataOrderItems.task_deliveries,
    tempOrderItems: deliveryMonitoring.dataTempOrderItems,
    updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
    status: auth.user.data.status,
    loadings: {
      submit_item: getLoading(state, keys.submit_item),
      fetch: getLoading(state, keys.fetch),
      submit: getLoading(state, keys.submit),
      detail: getLoading(state, keys.detail),
      delete: getLoading(state, keys.delete),
      option: getLoading(state, keys.option),
    },
  };
};

const mapDispatch = (dispatch) => ({
  setTempOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataTempOrderItems,
      payload: payload,
    });
  },
  setUpdateOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataUpdateOrderItems,
      payload: payload,
    });
  },
  saveDataTask: (payload) => {
    dispatch({
      type: actionTypes.SetDataOrderItems,
      payload: payload,
    });
  },
  fetchApi: (payload) => dispatch(fetch_api_sg(payload)),
});

export default connect(mapState, mapDispatch)(DeliveryOrder);
