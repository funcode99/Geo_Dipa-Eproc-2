import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  Paper,
  makeStyles,
  // Icon,
  Button,
  Container,
  CircularProgress,
} from "@material-ui/core";
import SVG from "react-inlinesvg";
import { useFormik } from "formik";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import * as Yup from "yup";

import {
  Flex,
  StyledHead,
  StyledTableHead,
  Input,
  Reject,
  StyledTableRow,
  WaitingSA,
  PendingTerbit,
} from "./style";
import { StyledModal } from "../../../../components/modals";
import useToast from "../../../../components/toast";
import { SubWrap } from "../../../Master/pages/style";
// import DocumentsTable from './Document';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
}));

export const ServiceAcceptance = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  // const [data, setData] = React.useState();
  const [modals, setModals] = React.useState(false);
  const [confirm, setConfirm] = React.useState({ show: false, id: "" });
  const [update, setUpdate] = React.useState({ id: "", update: false });
  const [loading, setLoading] = React.useState(false);

  const FormSchema = Yup.object().shape({
    periode_name: Yup.string()
      .min(3, "Input minimal 3 karakter")
      .required("Field ini wajib diisi"),
    periode_value: Yup.string().required("Field ini wajib diisi"),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };
  const initialValues = {
    periode_name: "",
    periode_value: 0,
  };

  const getList = async () => {
    try {
      setLoading(true);
      // const {
      //   data: { data },
      // } = await master.getPeriodeList();
      // setData(data);
    } catch (error) {
      setToast("Error API, please contact developer!");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
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
          name: values.periode_name,
          value: values.periode_value,
        };

        // const {
        //   data: { status },
        // } = update.update
        //   ? await master.submitPeriode(requestData, update)
        //   : await master.submitPeriode(requestData);

        // if (status) {
        //   getList();
        //   setModals(false);
        // }
      } catch (error) {
        setToast("Error API, Please contact developer!");
        setSubmitting(false);
        setStatus("Failed Submit Data");
      } finally {
        disableLoading();
      }
    },
  });

  const handleClose = () => {
    setModals(false);
  };
  const handleModal = async (type, id) => {
    if (type === "update") {
      // const {
      //   data: { data },
      // } = await master.getPeriodeID(id);
      // setUpdate({ id, update: true });
      // // formik.setFieldValue('document_name', data[0].name);
      // formik.setValues({
      //   periode_name: data[0].name,
      //   periode_value: data[0].value,
      // });
    } else {
      formik.setValues(initialValues);
    }
    setModals(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // await master.deletePeriode(confirm.id);
      // setConfirm({ ...confirm, show: false });
      getList();
    } catch (error) {
      setToast("Error with API, please contact Developer!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledModal
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
          >
            <div style={{ justifyContent: "center", display: "flex" }}>
              <h3>Input Form</h3>
            </div>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <div style={{ width: "50%", alignSelf: "center" }}>
                <Input
                  label="Nama Periode"
                  variant="outlined"
                  name="periode_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  // value={form.name}
                  // {...register('periode_name')}
                />
                {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {errors.document_name?.message}
                </p> */}
              </div>
              <div style={{ width: "50%", alignSelf: "center" }}>
                <Input
                  type="number"
                  label="Durasi Periode (dalam hari)"
                  variant="outlined"
                  name="periode_duration"
                  // onChange={(e) =>
                  //   setForm({ ...form, duration: e.target.value })
                  // }
                  required
                  // value={form.duration}
                  // {...register('periode_duration')}
                />
                {/* <p style={{ textAlign: 'center', color: 'red', margin: 5 }}>
                  {errors.document_name?.message}
                </p> */}
              </div>
            </div>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <Button
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

      <StyledModal
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
              style={{ width: "40%", marginInline: 10 }}
              onClick={() => setConfirm({ ...confirm, show: false })}
            >
              Cancel
            </Button>
          </div>
        </Flex>
      </StyledModal>

      <div>
        <div className="d-flex align-items-center flex-wrap mr-1">
          <SubWrap className="mr-2 iconWrap">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
            </span>
          </SubWrap>
          <div className="d-flex align-items-baseline mr-5">
            <h2 className="text-dark font-weight-bold my-2 mr-5">
              Service Acceptance List
            </h2>
          </div>
        </div>
        {/* <Flex>
          <div></div>
          <Button
            color="secondary"
            variant="contained"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleModal('create')}
          >
            Create
          </Button>
        </Flex> */}

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <StyledTableHead>
              <StyledHead>
                <TableCell>No</TableCell>
                <TableCell>No Kontrak</TableCell>
                <TableCell>Judul Pengadaan</TableCell>
                <TableCell>No PO</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>No SA</TableCell>
                <TableCell align="center">Status</TableCell>
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              <StyledTableRow hover>
                <TableCell>No</TableCell>
                <TableCell>No Kontrak</TableCell>
                <TableCell>Judul Pengadaan</TableCell>
                <TableCell>No PO</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>No SA</TableCell>
                <TableCell align="center">
                  <WaitingSA>Status</WaitingSA>
                </TableCell>
              </StyledTableRow>
              <StyledTableRow hover>
                <TableCell>No</TableCell>
                <TableCell>No Kontrak</TableCell>
                <TableCell>Judul Pengadaan</TableCell>
                <TableCell>No PO</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>No SA</TableCell>
                <TableCell align="center">
                  <Reject>Status</Reject>
                </TableCell>
              </StyledTableRow>
              <StyledTableRow hover>
                <TableCell>No</TableCell>
                <TableCell>No Kontrak</TableCell>
                <TableCell>Judul Pengadaan</TableCell>
                <TableCell>No PO</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>No SA</TableCell>
                <TableCell align="center">
                  <PendingTerbit>Status</PendingTerbit>
                </TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    </Container>
  );
};

export default ServiceAcceptance;
// export default injectIntl(connect(null, null)(DashboardListContract));
