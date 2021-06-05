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

export const DocumentsContext = createContext({});

const Documents = ({ taskId }) => {
  const [loading, setLoading] = React.useState({
    get: false,
    create: false,
    upload: false,
    delete: false,
    submit: false,
    accept: false,
    reject: false,
  });
  const [content, setContent] = React.useState({});
  const [open, setOpen] = React.useState({
    create: false,
    upload: false,
    delete: false,
    submit: false,
    accept: false,
    reject: false,
    tempParams: {},
  });
  const [Toast, setToast] = useToast();
  const handleError = React.useCallback(() => {
    setToast("Error API, please contact developer!");
  }, [setToast]);

  // untuk handle kalo ada error dari api
  const serviceFetch = async (action, key) => {
    try {
      //   const data = await action();
      //   const data = await deliveryMonitoring.getTaskById(taskId);
      //   console.log(`data`, data);
      //   action();
      //   await deliveryMonitoring.getTaskById(taskId);
      //   const res = await deliveryMonitoring.getTaskById(taskId);
      const res = await action();
      console.log(`res1`, res);
      if (res !== undefined) return res;
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        setToast("Error API, please contact developer!");
      }
      console.log(`error`, error);
    } finally {
      handleVisible(key);
      handleLoading(key);
    }
  };

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
    switch (type) {
      case "create":
        handleVisible(type, params);
        break;
      case "delete":
        handleVisible(type, params);
        break;
      case "update":
        // handleVisible(type, params);
        break;
      case "upload":
        handleVisible(type, params);
        break;
      case "submit":
        handleVisible(type, params);
        break;
      case "accept":
        handleVisible(type, params);
        break;
      case "reject":
        handleVisible(type, params);
        break;
      default:
        break;
    }
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
            .then((res) => {
              //   console.log(`res`, res);
              if (res?.data?.status === true) {
                fetchData();
                setToast("Berhasil hapus data");
              }
            })
            .catch((err) => handleError())
            .finally(() => {
              handleLoading(type, false);
              handleVisible(type);
            });
          break;
        case "create":
          console.log(`params`, params);
          if (Array.isArray(params)) {
            let mappedParams = params?.map((el) => {
              let val = JSON.parse(el.value);
              return { document_id: val.id };
            });
            console.log(`type`, type, params, mappedParams);
            deliveryMonitoring
              .postCreateDocArr(taskId, mappedParams)
              .then((res) => {
                // console.log(`resarr`, res);
                if (res?.data?.status === true) {
                  setToast("Berhasil tambah data");
                  fetchData();
                }
              })
              .catch((err) => handleError())
              .finally(() => {
                handleLoading(type, false);
                handleVisible(type);
              });
          } else {
            let val = JSON.parse(params.value);
            deliveryMonitoring
              .postCreateDoc(taskId, {
                document_id: val.id,
                document_custom_name: params.remarks,
              })
              .then((res) => {
                // console.log(`resobj`, res);
                if (res?.data?.status === true) {
                  setToast("Berhasil tambah data");
                  fetchData();
                }
              })
              .catch((err) => handleError())
              .finally(() => {
                handleLoading(type, false);
                handleVisible(type);
              });
          }
          break;
        case "upload":
          deliveryMonitoring
            .postUploadDoc(open?.tempParams?.upload_id, params)
            .then((res) => {
              //   console.log(`res`, res);
              if (res?.data?.status === true) {
                setToast("Berhasil upload berkas");
                fetchData();
              }
            })
            .catch((err) => handleError())
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
      />
      {BASE_MODAL_CONF.map(({ type, ...other }, id) => (
        <ModalConfirmation
          key={id}
          visible={open[type]}
          onClose={() => handleVisible(type)}
          onSubmit={(params) => handleApi(type, params)}
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
