/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import { injectIntl } from "react-intl";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

const keys = {
  fetch: "get-data-gr",
};

const ToDoDM = (props) => {
  const { className, intl, user_id } = props;
  const [dataTodo, setDataTodo] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const callApiTodo = () => {
    // setLoading(true);
    // getTodoByUser(user_id)
    //   .then((result) => {
    //     setLoading(false);
    //     setDataTodo(result.data.data);
    //   })
    //   .catch((err) => {
    //     setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
    //   });
  };
  React.useEffect(callApiTodo, []);

  const getColor = () => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };
  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">
            Delivery Monitoring Todo
          </h3>
          <div className="card-toolbar"></div>
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
            {true ? (
              <div className="d-flex align-items-center mb-10">
                <div className="w-100">
                  {[1, 2, 3, 4, 5, 6, 7].map((el, id) => (
                    <div key={id} className="timeline-item align-items-start">
                      <Skeleton animation="wave" className="w-100" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              dataTodo?.map((item, index) => {
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
                        onClick={() => {
                          //   tabInvoice.tab = item.menu_tab || 0;
                          //   tabInvoice.tabInvoice = item.sub_menu_tab || 0;
                          //   props.set_data_tab_invaoice(tabInvoice);
                        }}
                      >
                        {item.todo_name}
                      </Link>
                      <span className="text-danger font-weight-bold font-size-sm">
                        {`${item.contract_no}-${item.termin_name}(${item.vendor_name})`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
};

const mapState = (state) => ({
  loading: getLoading(state, keys.fetch),
  status: state.auth.user.data.status,
  user_id: state.auth.user.data.user_id,
});

const mapDispatch = {
  fetch_api_sg,
};

export default injectIntl(connect(mapState, mapDispatch)(ToDoDM));
