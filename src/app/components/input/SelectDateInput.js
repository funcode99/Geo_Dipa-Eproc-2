import React from "react";
import { FormattedMessage } from "react-intl";

const SelectDateInput = () => {
  return (
    <div className="col-md-6">
      <div className="form-group row">
        <label htmlFor="dateInvoice" className="col-sm-4 col-form-label">
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_DATE" />
        </label>
        <div className="col-sm-8">
          <input type="date" className="form-control" id="dateInvoice" />
        </div>
        {/* {(formik.touched.from_time && formik.errors.from_time) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.from_time}
                                        </span>
                                    ) : null} */}
      </div>
    </div>
  );
};

export default SelectDateInput;
