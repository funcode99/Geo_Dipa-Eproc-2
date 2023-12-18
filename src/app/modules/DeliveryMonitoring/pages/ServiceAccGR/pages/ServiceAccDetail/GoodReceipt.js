import React from "react";
import {
  Input as Files,
  InputLabel,
  Button,
  Container,
  CircularProgress,
} from "@material-ui/core";
import { useFormik } from "formik";
// import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
// import { Link } from 'react-router-dom';
import * as Yup from "yup";
// import * as master from '../service/MasterCrud';
// import http from '../../libs/http';
import {
  Flex,
  Input,
  Wrapper,
  InputWrapper,
  InputSeparator,
  FlexCol,
  ErrorText,
} from "./style";

import { StyledModal } from "../../../../../../components/modals";
import useToast from "../../../../../../components/toast";
import CustomTable from "../../../../../../components/tables";

export const GoodReceipt = () => {
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
  // const handleModal = async (type, id) => {
  //   if (type === 'update') {
  //     // const {
  //     //   data: { data },
  //     // } = await master.getPeriodeID(id);
  //     // setUpdate({ id, update: true });
  //     // // formik.setFieldValue('document_name', data[0].name);
  //     // formik.setValues({
  //     //   periode_name: data[0].name,
  //     //   periode_value: data[0].value,
  //     // });
  //   } else {
  //     formik.setValues(initialValues);
  //   }
  //   setModals(true);
  // };

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
      <Toast />
      <StyledModal
        visible={modals}
        onClose={handleClose}
        hideCloseIcon={false}
        disableBackdrop
      >
        <FlexCol style={{ justifyContent: "center" }}>
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
                  label="Nama Periode"
                  variant="outlined"
                  name="periode_name"
                  {...formik.getFieldProps("periode_name")}
                />
                <p style={{ textAlign: "center", color: "red", margin: 5 }}>
                  {formik.touched.periode_name && formik.errors.periode_name
                    ? formik.errors.periode_name
                    : null}
                </p>
              </div>
              <div style={{ width: "70%", alignSelf: "center" }}>
                <Input
                  label="Durasi (dalam hari)"
                  type="number"
                  variant="outlined"
                  name="periode_value"
                  {...formik.getFieldProps("periode_value")}
                />
                <p style={{ textAlign: "center", color: "red", margin: 5 }}>
                  {formik.touched.periode_value && formik.errors.periode_value
                    ? formik.errors.periode_value
                    : null}
                </p>
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
        </FlexCol>
      </StyledModal>
      <StyledModal
        visible={confirm.show}
        onClose={() => setConfirm({ ...confirm, show: false })}
        hideCloseIcon={false}
        disableBackdrop
        align="center"
      >
        <FlexCol>
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
        </FlexCol>
      </StyledModal>

      {/* Service Acceptance Wrapper  */}
      <div>
        <Flex>
          <Wrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Nomor SA</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Posting Date</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Docuument Date</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>PO Number</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Purchasing Group</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Telephone</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Currency</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Ref. QA</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
          </Wrapper>

          {/* Left  */}
          <Wrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Pihak Pertama</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  //
                  multiline
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>
            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Pihak Kedua</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Input
                  //
                  multiline
                  variant="outlined"
                  name="document_name"
                  // onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required

                  // {...register('document_name')}
                />
                <ErrorText>
                  {formik.touched.document_name && formik.errors.document_name
                    ? formik.errors.document_name
                    : null}
                </ErrorText>
              </InputSeparator>
            </InputWrapper>

            <InputWrapper>
              <InputSeparator w="25%">
                <InputLabel>Unggah SA</InputLabel>
              </InputSeparator>
              <InputSeparator w="75%">
                <Files
                  type="file"
                  style={{ marginBottom: 10 }}
                  disableUnderline
                />
                {/* <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => handleModal('create')}
                >
                  Upload SA - TTD
                </Button>
                <p style={{ margin: 10, color: '#6aa5e3' }}>jpg.pdf</p> */}
              </InputSeparator>
            </InputWrapper>
          </Wrapper>
        </Flex>

        <CustomTable
          tableHeader={[
            { label: "Line" },
            { label: "Material Number" },
            { label: "Description" },
            { label: "Order Qty" },
            { label: "Received Qty" },
            { label: "UoM" },
            { label: "Sloc" },
            { label: "Stor Bin" },
          ]}
          tableContent={[
            [
              { content: "0001" },
              { content: "2101021" },
              { content: "Leapfrog Geothermal", width: "20%" },
              { content: "1" },
              { content: "1" },
              { content: "AU" },
              { content: "" },
              { content: "" },
            ],
          ]}
        />

        <CustomTable
          tableHeader={[
            "Nama",
            "Posisi",
            "Aktifitas",
            "Tanggal Mulai",
            "Tanggal Selesai",
            "Komentar",
          ]}
          tableContent={[
            [
              { content: "Dian PS" },
              { content: "IT Asman" },
              { content: "Create GR", props: { width: "20%" } },
              { content: "30 Jan 2021" },
              { content: "29 Feb 2021" },
              { content: "Sesuai ketentuan" },
            ],
          ]}
        />
      </div>
    </Container>
  );
};

export default GoodReceipt;
// export default injectIntl(connect(null, null)(DashboardListContract));
