import React, { createContext } from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import TableDoc from "./components/TableDoc";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import ModalDeleteDoc from "./components/ModalDeleteDoc";
import useToast from "../../../../../components/toast";
import ModalAddDeliverables from "./components/ModalAddDeliverables";
import ModalUploadDoc from "./components/ModalUploadDoc";
import Button from "@material-ui/core/Button";
import HeaderTableDoc from "./components/HeaderTableDoc";
import ModalSubmitDoc from "./components/ModalSubmitDoc";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import BASE_MODAL_CONF from "./BASE_MODAL_CONF";
import ModalEditDraft from "./components/ModalEditDraft";

export const DocumentsContext = createContext({});

const Documents = ({ taskId }) => {
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
    //   switch (type) {
    //     case "create":
    //       handleVisible(type, params);
    //       break;
    //     case "delete":
    //       handleVisible(type, params);
    //       break;
    //     case "update":
    //       // handleVisible(type, params);
    //       break;
    //     case "upload":
    //       handleVisible(type, params);
    //       break;
    //     case "submit":
    //       handleVisible(type, params);
    //       break;
    //     case "accept":
    //       handleVisible(type, params);
    //       break;
    //     case "reject":
    //       handleVisible(type, params);
    //       break;
    //     default:
    //       break;
    //   }
  };

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const fetchData = React.useCallback(() => {
    handleLoading("get", true);
    // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
    deliveryMonitoring
      .getTaskById(taskId)
      .then((res) => {
        console.log(`res`, res);
        handleLoading("get", false);
        if (res.data.status === true) setContent(res?.data?.data);
      })
      .catch((err) => console.log("err", err));
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
          deliveryMonitoring
            .postUploadDoc(open?.tempParams?.upload_id, params)
            .then(handleSuccess)
            .catch(handleError)
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
          break;
        case "resend":
          // RESEND MASIH PAKE API UPLOAD
          deliveryMonitoring
            .postUploadDoc(open?.tempParams?.resend_id, params)
            .then(handleSuccess)
            .catch(handleError)
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
          break;
        case "accept":
          // console.log(`accept`, type, open?.tempParams?.accept_id);
          deliveryMonitoring
            .acceptDocId(open?.tempParams?.accept_id)
            .then(handleSuccess)
            .catch(handleError)
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
          break;
        case "reject":
          // console.log(`reject`, type, open?.tempParams?.reject_id);
          deliveryMonitoring
            .rejectDocId(open?.tempParams?.reject_id)
            .then(handleSuccess)
            .catch(handleError)
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
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
      <Toast />
      <ModalDeleteDoc
        visible={open.delete}
        onClose={() => handleVisible("delete")}
        onSubmit={(params) => handleApi("delete", params)}
      />
      <ModalAddDeliverables
        visible={open.create}
        onClose={() => handleVisible("create")}
        onSubmit={(params) => handleApi("create", params)}
      />
      <ModalUploadDoc
        visible={open.upload}
        onClose={() => handleVisible("upload")}
        onSubmit={(params) => handleApi("upload", params)}
        additionalParams={open.tempParams}
      />
      <ModalUploadDoc
        visible={open.resend}
        onClose={() => handleVisible("resend")}
        onSubmit={(params) => handleApi("resend", params)}
        additionalParams={open.tempParams}
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
          onClose={() => handleVisible(type)}
          onSubmit={(params) => handleApi(type, params)}
          additionalParams={open.tempParams}
          {...other}
        />
      ))}

      <Card className="mt-5">
        <CardBody>
          <HeaderTableDoc />
          <TableDoc />
        </CardBody>
      </Card>
    </DocumentsContext.Provider>
  );
};

Documents.defaultProps = {
  taskId: "",
};

export default Documents;
