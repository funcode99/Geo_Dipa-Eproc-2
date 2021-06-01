import React, { createContext } from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import TableDoc from "./components/TableDoc";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import ModalDeleteDoc from "./components/ModalDeleteDoc";
import useToast from "../../../../../components/toast";
import ModalAddDeliverables from "./components/ModalAddDeliverables";
import ModalUploadDoc from "./components/ModalUploadDoc";

export const DocumentsContext = createContext({});

const Documents = ({ taskId }) => {
  const [loading, setLoading] = React.useState({
    get: false,
    create: false,
    upload: false,
    delete: false,
  });
  const [content, setContent] = React.useState({});
  const [open, setOpen] = React.useState({
    create: false,
    upload: false,
    delete: false,
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
    switch (type) {
      case "create":
        console.log(`type`, type, params);
        handleVisible(type, params);
        break;
      case "delete":
        console.log(`type`, type, params);
        handleVisible(type, params);
        break;
      case "update":
        console.log(`type`, type, params);
        // handleVisible(type, params);
        break;
      case "upload":
        console.log(`type`, type, params);
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
          deliveryMonitoring
            .postCreateDoc(taskId, params)
            .then((res) => {
              //   console.log(`res`, res);
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
      <div className="d-flex justify-content-end w-100">
        <button
          className="btn btn-outline-success btn-sm mt-3 mb-2"
          onClick={() => handleAction("create")}
        >
          <span className="nav-icon">
            <i className="flaticon2-plus"></i>
          </span>
          <span className="nav-text">Deliverables</span>
        </button>
      </div>
      <Card className="mt-5">
        <CardBody>
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
