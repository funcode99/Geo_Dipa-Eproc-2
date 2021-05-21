import React, {
  useState, useEffect
} from 'react';
import {
  connect
} from "react-redux";
import {
  // FormattedMessage, 
  injectIntl
} from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  Icon,
  Paper
} from '@material-ui/core';
import {
  StyledTableHead,
  IconWrapper,
  StyledTableRow,
  StyledHead,
} from '../style';
import { getRolesBKB } from '../../service/MasterCrud';

const RolesBKB = (props) => {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [rolesBKBData, setRolesBKBData] = useState([]);

  useEffect(() => {
    getRolesBKB().then(response => setRolesBKBData(response.data.data));

    // eslint-disable-next-line
  }, []);

  return (
    <Paper>
      <Table>
        <StyledTableHead>
          <StyledHead>
            <TableCell>No</TableCell>
            <TableCell>Nama Role</TableCell>
            <TableCell>Nilai min. kontrak</TableCell>
            <TableCell>Nilai max. kontrak</TableCell>

            <TableCell align="center" className="MuiTableCell-sizeSmall">
              Action
                </TableCell>
          </StyledHead>
        </StyledTableHead>
        <TableBody>

          {rolesBKBData.map((row, i) => (
            <StyledTableRow key={row.id} hover>
              <TableCell scope="row">{i+1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>Rp. {row.bkb_min_value}</TableCell>
              <TableCell>Rp. {row.bkb_max_value}</TableCell>
              <TableCell align="center">
                <IconWrapper>
                  <Icon
                    style={{ marginInline: 5 }}
                    className="fas fa-edit"
                  />
                </IconWrapper>
              </TableCell>
            </StyledTableRow>
          ))}

        </TableBody>
      </Table>
    </Paper>

  );
}

export default injectIntl(connect(null, null)(RolesBKB));