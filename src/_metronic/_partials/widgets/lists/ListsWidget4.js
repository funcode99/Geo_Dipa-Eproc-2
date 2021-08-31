/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Dropdown } from "react-bootstrap";
import { DropdownCustomToggler, DropdownMenu1 } from "../../dropdowns";
import { getTodoByUser } from "../_redux/WidgetCrud";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import useToast from "../../../../app/components/toast";
import Skeleton from "@material-ui/lab/Skeleton";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

function ListsWidget4({ className, intl }) {
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const [Toast, setToast] = useToast();
  const [dataTodo, setDataTodo] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const callApiTodo = () => {
    setLoading(true);
    getTodoByUser(user_id)
      .then((result) => {
        console.log("result", result);
        setLoading(false);
        setDataTodo(result.data.data);
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };
  React.useEffect(callApiTodo, []);

  const getColor = () => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };
  return (
    <>
      <Toast />
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">Your Todo</h3>
          <div className="card-toolbar">
            {/* <Dropdown className="dropdown-inline" drop="down" alignRight>
                <Dropdown.Toggle
                  id="dropdown-toggle-top2"
                  variant="transparent"
                  className="btn btn-light btn-sm font-size-sm font-weight-bolder dropdown-toggle text-dark-75">
                  Create
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                  <DropdownMenu2 />
                </Dropdown.Menu>
              </Dropdown> */}
          </div>
        </div>
        {/* Body */}
        <div className="card-body pt-2">
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll pr-7 mr-n7"
            style={{
              maxHeight: "calc(100% - 25px)",
              position: "relative",
            }}
          >
            {loading ? (
              <div className="d-flex align-items-center mb-10">
                <div className="w-100">
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                </div>
              </div>
            ) : (
              dataTodo.map((item, index) => {
                var bgColor = getColor();
                return (
                  <div
                    className="d-flex align-items-center mb-10"
                    key={index.toString()}
                  >
                    <span
                      className="bullet bullet-bar align-self-stretch"
                      style={{ backgroundColor: `#${bgColor}` }}
                    ></span>

                    <label className="checkbox checkbox-lg checkbox-light-success checkbox-single flex-shrink-0 m-0 mx-4">
                      <input
                        type="checkbox"
                        name=""
                        onChange={() => {}}
                        value="1"
                        checked
                      />
                      <span style={{ backgroundColor: `#${bgColor}` }}></span>
                    </label>

                    <div className="d-flex flex-column flex-grow-1">
                      <Link
                        to={
                          "/client/invoice_monitoring/contract/" +
                          item.contract_id +
                          "/" +
                          item.term_id
                        }
                        className="text-dark-75 text-hover-primary font-weight-bold font-size-sm mb-1"
                      >
                        {item.todo_name}
                      </Link>
                      <span className="text-danger font-weight-bold font-size-sm">
                        {`${item.contract_no}(${item.vendor_name})`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* <div className="d-flex align-items-center mb-10">
            <span className="bullet bullet-bar bg-primary align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-primary checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" onChange={() => {}} value="1" />
              <span></span>
            </label>

            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1"
              >
                Stakeholder Meeting
              </a>
              <span className="text-muted font-weight-bold">Due in 3 Days</span>
            </div>
            <ItemDropdown item="" />
          </div>

          <div className="d-flex align-items-center mb-10">
            <span className="bullet bullet-bar bg-warning align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-warning checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" value="1" onChange={() => {}} />
              <span></span>
            </label>

            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-size-sm font-weight-bold font-size-lg mb-1"
              >
                Scoping & Estimations
              </a>
              <span className="text-muted font-weight-bold">Due in 5 Days</span>
            </div>
            <ItemDropdown item="" />
          </div>

          <div className="d-flex align-items-center mb-10">
            <span className="bullet bullet-bar bg-info align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-info checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" value="1" onChange={() => {}} />
              <span></span>
            </label>

            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1"
              >
                Sprint Showcase
              </a>
              <span className="text-muted font-weight-bold">Due in 1 Day</span>
            </div>
            <ItemDropdown item="" />
          </div>

          <div className="d-flex align-items-center mb-2">
            <span className="bullet bullet-bar bg-danger align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-danger checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" value="1" onChange={() => {}} />
              <span></span>
            </label>
            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1"
              >
                Project Retro
              </a>
              <span className="text-muted font-weight-bold">
                Due in 12 Days
              </span>
            </div>
            <ItemDropdown item="" />
          </div> */}
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
}
export default injectIntl(connect(null, null)(ListsWidget4));

const ItemDropdown = ({ item }) => {
  return (
    <>
      <Dropdown className="dropdown-inline" alignRight>
        <Dropdown.Toggle
          variant="transparent"
          id="dropdown-toggle-top"
          className="btn btn-hover-light-primary btn-sm btn-icon"
          as={DropdownCustomToggler}
        >
          <i className="ki ki-bold-more-hor" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
          <DropdownMenu1 />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
