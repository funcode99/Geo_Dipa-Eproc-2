import { Menu } from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useCallback, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormattedMessage } from "react-intl";

const FilterDate = ({ setQuery, query }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(() => {
    let query = {};
    setOpen(false);
    if (!isEmpty(startDate)) query.start_date = startDate;
    if (!isEmpty(endDate)) query.end_date = endDate;
    if (isEmpty(query)) return; // query empty
    setQuery((e) => ({ ...e, ...query }));
  }, [startDate, endDate]);

  const handleReset = useCallback(() => {
    setOpen(false);
    setStartDate("");
    setEndDate("");
    setQuery(({ start_date, end_date, ...e }) => e);
  }, []);

  return (
    <div>
      <div id={"filter-date-reports"}>
        <button
          className="btn btn-primary btn-sm font-weight-bolder dropdown-toggle px-5"
          onClick={() => setOpen(true)}
        >
          Filter by Date
        </button>
      </div>
      <Menu
        anchorEl={document.getElementById(`filter-date-reports`)}
        keepMounted={false}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            transform: `translateX(0px) translateY(24px)`,
          },
        }}
      >
        <div className="px-2">
          <div className="float-left" style={{ width: 300 }}>
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
                  onChange={(e) => setStartDate(e.target.value)}
                  defaultValue={query?.start_date}
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
                  onChange={(e) => setEndDate(e.target.value)}
                  defaultValue={query?.end_date}
                />
              </Col>
            </Form.Group>
            <div className="d-flex flex-row my-3 justify-content-end">
              <button
                type="button"
                className="mx-1 float-left btn btn-sm btn-primary"
                onClick={handleSubmit}
              >
                <FormattedMessage id="TITLE.UPDATE" />
              </button>
              <button
                type="button"
                className="ml-1 float-right btn btn-sm btn-light d-flex"
                onClick={handleReset}
              >
                <i className="fas fa-redo fa-right py-1 mx-1"></i>
                <span>
                  <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default FilterDate;
