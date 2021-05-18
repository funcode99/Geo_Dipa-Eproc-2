// import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TableHead, TextField, Select, TableRow } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
`;
export const ColumnRow = styled.div`
  width: 100%;
`;

export const StyledTableHead = styled(TableHead)`
  background: linear-gradient(
    90deg,
    rgba(111, 227, 255, 1) 0%,
    rgba(47, 199, 245, 1) 100%
  );

  div {
    color: red;
  }
`;
export const StyledTableRow = styled(TableRow)`
  td,
  th {
    font-size: 1.25rem;
  }
`;

export const StyledLink = styled(Link)`
  margin: 0 0.5rem;

  span {
    width: 2rem;
  }
`;

export const IconWrapper = styled.div`
  margin: 0 0.5rem;
  color: rgba(47, 199, 245, 1);
  // color: blue;
  span {
    width: 2rem;
    cursor: pointer;
  }
`;

export const Flex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Input = styled(TextField)`
  margin: 1rem 1rem;
  width: 90%;
  display: flex;
  justify-content: center;
`;

export const SelectStyled = styled(Select)`
  margin: 1rem 1rem;
  width: 90%;
`;

export const InputWrapper = styled.div`
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const FormContent = styled.div`
  // width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const WaitingSA = styled.div`
  background: linear-gradient(
    90deg,
    rgba(198, 148, 249, 1) 0%,
    rgba(171, 100, 244, 1) 100%
  );
  color: #fff;
  border-radius: 10px;
`;
export const PendingTerbit = styled.div`
  background: linear-gradient(90deg, #6aa5e3 0%, #6866e9 100%);
  color: #fff;
  border-radius: 10px;
`;

export const Reject = styled.div`
  background: linear-gradient(90deg, #feb683 0%, #ff8993 100%);
  color: #fff;
  border-radius: 10px;
`;

export const StyledHead = styled(TableRow)`
  tr,
  th {
    background: transparent;
    font-size: 1.25rem;
  }
`;

export const SubWrap = styled.div`
  background: linear-gradient(
    90deg,
    rgba(111, 227, 255, 1) 0%,
    rgba(47, 199, 245, 1) 100%
  );
  padding: 5px;
  border-radius: 10px;
`;

// Detail

export const Wrapper = styled.div`
  margin: 1rem;
  width: 50%;
`;

export const InputSeparator = styled.div`
  margin: 0.5rem 0;
  width: ${(props) => props.w};
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  align-items: center;
`;

// export const DeliverableDocs = ({ docType, repType, repNames, showStatus }) => {
//   const [show, setShow] = React.useState(false);

//   return (
//     <Container>
//       <ColumnRow><p className="mb-0 text-bold">{docType}</p></ColumnRow>
//       <ColumnRow>{repType}</ColumnRow>
//       {repNames.map((item) => {
//         if (showStatus) return (<ColumnRow> {item.name}</ColumnRow>)
//       })}
//     </Container >
//   );
// };
