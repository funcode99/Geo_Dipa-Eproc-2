import React from 'react';
import styled from 'styled-components';
import { TableCell } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
`;

export const ColumnRow = styled.div`
  width: 100%;
`;

export const TableCellStyled = styled(TableCell)`
  font-size: 1rem;
`;

export const TableHeadStyled = ({ rows }) => {
  return (
    <thead>
      <tr className="text-muted">
        {rows.map((row) => (
          <th>{row}</th>
        ))}
      </tr>
    </thead>
  );
};

export const TableResponsive = ({ children }) => {
  return (
    <div className="table-responsive" style={{ maxHeight: '30vh' }}>
      {children}
    </div>
  );
};

export const TableStyled = ({ children }) => {
  return <table className="table table-hover table-bordered">{children}</table>;
};

export const SelectStyled = (props) => {
  const { options, label, onChange } = props;

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

export const CheckBoxStyled = (props) => {
  const { list, keyId, label } = props;
  return (
    <div className="form-group">
      <label htmlFor="doc_type" className="h3">
        {label}
      </label>
      {list
        .find((item) => item.id === +keyId)
        .document.map((item) => (
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
