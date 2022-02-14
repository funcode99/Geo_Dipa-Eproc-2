import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
// import AccountInformation from "./AccountInformation";
// import { ProfileOverview } from "./ProfileOverview";
import ChangePassword from "./ChangePassword";
import PersonaInformation from "./PersonaInformation";
// import EmailSettings from "./EmailSettings";
import { ProfileCard } from "./components/ProfileCard";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

function UserProfilePage(props) {
  const { user } = useSelector((state) => state.auth);
  const { intl } = props;
  const suhbeader = useSubheader();
  suhbeader.setTitle(
    intl.formatMessage({
      id: "TITLE.MY_PROFILE",
    })
  );
  return (
    <div className="d-flex flex-row">
      <ProfileCard data={user}></ProfileCard>
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Redirect
            from="/client/user-profile"
            exact={true}
            to="/client/user-profile/personal-information"
          />
          {/* <Route
            path="/client/user-profile/profile-overview"
            component={ProfileOverview}
          /> */}
          {/* <Route
            path="/client/user-profile/account-information"
            component={AccountInformation}
          /> */}
          <Route
            path="/client/user-profile/change-password"
            component={ChangePassword}
          />
          {/* <Route
            path="/client/user-profile/email-settings"
            component={EmailSettings}
          /> */}
          <Route
            path="/client/user-profile/personal-information"
            component={PersonaInformation}
          />
        </Switch>
      </div>
    </div>
  );
}
export default injectIntl(connect(null, null)(UserProfilePage));
