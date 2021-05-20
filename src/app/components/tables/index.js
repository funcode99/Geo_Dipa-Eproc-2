import React from 'react';
import { TableBody, TableCell, CircularProgress } from '@material-ui/core';
import {
  StyledHead,
  StyledTableHead,
  StyledTableRow,
  StyledTable,
} from './style';

const exampleHeader = ['', ''];
const exampleBody = [
  [
    { content: '', props: {} },
    { content: '', props: {} },
  ],
  [
    { content: '', props: {} },
    { content: '', props: {} },
  ],
];

// NOTE: please send props exactly example above this.

const CustomTable = ({
  tableHeader = exampleHeader,
  tableContent = exampleBody,
  align = 'center',
  loading = false,
}) => {
  return (
    <div className="table-wrapper-scroll-y my-custom-scrollbar my-10">
      <div className="segment-table">
        <div className="hecto-10">
          <StyledTable>
            <StyledTableHead>
              <StyledHead>
                {tableHeader?.map((item, i) => (
                  <TableCell align={align} key={i}>
                    {item}
                  </TableCell>
                ))}
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <TableCell colSpan={tableHeader.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </StyledTableRow>
              ) : null}
              {tableContent?.map((item, i) => (
                <StyledTableRow key={i + 100} hover>
                  {item.map((items, ix) => {
                    return (
                      <TableCell align={align} key={ix + 10} {...items.props}>
                        {items.content}
                      </TableCell>
                    );
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
