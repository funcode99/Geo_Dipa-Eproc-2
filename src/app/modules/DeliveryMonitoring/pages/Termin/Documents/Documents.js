import React, { createContext } from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import TableDoc from "./components/TableDoc";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import ModalDeleteDoc from "./components/ModalDeleteDoc";
import useToast from "../../../../../components/toast";
import ModalAddDeliverables from "./components/ModalAddDeliverables";
import ModalUploadDoc from "./components/ModalUploadDoc";
import CircularProgress from "@material-ui/core/CircularProgress";
import HeaderTableDoc from "./components/HeaderTableDoc";
import ModalSubmitDoc from "./components/ModalSubmitDoc";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import BASE_MODAL_CONF from "./BASE_MODAL_CONF";
import ModalEditDraft from "./components/ModalEditDraft";
import {
  fetch_api_sg,
  getLoading,
  set_loading_done_rd,
  set_loading_rd,
} from "../../../../../../redux/globalReducer";
import { connect } from "react-redux";
import { MODAL } from "../../../../../../service/modalSession/ModalService";

export const DocumentsContext = createContext({});

const keyList = "fetch_deliverables";
const keys = {
  accept: "accept-deliverables",
  reject: "reject-deliverables",
  upload: "upload-deliverables",
  resend: "resend-deliverables",
  list: "list-deliverables",
};

const Documents = ({
  taskId,
  loadings,
  set_loading_rd,
  set_loading_done_rd,
  fetch_api_sg,
  loadStepper,
}) => {
  const [loading, setLoading] = React.useState({
    get: false,
    create: false,
    upload: false,
    edit: false,
    resend: false,
    submit: false,
    accept: false,
    reject: false,
    delete: false,
  });
  const [content, setContent] = React.useState({});
  const [open, setOpen] = React.useState({
    create: false,
    upload: false,
    edit: false,
    resend: false,
    submit: false,
    accept: false,
    reject: false,
    delete: false,
    tempParams: {},
  });
  const [Toast, setToast] = useToast();
  const handleError = React.useCallback(
    (err) => {
      console.log(`err`, err);
      setToast("Error API, please contact developer!");
    },
    [setToast]
  );
  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        fetchData();
        loadStepper();
        setToast(res?.data?.message);
      }
    },
    [setToast, fetchData]
  );

  // untuk buka / tutup modal
  const handleVisible = (key, tempParams = {}) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
      tempParams: { ...prev.tempParams, ...tempParams },
    }));
  };

  // buat buka modal + simpan param sementara dari list
  const handleAction = (type, params) => {
    console.log(`type`, type, params);
    handleVisible(type, params);
  };

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const fetchData = React.useCallback(() => {
    handleLoading("get", true);
    // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
    fetch_api_sg({
      key: keys.list,
      type: "get",
      url: `/delivery/task/${taskId}`,
      onSuccess: (res) => {
        if (res.status === true) setContent(res?.data);
      },
    });

    // deliveryMonitoring
    //   .getTaskById(taskId)
    //   .then((res) => {
    //     console.log(`res`, res);
    //     handleLoading("get", false);
    //     if (res.data.status === true) setContent(res?.data?.data);
    //   })
    //   .catch((err) => console.log("err", err));
  }, [taskId]);

  // submit ke api
  const handleApi = React.useCallback(
    (type, params) => {
      handleLoading(type, true);
      switch (type) {
        case "delete":
          deliveryMonitoring
            .deleteDocId(open?.tempParams?.delete_id)
            .then(handleSuccess)
            // .then((res) => {
            //   //   console.log(`res`, res);
            //   if (res?.data?.status === true) {
            //     fetchData();
            //     setToast("Berhasil hapus data");
            //   }
            // })
            .catch(handleError)
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
          break;
        case "create":
          console.log(`params`, params);
          // handle multi create document
          if (Array.isArray(params)) {
            let mappedParams = params?.map((el) => {
              let val = JSON.parse(el.value);
              return { document_id: val.id };
            });
            console.log(`type`, type, params, mappedParams);
            deliveryMonitoring
              .postCreateDocArr(taskId, mappedParams)
              .then(handleSuccess)
              .catch(handleError)
              .finally(() => {
                handleLoading(type, false);
                handleVisible(type);
              });
          } else {
            // handle single create document
            let val = JSON.parse(params.value);
            deliveryMonitoring
              .postCreateDoc(taskId, {
                document_id: val.id,
                document_custom_name: params.remarks,
              })
              .then(handleSuccess)
              .catch(handleError)
              .finally(() => {
                handleLoading(type, false);
                handleVisible(type);
              });
          }
          break;
        case "upload":
          fetch_api_sg({
            key: keys.upload,
            type: "postForm",
            alertAppear: "both",
            params,
            url: `delivery/task-document-upload/${open?.tempParams?.upload_id}`,
            onSuccess: () => {
              fetchData();
              loadStepper();
              handleLoading(type, false);
              handleVisible(type);
            },
          });
          // deliveryMonitoring
          //   .postUploadDoc(open?.tempParams?.upload_id, params)
          //   .then(handleSuccess)
          //   .catch(handleError)
          //   .finally(() => {
          //     handleLoading(type, false);
          //     handleVisible(type);
          //   });
          break;
        case "resend":
          fetch_api_sg({
            key: keys.resend,
            type: "postForm",
            alertAppear: "both",
            params,
            url: `delivery/task-document-upload/${open?.tempParams?.resend_id}`,
            onSuccess: () => {
              fetchData();
              handleLoading(type, false);
              handleVisible(type);
            },
          });
          // RESEND MASIH PAKE API UPLOAD
          // deliveryMonitoring
          //   .postUploadDoc(open?.tempParams?.resend_id, params)
          //   .then(handleSuccess)
          //   .catch(handleError)
          //   .finally(() => {
          //     handleLoading(type, false);
          //     handleVisible(type);
          //   });
          break;
        case "accept":
          // console.log(`accept`, params, type, open?.tempParams?.accept_id);
          fetch_api_sg({
            key: keys.accept,
            type: "post",
            alertAppear: "both",
            params,
            url: `delivery/task-document/${open?.tempParams?.accept_id}/approve`,
            onSuccess: () => {
              fetchData();
              handleLoading(type, false);
              handleVisible(type);
            },
          });
          // deliveryMonitoring
          //   .acceptDocId(open?.tempParams?.accept_id, )
          //   .then(handleSuccess)
          //   .catch(handleError)
          //   .finally(() => {
          //     handleLoading(type, false);
          //     handleVisible(type);
          //   });
          break;
        case "reject":
          // console.log(`reject`, type, open?.tempParams?.reject_id, params);
          fetch_api_sg({
            key: keys.reject,
            type: "post",
            alertAppear: "both",
            params: {
              remarks_status: params?.remarks,
            },
            url: `delivery/task-document/${open?.tempParams?.reject_id}/reject`,
            onSuccess: () => {
              fetchData();
              handleLoading(type, false);
              handleVisible(type);
            },
          });
          // deliveryMonitoring
          //   .rejectDocId(open?.tempParams?.reject_id)
          //   .then(handleSuccess)
          //   .catch(handleError)
          //   .finally(() => {
          //     handleLoading(type, false);
          //     handleVisible(type);
          //   });
          break;
        case "submit":
          // console.log(`submit`, type, open?.tempParams?.submit_id);
          deliveryMonitoring
            .submitDocId(open?.tempParams?.submit_id)
            .then(handleSuccess)
            .catch(handleError)
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
          break;
        default:
          break;
      }
    },
    [open]
  );

  React.useEffect(() => {
    if (taskId !== "") fetchData();
  }, [taskId]);

  return (
    <DocumentsContext.Provider
      value={{
        content,
        loading,
        taskId,
        handleAction,
        handleVisible,
        open,
        handleApi,
      }}
    >
      {/* {loadings.list && <CircularProgress />} */}
      <Toast />
      <ModalDeleteDoc
        visible={open.delete}
        onClose={() => handleVisible("delete")}
        onSubmit={(params) => handleApi("delete", params)}
        loading={loadings.delete}
      />
      <ModalAddDeliverables
        visible={open.create}
        onClose={() => handleVisible("create")}
        onSubmit={(params) => handleApi("create", params)}
        loading={loadings.create}
      />
      <ModalUploadDoc
        visible={open.upload}
        onClose={() => handleVisible("upload")}
        onSubmit={(params) => handleApi("upload", params)}
        additionalParams={open.tempParams}
        loading={loadings.upload}
      />
      <ModalUploadDoc
        visible={open.resend}
        onClose={() => handleVisible("resend")}
        onSubmit={(params) => handleApi("resend", params)}
        additionalParams={open.tempParams}
        loading={loadings.resend}
      />
      {/* <ModalEditDraft
        visible={open.edit}
        onClose={() => handleVisible("edit")}
        onSubmit={(params) => handleApi("edit", params)}
      /> */}
      {/* <ModalEditDraft
        visible={open.resend}
        onClose={() => handleVisible("resend")}
        additionalParams={open.tempParams}
        onSubmit={(params) => handleApi("resend", params)}
      /> */}
      {BASE_MODAL_CONF.map(({ type, ...other }, id) => (
        <ModalConfirmation
          key={id}
          visible={open[type]}
          type={type}
          loading={loadings[type]}
          onClose={() => handleVisible(type)}
          onSubmit={(params) => handleApi(type, params)}
          additionalParams={open.tempParams}
          {...other}
        />
      ))}

      <Card className="mt-5">
        <CardBody>
          <HeaderTableDoc />
          <TableDoc loading={loadings.list} />
        </CardBody>
      </Card>
    </DocumentsContext.Provider>
  );
};

Documents.defaultProps = {
  taskId: "",
};

const mapState = (state) => ({
  // loadings: state.globalReducer.loadings,
  loadings: {
    list: getLoading(state, keys.list),
    accept: getLoading(state, keys.accept),
    reject: getLoading(state, keys.reject),
    upload: getLoading(state, keys.upload),
    resend: getLoading(state, keys.resend),
  },
});

const mapDispatch = {
  set_loading_rd,
  set_loading_done_rd,
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(Documents);
