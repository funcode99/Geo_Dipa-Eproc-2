import React from 'react';
import styled from 'styled-components';
import { TableCell, TableHead, TableRow, Table } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
`;

export const ColumnRow = styled.div`
  width: 100%;
`;

export const TableCellStyled = styled(TableCell)`
  font-size: 1rem;
`;

export const StyledTableHead = styled(TableHead)`
&&& {
  background: linear-gradient(
    90deg,
    rgba(111, 227, 255, 1) 0%,
    rgba(47, 199, 245, 1) 100%
  ) !important;
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

const initialOptions = [
  { id: 'item-1', name: 'Item One' },
  { id: 'item-2', name: 'Item Two' },
  { id: 'item-3', name: 'Item Three' },
];

export const SelectStyled = ({
  options = initialOptions,
  label = 'Select Option',
  onChange,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="doc_type" className="h3">
        {label}
      </label>
      <select className="form-control" id="doc_type" onChange={onChange}>
        <option value="">Pilih dokumen</option>
        {options.map((item) => (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const CheckBoxStyled = ({
  list = initialOptions,
  keyId = '',
  label = 'Checkbox',
}) => {
  return (
    <div className="form-group">
      <label htmlFor="doc_type" className="h3">
        {label}
      </label>
      {list.map((item) => (
        <div className="form-check" key={item.id}>
          <input
            className="form-check-input"
            type="checkbox"
            value={item.id}
            id={`check-${item.id}`}
          />
          <label className="form-check-label" htmlFor={`check-${keyId}`}>
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export const ChildTables = (props) => {
  const { itemId, showChild, handleModalEdit, handleModalDelete } = props;

  if (showChild.show && showChild.data.id === itemId) {
    return (
      <tbody>
        {showChild.data.child.map((item) => (
          <tr>
            <td>
              <div className="d-flex justify-content-center">
                <i className="fa fa-file"></i>
              </div>
            </td>
            <td>{item.nama}</td>
            <td>{item.due_date}</td>
            <td>{item.mo}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="d-flex justify-content-between flex-row">
                <button className="btn btn-sm p-1" onClick={handleModalEdit}>
                  <i className="fas fa-edit text-primary"></i>
                </button>
                <button
                  className="btn btn-sm p-1 mr-2"
                  onClick={handleModalDelete}
                >
                  <i className="fas fa-trash text-danger"></i>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
};
