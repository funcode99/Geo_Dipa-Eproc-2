import React from "react";
import ModalConfirmation from "../../../../../../components/modals/ModalConfirmation";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
} from "@material-ui/core";
import { rupiah } from "../../../../../../libs/currency";

const ModalCreate = ({
  visible,
  onClose,
  onSubmit,
  additionalParams,
  orderItems,
}) => {
  console.log(`orderItems`, orderItems);

  return (
    <ModalConfirmation
      visible={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      additionalParams={additionalParams}
      title="Yakin ingin order barang tersebut?"
      subTitle="Pastikan barang yang dikirimkan telah sesuai !"
    >
      <React.Fragment>
        <h5 className="mt-5">Barang</h5>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["No", "Name", "Quantity", "Unit Price"].map((item, index) => (
                <TableCell className="bg-white" key={index}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{(index += 1)}</TableCell>
                <TableCell>{item?.desc}</TableCell>
                <TableCell>{item?.qty}</TableCell>
                <TableCell>{rupiah(item?.unit_price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-4 mb-8">
          Total harga adalah
          <span className="text-primary"> Rp. 200.000.000,00</span>.
        </p>

        <TextField
          label="Tanggal Order"
          variant="outlined"
          name="due_date"
          className="w-100"
          size="small"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          // {...formik.getFieldProps("due_date")}
        />
        <p style={{ color: "red" }}>
          {/* {formik.touched.due_date && formik.errors.due_date
        ? formik.errors.due_date
        : null} */}
          Wajib isi tanggal
        </p>
      </React.Fragment>
    </ModalConfirmation>
  );
};

export default ModalCreate;
