import React from "react";
import {
  Paper,
  makeStyles,
  Icon,
  Button,
  Container,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Switch,
} from "@material-ui/core";
// import SVG from 'react-inlinesvg';
import { useFormik } from "formik";
// import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
// import { Link } from 'react-router-dom';
import * as Yup from "yup";
import * as master from "../service/MasterCrud";
// import http from '../../libs/http';
import { Flex, Input, IconWrapper } from "./style";
import { StyledModal } from "../../../components/modals";
import useToast from "../../../components/toast";
import DocumentsTable from "./Document";
import CustomTable from "../../../components/tables";
import Subheader from "../../../components/subheader";
import TablePaginationCustom from "../../../components/tables/TablePagination";
import ButtonAction from "../../../components/buttonAction/ButtonAction";
import DialogGlobal from "../../../components/modals/DialogGlobal";
import BasicInput from "../../../components/input/BasicInput";
import ItemSwitch from "../../../components/input/ItemSwitch";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

const rowHeader = [
  { id: "no", label: "No" },
  { id: "doc", label: "Dokumen" },
  { id: "periode", label: "Periode", align: "center", sortable: false },
  { id: "action", label: "Action", align: "right", sortable: false },
];

export const DocumentTypes = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const updateCreateRef = React.useRef();
  const confirmationRef = React.useRef();
  // const [docType, setDocType] = React.useState();
  const [modals, setModals] = React.useState(false);
  const [docId, setType] = React.useState();
  const [confirm, setConfirm] = React.useState({ show: false, id: "" });
  const [update, setUpdate] = React.useState({ id: "", update: false });
  const [loading, setLoading] = React.useState(false);
  const [tableContent, setTableContent] = React.useState([]);
  const [newContent, setNewContent] = React.useState([]);

  const FormSchema = Yup.object().shape({
    document_name: Yup.string()
      .min(3, "Input minimal 3 karakter")
      .required("Field ini wajib diisi"),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };
  const initialValues = {
    document_name: "",
    check_periodic: false,
  };

  const generateTableContent = (data) => {
    setTableContent([]);
    const rows1 = [
      {
        content: (
          <Button variant="contained" onClick={() => setType(" ")}>
            See all document type
          </Button>
        ),
        props: { colSpan: 4 },
      },
    ];
    setTableContent((prev) => [...prev, rows1]);
    data.forEach((item, i) => {
      const rows = [
        { content: i + 1, props: { width: "5%" } },
        { content: item.name },
        {
          content: item.is_periodic ? (
            <Icon className="fas fa-check-circle" color="primary" />
          ) : (
            <Icon className="fas fa-times-circle" color="error" />
          ),
        },
        {
          content: (
            <IconWrapper>
              <Icon
                style={{ marginInline: 5 }}
                className="fas fa-search"
                onClick={() => setType(item.id)}
              />
              <Icon
                style={{ marginInline: 5 }}
                className="fas fa-edit"
                onClick={() => handleModal("update", item.id)}
              />
              <Icon
                style={{ marginInline: 5 }}
                className="fas fa-trash"
                color="error"
                onClick={() => setConfirm({ show: true, id: item.id })}
              />
            </IconWrapper>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  };

  const getList = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await master.getList();
      // setDocType(data);
      generateTableContent(data);
      setNewContent(data);
    } catch (error) {
      setToast(error?.message ?? "Error API, please contact developer!");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // const rows1 = [
    //   {
    //     content: (
    //       <Button variant="contained" onClick={() => setType(' ')}>
    //         See all document type
    //       </Button>
    //     ),
    //     props: { colSpan: 4 },
    //   },
    // ];
    // setTableContent((prev) => [...prev, rows1]);
    getList();
    // eslint-disable-next-line
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        enableLoading();
        const requestData = {
          name: values.document_name,
          is_periodic: values.check_periodic,
        };

        const {
          data: { status },
        } = update.update
          ? await master.submitDoctypes(requestData, update)
          : await master.submitDoctypes(requestData);

        if (status) {
          getList();
          setModals(false);
          updateCreateRef.current.close();
        }
      } catch (error) {
        setToast(error?.message ?? "Error API, Please contact developer!");
        setSubmitting(false);
        setStatus("Failed Submit Data");
      } finally {
        disableLoading();
      }
    },
  });

  const handleClose = () => {
    setModals(false);
    updateCreateRef.current.close();
  };
  const handleModal = async (type, id) => {
    if (type === "update") {
      const {
        data: { data },
      } = await master.getByID(id);
      setModals(true);
      updateCreateRef.current.open();
      setUpdate({ id, update: true });
      // formik.setFieldValue('document_name', data[0].name);
      formik.setValues({
        document_name: data[0].name,
        check_periodic: data[0].is_periodic,
      });
    } else {
      setUpdate({ id: "", update: false });
      setModals(true);
      updateCreateRef.current.open();
      formik.setValues(initialValues);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await master.deleteDoctypes(confirm.id);
      setConfirm({ ...confirm, show: false });
      confirmationRef.current.close();
      getList();
    } catch (error) {
      setToast("Error with API, please contact Developer!");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type, params) => {
    switch (type) {
      case "find":
        setType(params?.id);
        break;
      case "update":
        handleModal("update", params?.id);
        break;
      case "delete":
        confirmationRef.current.open();
        setConfirm({ show: true, id: params?.id });
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <Toast />
      <DialogGlobal
        title={`${update.update ? "Update" : "Create"} Master Document Type`}
        ref={updateCreateRef}
        onYes={formik.handleSubmit}
        textYes={update.update ? "Update" : "Create"}
      >
        <Flex style={{ justifyContent: "center" }}>
          <form
            noValidate
            autoComplete="off"
            // onSubmit={handleSubmit(formSubmit)}
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div style={{ width: "70%" }}>
                <Input
                  style={{ margin: 0 }}
                  label="Nama Dokumen"
                  variant="outlined"
                  name="document_name"
                  {...formik.getFieldProps("document_name")}
                />
                <p style={{ color: "red", margin: 5 }}>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </p>
              </div>
              <div>
                <FormControlLabel
                  style={{ alignSelf: "center" }}
                  control={
                    <Switch
                      name="check_periodic"
                      color="primary"
                      size="medium"
                      checked={formik.values.check_periodic}
                      {...formik.getFieldProps("check_periodic")}
                    />
                  }
                  label="Periodik"
                />
              </div>
            </div>
            {/* <div style={{ justifyContent: "center", display: "flex" }}>
              <Button
                disabled={loading}
                type="submit"
                color="secondary"
                variant="contained"
                style={{ width: "50%" }}
              >
                {loading ? <CircularProgress /> : null}&nbsp;
                {update.update ? "Update" : "Create"}
              </Button>
            </div> */}
          </form>
        </Flex>
      </DialogGlobal>
      {/* <StyledModal
        visible={modals}
        onClose={handleClose}
        hideCloseIcon={false}
        disableBackdrop
      >
        <Flex style={{ justifyContent: "center" }}>
          <form
            noValidate
            autoComplete="off"
            // onSubmit={handleSubmit(formSubmit)}
            onSubmit={formik.handleSubmit}
          >
            <div style={{ justifyContent: "center", display: "flex" }}>
              <h3>Input Form</h3>
            </div>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <div style={{ width: "70%", alignSelf: "center" }}>
                <Input
                  label="Nama Dokumen"
                  variant="outlined"
                  name="document_name"
                  {...formik.getFieldProps("document_name")}
                />
                <p style={{ textAlign: "center", color: "red", margin: 5 }}>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </p>
              </div>
              <div style={{ alignSelf: "center" }}>
                <FormControlLabel
                  style={{ alignSelf: "center" }}
                  control={
                    <Checkbox
                      name="check_periodic"
                      color="primary"
                      size="medium"
                      checked={formik.values.check_periodic}
                      {...formik.getFieldProps("check_periodic")}
                    />
                  }
                  label="Periodik"
                />
              </div>
            </div>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <Button
                disabled={loading}
                type="submit"
                color="secondary"
                variant="contained"
                style={{ width: "50%" }}
              >
                {loading ? <CircularProgress /> : null}&nbsp;
                {update.update ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Flex>
      </StyledModal>
       */}
      <DialogGlobal
        title={`Are you sure ?`}
        ref={confirmationRef}
        onYes={() => handleDelete()}
        textYes={"Delete"}
      >
        <div>
          <p>Item terpilih akan dihapus dari list</p>
          <p>Selected item will be removed from the list.</p>
        </div>
      </DialogGlobal>
      {/* <StyledModal
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        hideCloseIcon={false}
        disableBackdrop
        align="center"
      >
        <Flex>
          <div>
            <p>Yakin ingin menghapus?</p>
          </div>
          <div>
            <Button
              variant="contained"
              disabled={loading}
              style={{
                width: "40%",
                background: "red",
                color: "white",
                marginInline: 10,
              }}
              onClick={() => handleDelete()}
            >
              {loading ? <CircularProgress /> : null}&nbsp; Delete
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              style={{ width: "40%", marginInline: 10 }}
              onClick={() => setConfirm({ ...confirm, show: false })}
            >
              Cancel
            </Button>
          </div>
        </Flex>
      </StyledModal> */}

      <div>
        <Subheader
          text="Master Document Type"
          // IconComponent={<DescriptionOutlined style={{ color: 'white' }} />}
        />
        <Flex
          style={{
            display: "flex",
            flexDirection: "row",
            // direction: "rtl",
          }}
        >
          {/* <div></div> */}
          <Button
            variant="contained"
            style={{
              marginLeft: "auto",
              marginRight: 13,
            }}
            onClick={() => setType(" ")}
          >
            See all document type
          </Button>
          <Button
            color="secondary"
            variant="contained"
            // style={{ marginLeft: "auto" }}
            onClick={() => handleModal("create")}
          >
            Create
          </Button>
        </Flex>

        <Paper className={classes.root} style={{ marginBottom: 30 }}>
          {/* <CustomTable
            tableHeader={[
              { label: "No" },
              { label: "Dokumen" },
              { label: "Periode" },
              { label: "Action" },
            ]}
            tableContent={tableContent}
            marginY="my-1"
            hecto="hecto-10"
            loading={loading}
          /> */}
          {/* <Button variant="contained" onClick={() => setType(" ")}>
            See all document type
          </Button> */}
          <TablePaginationCustom
            headerRows={rowHeader}
            rows={newContent.map((el, id) => ({
              no: id + 1,
              doc: el.name,
              periode: el.is_periodic ? (
                <Icon className="fas fa-check-circle" color="primary" />
              ) : (
                <Icon className="fas fa-times-circle" color="error" />
              ),
              action: (
                <ButtonAction
                  data={el}
                  handleAction={handleAction}
                  ops={[
                    {
                      label: "ECOMMERCE.COMMON.SEARCH",
                      icon: "fas fa-search text-warning",
                      type: "find",
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
              // action: (
              //   <IconWrapper>
              //     <Icon
              //       style={{ marginInline: 5 }}
              //       className="fas fa-search"
              //       onClick={() => setType(el.id)}
              //     />
              //     <Icon
              //       style={{ marginInline: 5 }}
              //       className="fas fa-edit"
              //       onClick={() => handleModal("update", el.id)}
              //     />
              //     <Icon
              //       style={{ marginInline: 5 }}
              //       className="fas fa-trash"
              //       color="error"
              //       onClick={() => setConfirm({ show: true, id: el.id })}
              //     />
              //   </IconWrapper>
              // ),
            }))}
          />
        </Paper>
        {docId ? <DocumentsTable typeId={docId} /> : null}
      </div>
    </Container>
  );
};

export default DocumentTypes;
// export default injectIntl(connect(null, null)(DashboardListContract));
