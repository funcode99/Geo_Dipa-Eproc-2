import styled from 'styled-components';
import { TableHead, TableRow } from '@material-ui/core';

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
    font-size: 1.25rem;
  }
`;

export const StyledTableRow = styled(TableRow)`
  td,
  th {
    font-size: 1.25rem;
  }
`;
