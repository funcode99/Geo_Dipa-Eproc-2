import React from "react";
import { Col, Row } from "react-bootstrap";
import { Dropdown, Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";

const FilterDate = (onFetch) => {
  return (
    <div>
      <Dropdown className="dropdown-inline" drop="down" alignRight>
        <Dropdown.Toggle
          className="btn-primary btn-sm font-weight-bolder dropdown-toggle px-5"
          variant="transparent"
          id="dropdown-toggle-top"
        >
          Filter by Date
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-xl dropdown-menu-right px-3">
          <Form.Group as={Row} className={"mb-0"}>
            <Form.Label column>Start date</Form.Label>
            <Col sm="8">
              <input
                type={"date"}
                className="form-control form-control-sm"
                min="0"
                name={"filter-start-date"}
                id={"filter-start-date"}
                placeholder={"Start date ..."}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className={"mb-0"}>
            <Form.Label column>End date</Form.Label>
            <Col sm="8">
              <input
                type={"date"}
                className="form-control form-control-sm"
                min="0"
                name={"filter-end-date"}
                id={"filter-end-date"}
                placeholder={"End date ..."}
              />
            </Col>
          </Form.Group>
          <div className="d-flex flex-row mt-3 justify-content-end">
            <button
              type="button"
              className="mx-1 float-left btn btn-sm btn-primary"
              onClick={() => {}}
            >
              <FormattedMessage id="TITLE.UPDATE" />
            </button>
            <button
              type="button"
              className="ml-1 float-right btn btn-sm btn-light d-flex"
              onClick={() => {}}
            >
              <i className="fas fa-redo fa-right py-1 mx-1"></i>
              <span>
                <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
              </span>
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FilterDate;
