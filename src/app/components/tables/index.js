import React from 'react';
import { Table, TableBody, TableCell, Paper } from '@material-ui/core';
import { StyledHead, StyledTableHead, StyledTableRow } from './style';

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
}) => {
  return (
    <Paper style={{ marginTop: 20, marginBottom: 20 }}>
      <Table>
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
      </Table>
    </Paper>
  );
};

export default CustomTable;
