import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from '@material-ui/core';

export default function Barang(props) {
  const { dataBarang } = props;

  return (
    <div className="table-wrapper-scroll-y my-custom-scrollbar mt-5">
      <div className="segment-table">
        <div className="hecto-10">
          <Table className="table-bordered overflow-auto">
            <TableHead>
              <TableRow>
                <TableCell className="bg-primary text-white"></TableCell>
                <TableCell className="bg-primary text-white">
                  Keterangan
                </TableCell>
                <TableCell className="bg-primary text-white">
                  Due Date
                </TableCell>
                <TableCell className="bg-primary text-white">Qty</TableCell>
                <TableCell className="bg-primary text-white">Uom</TableCell>
                <TableCell className="bg-primary text-white">
                  Gross Price
                </TableCell>
                <TableCell className="bg-primary text-white">
                  Cost Center
                </TableCell>
                <TableCell className="bg-primary text-white">WBS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataBarang &&
                dataBarang.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          name={`checkbox-${item.id}`}
                          color="secondary"
                          onChange={(e) => console.log(e.target)}
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>pcs</TableCell>
                      <TableCell>Gross Price</TableCell>
                      <TableCell>Cost Center</TableCell>
                      <TableCell>WBS</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
