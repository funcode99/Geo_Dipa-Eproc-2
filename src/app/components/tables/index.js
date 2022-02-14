import React from 'react';
import { TableBody, TableCell, CircularProgress } from '@material-ui/core';
import {
  StyledHead,
  StyledTableHead,
  StyledTableRow,
  StyledTable,
} from './style';

const exampleHeader = [
  { label: 'contoh 1', props: {} },
  { label: 'contoh 2', props: {} },
];
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
  marginY = 'my-10',
  hecto = 'hecto-10',
}) => {
  return (
    <div className={`table-wrapper-scroll-y my-custom-scrollbar ${marginY}`}>
      <div className="segment-table">
        <div className={hecto}>
          <StyledTable>
            <StyledTableHead>
              <StyledHead>
                {tableHeader?.map((item, i) => (
                  <TableCell align={align} key={i} {...item.props}>
                    {item.label}
                  </TableCell>
                ))}
              </StyledHead>
            </StyledTableHead>
            <TableBody>
              {tableContent.length < 1 ? (
                <StyledTableRow>
                  <TableCell colSpan={tableHeader.length} align="center">
                    Empty Data
                  </TableCell>
                </StyledTableRow>
              ) : null}
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
