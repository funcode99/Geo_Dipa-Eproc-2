import React from "react";
import { FormDetail, Item, ModalDelete, ModalTerm } from "./index";
import { Container } from "@material-ui/core";
import ButtonAction from "../../../../../../components/buttonAction/ButtonAction";
import { formatDate } from "../../../../../../libs/date";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../libs/currency";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import ExpansionBox from "../../../../../../components/boxes/ExpansionBox";
import { NavLink, useHistory } from "react-router-dom";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../../redux/globalReducer";
import ModalApproveTermin from "./ModalApproveTermin";
import { MODAL } from "../../../../../../../service/modalSession/ModalService";
import StatusRemarks from "../../../../../../components/StatusRemarks";
import { Button } from "react-bootstrap";
import apiHelper from "../../../../../../service/helper/apiHelper";
import GRAccord from "../../../Termin/ServiceAccGR/components/GRAccord";

const tableHeaderTerminNew = [
  {
    id: "number",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.NO" />,
  },
  // {
  //   id: "action",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
  //   sortable: false,
  // },
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
  {
    id: "bobot",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.WEIGHT" />,
  },
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
    id: "termin_progress",
    label: "Termin Progress",
    rightSticky: true,
    right: "18.5%",
  },
  {
    id: "status",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />,
    rightSticky: true,
    right: "5.5%",
  },
  // {
  //   id: "approve_status",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.STATUS" />
  // },
  {
    id: "action",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
    sortable: false,
    rightSticky: true,
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

const DetailPage = ({
  contractId,
  contract,
  dataSubmitItems,
  saveSubmitItems,
  saveContractById,
  authStatus,
  fetch_api_sg,
  loadings,
  refresh,
  show,
}) => {
  const [newContent, setNewContent] = React.useState([]);
  const [confirm, setConfirm] = React.useState({ show: false, id: "" });
  const [modals, setModals] = React.useState(false);
  const [update, setUpdate] = React.useState({ id: "", update: false });
  const [options, setOptions] = React.useState();
  const [showForm, setShowForm] = React.useState(false);
  const { tasks } = contract;
  const submitRef = React.useRef();
  const deleteRef = React.useRef();
  const approveRef = React.useRef();
  const rejectRef = React.useRef();
  const revisionRef = React.useRef();
  const history = useHistory();

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

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      fetch_api_sg({
        key: keys.submit,
        type: update.update ? "put" : "post",
        url: update.update
          ? `/delivery/task/${update.id}`
          : `/delivery/task-item`,
        params: update.update
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
            },
        alertAppear: "both",
        onSuccess: (res) => {
          getContractById(contractId);
          setTimeout(() => {
            setInitialSubmitItems();
          }, 500);
          setModals(false);
          submitRef.current.close();
        },
        onFail: (err) => {
          setSubmitting(false);
          setStatus("Failed Submit Data");
        },
      });
    },
  });

  const handleModal = React.useCallback(
    async (type, items) => {
      if (type === "update") {
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
      submitRef.current.open();
    },
    [dataSubmitItems, formik, initialValues, saveSubmitItems]
  );

  const handleAction = React.useCallback(
    (type, data) => {
      switch (type) {
        case "update":
          handleModal("update", data);
          break;
        case "delete":
          setConfirm({ show: true, id: data.id });
          deleteRef.current.open();
          break;
        case "approve":
          approveRef.current.open(data);
          break;
        case "reject":
          // MODAL.showSnackbar("FUNGSI INI BELUM TERSEDIA", "warning", 5000);
          rejectRef.current.open(data);
          break;
        case "revision":
          revisionRef.current.open(data);
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
      arrData = data.map((item, index) => {
        let optionsAction = [
          {
            label: "TITLE.REVISION",
            icon: "fas fa-file-prescription text-warning",
            type: "revision",
          },
        ];

        if (item?.approve_status?.name !== "APPROVED") {
          optionsAction = [
            {
              label: "TITLE.APPROVE",
              icon: "fas fa-check-circle text-success",
              type: "approve",
            },
            {
              label: "TITLE.REJECT",
              icon: "fas fa-times-circle text-warning",
              type: "reject",
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
          ];
        }

        // <Button
        //   variant="link"
        //   onClick={() => {
        //     // if (item?.approve_status?.name === "APPROVED")
        //     history.push(
        //       `/${authStatus}/delivery-monitoring/contract/task/${item.id}`
        //     );
        //     // else
        //     //   MODAL.showSnackbar(
        //     //     "Mohon Approve termin ini terlebih dahulu",
        //     //     "warning"
        //     //   );
        //   }}
        // >
        {
          /* </Button> */
        }
        return {
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
          // approve_status: item?.approve_status?.name,
          // status: item?.approve_status?.name,
          termin_progress: (
            <div>
              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                {item?.last_step?.label}
              </span>
              <span className="text-muted font-weight-bold">
                {item?.last_step?.state}
              </span>
            </div>
          ),
          status: (
            <StatusRemarks
              status={item?.approve_status?.name}
              remarks={item?.reject_text}
              approvedBy={item?.users?.username ?? "N/A"}
            />
          ),
          // status: item?.task_status?.name, //DEPRECATED
          action: (
            <ButtonAction
              data={item}
              handleAction={handleAction}
              ops={optionsAction}
              // ops={[
              //   // {
              //   //   label: "CONTRACT_DETAIL.TABLE_ACTION.DETAIL",
              //   //   icon: "fas fa-search",
              //   //   to: {
              //   //     url: `/${authStatus}/delivery-monitoring/contract/task/${item.id}`,
              //   //     style: {
              //   //       color: "black",
              //   //     },
              //   //   },
              //   // },
              //   {
              //     label: "TITLE.APPROVE",
              //     icon: "fas fa-check-circle text-success",
              //     // disabled:
              //     //   item.task_status_id === "89a4fe6c-9ce2-4595-b8f0-914d17c91bb4"
              //     //     ? true
              //     //     : false,
              //     type: "approve",
              //   },
              //   {
              //     label: "TITLE.REJECT",
              //     icon: "fas fa-times-circle text-warning",
              //     type: "reject",
              //   },
              //   {
              //     label: "CONTRACT_DETAIL.TABLE_ACTION.EDIT",
              //     icon: "fas fa-edit text-primary",
              //     disabled:
              //       item.task_status_id ===
              //       "89a4fe6c-9ce2-4595-b8f0-914d17c91bb4"
              //         ? true
              //         : false,
              //     type: "update",
              //   },
              //   {
              //     label: "CONTRACT_DETAIL.TABLE_ACTION.DELETE",
              //     icon: "fas fa-trash text-danger",
              //     type: "delete",
              //   },
              // ]}
            />
          ),
        };
      });
      setNewContent(arrData);
    },
    [handleAction]
  );

  const getContractById = React.useCallback(
    (contractId, toast = { visible: false, message: "" }) => {
      // enableLoading();

      fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/delivery/contract/${contractId}`,
        onSuccess: (res) => {
          addCheckedField(res?.data?.services, "jasa");
          addCheckedField(res?.data?.items, "barang");
          saveContractById(res?.data);
          generateTableContent(res?.data?.tasks);
          setShowForm(true);
        },
      });
    },
    [generateTableContent, saveContractById, fetch_api_sg]
  );

  const handleClose = () => {
    setModals(false);
  };

  const handleDelete = async () => {
    fetch_api_sg({
      key: keys.delete,
      type: "delete",
      url: `/delivery/task/${confirm.id}`,
      alertAppear: "both",
      onSuccess: (res) => {
        getContractById(contractId);
        setConfirm({ ...confirm, show: false, id: "" });
        deleteRef.current.close();
      },
    });
  };

  const getOptions = async () => {
    fetch_api_sg({
      key: keys.option,
      type: "get",
      url: `/delivery/options`,
      onSuccess: (res) => {
        const taskStatusOptions = res?.data?.task_status;
        setOptions(taskStatusOptions);
      },
    });
  };

  // React.useEffect(() => {
  //   getContractById(contractId);
  //   if (tasks && tasks.length > 0) {
  //     generateTableContent(tasks);
  //   }

  //   getOptions(contractId);
  //   // eslint-disable-next-line
  // }, []);

  React.useEffect(() => {
    if (refresh === true) {
      getContractById(contractId);
      if (tasks && tasks.length > 0) {
        generateTableContent(tasks);
      }
      getOptions(contractId);
    }
  }, [refresh]);

  const handleApi = (type, params) => {
    switch (type) {
      case "approve":
        fetch_api_sg({
          key: keys.approve,
          type: "post",
          alertAppear: "both",
          url: `delivery/task/${params?.id}/change-status`,
          params: {
            approve_status_id: "5d28463c-a435-4ec3-b0dc-e8dcb85aa800",
          },
          onSuccess: (res) => {
            getContractById(contractId);
            approveRef.current.close();
          },
        });
        break;
      case "reject":
        fetch_api_sg({
          key: keys.reject,
          type: "post",
          alertAppear: "both",
          url: `delivery/task/${params?.id}/change-status`,
          params: {
            approve_status_id: "f11b1105-c234-45f9-a2e8-2b2f12e5ac8f",
            reject_text: params?.remarks_fill,
          },
          onSuccess: (res) => {
            getContractById(contractId);
            rejectRef.current.close();
          },
        });
        break;
      case "revision":
        const paramsUsed = {
          approve_status_id: apiHelper.revisionId,
          reject_text: params?.remarks_fill,
        };
        fetch_api_sg({
          key: keys.revision,
          type: "post",
          alertAppear: "both",
          url: `delivery/task/${params?.id}/change-status`,
          params: paramsUsed,
          onSuccess: (res) => {
            getContractById(contractId);
            revisionRef.current.close();
          },
        });
        break;

      default:
        break;
    }
  };

  return show ? (
    <React.Fragment>
      <ModalTerm
        innerRef={submitRef}
        visible={modals}
        onClose={handleClose}
        update={update}
        loading={loadings.submit}
        formik={formik}
        options={options}
      />

      <ModalApproveTermin
        ref={approveRef}
        loading={loadings.approve}
        onSubmit={(e) => handleApi("approve", e)}
      />
      <ModalApproveTermin
        ref={rejectRef}
        loading={loadings.reject}
        onSubmit={(e) => handleApi("reject", e)}
        isReject={true}
      />
      <ModalApproveTermin
        ref={revisionRef}
        loading={loadings.revision}
        onSubmit={(e) => handleApi("revision", e)}
        isReject={true}
        title={"Revisi Termin"}
        checkboxLabel={"Need revision on this termin"}
      />

      <ModalDelete
        innerRef={deleteRef}
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false, id: "" })}
        onSubmit={() => handleDelete()}
        loading={loadings.delete}
      />
      {showForm && <FormDetail contractId={contractId} />}
      <div className="p-8">
        <GRAccord
          id={"title.termtable"}
          label={<FormattedMessage id="TITLE.ITEM_TABLE" />}
        >
          <Item handleClick={() => handleModal("create")} />
        </GRAccord>
        <GRAccord
          id={"title.termtable"}
          label={<FormattedMessage id="TITLE.TERM_TABLE" />}
        >
          <TablePaginationCustom
            headerRows={tableHeaderTerminNew}
            rows={newContent}
            width={1700}
            loading={loadings.fetch}
            withSearch={false}
          />
        </GRAccord>
      </div>
      {/* <Container>
        <ExpansionBox title={"TITLE.TERM_TABLE"}>
        </ExpansionBox>
      </Container> */}
    </React.Fragment>
  ) : (
    <div />
  );
};

const keys = {
  option: "task-status-option",
  fetch: "get-data-contract-by-id",
  submit: "post-term",
  delete: "delete-term",
  approve: "approve-termin",
  reject: "reject-termin",
  revision: "revision-termin",
};

const mapState = (state) => {
  const { deliveryMonitoring, auth } = state;
  return {
    dataSubmitItems: deliveryMonitoring.dataSubmitItems,
    contract: deliveryMonitoring.dataContractById,
    authStatus: auth.user.data.status,
    loadings: {
      fetch: getLoading(state, keys.fetch),
      option: getLoading(state, keys.option),
      submit: getLoading(state, keys.submit),
      delete: getLoading(state, keys.delete),
      approve: getLoading(state, keys.approve),
      reject: getLoading(state, keys.reject),
      revision: getLoading(state, keys.revision),
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
