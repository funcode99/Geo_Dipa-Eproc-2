import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from '@material-ui/core';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';

const Jasa = ({ dataJasa }) => {
  // console.log(dataJasa);
  // let data = dataJasa;
  // const dataReceive = props.dataJasa;
  const [data, setData] = useState({ show: false, data: {} });
  console.log(dataJasa);
  console.log(data);

  // useEffect(() => {
  //   if (dataJasa) {
  //     dataJasa.map((item) => {
  //       item.show = false;
  //     });
  //     setData(data);
  //     // console.log(data);
  //   }
  // }, []);

  // if (dataJasa) {
  //   dataJasa.map((item) => {
  //     item.show = false;
  //   });
  //   setData(data);
  //   // console.log(data);
  // }

  const formatDelimiter = (bilangan) => {
    let number_string = bilangan.toString(),
      sisa = number_string.length % 3,
      rupiah = number_string.substr(0, sisa),
      ribuan = number_string.substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    return rupiah;
  };

  const handleClick = (e, itemId) => {
    dataJasa.forEach((item) => {
      if (itemId === item.id) {
        setData({ show: !data.show, data: item });
      }
    });
  };

  const showServiceChild = (itemId) => {
    if (data.show && data.data.id === itemId) {
      console.log(data.data.id);
      return (
        <TableBody>
          {data.data.services.map((item) => {
            return (
              <TableRow>
                <TableCell>
                  <Checkbox
                    name={`checkbox-${item.id}`}
                    color="secondary"
                    onChange={(e) => console.log(e.target)}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>31/01/2021</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell></TableCell>
                <TableCell>Rp.{formatDelimiter(item.price)},00</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      );
    }
    // return (
    //   <TableBody>
    //     {jasa.services.map((item) => {
    //       if (jasa.show) {
    //         return (
    //           <TableRow>
    //             <TableCell></TableCell>
    //             <TableCell>{item.name}</TableCell>
    //             <TableCell>31/01/2021</TableCell>
    //             <TableCell>{item.qty}</TableCell>
    //             <TableCell></TableCell>
    //             <TableCell>Rp.{formatDelimiter(item.price)},00</TableCell>
    //             <TableCell></TableCell>
    //             <TableCell></TableCell>
    //           </TableRow>
    //         );
    //       }
    //     })}
    //   </TableBody>
    // );
  };

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
            {//dataJasa.length !== 0 &&
            dataJasa &&
              dataJasa.map((item) => {
                return (
                  <>
                    <TableBody>
                      <TableRow key={item.id}>
                        <TableCell>
                          <button
                            className="btn btn-primary btn-sm p-1"
                            onClick={(e) => handleClick(e, item.id)}
                          >
                            {data.show ? (
                              <ExpandLessOutlinedIcon />
                            ) : (
                              <ExpandMoreOutlinedIcon />
                            )}
                          </button>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>31/01/2021</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          Rp.{formatDelimiter(item.price)},00
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                    {showServiceChild(item.id)}
                  </>
                );
              })}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Jasa;
