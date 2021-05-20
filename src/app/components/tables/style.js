import styled from 'styled-components';
import { TableHead, TableRow, Table } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
`;
export const ColumnRow = styled.div`
  width: 100%;
`;

export const StyledTableHead = styled(TableHead)`
  &&& {
    background: linear-gradient(
      90deg,
      rgba(111, 227, 255, 1) 0%,
      rgba(47, 199, 245, 1) 100%
    );
  }
`;

export const StyledHead = styled(TableRow)`
  tr,
  th {
    background: transparent;
    border: 1px solid #ebedf3;
    color: #ffffff;
    padding: 0.5rem 2rem;
    font-size: 14px;
  }
`;

export const StyledTableRow = styled(TableRow)`
  td,
  th {
    border: 1px solid #ebedf3;
    padding: 0.5rem 2rem;
    font-size: 14px;
  }
`;

export const StyledTable = styled(Table)`
  overflow: auto;
  font-size: 0.75rem;
`;
