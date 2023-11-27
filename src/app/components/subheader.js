import React from "react";
import styled from "styled-components";
import { BookmarkBorderOutlined } from "@material-ui/icons";

export const SubWrap = styled.div`
  background: linear-gradient(
    90deg,
    rgba(111, 227, 255, 1) 0%,
    rgba(47, 199, 245, 1) 100%
  );
  padding: 5px;
  border-radius: 10px;
`;

// Note: please use icon from material-ui/icons or icon with component

const StyledSubheader = ({
  subText = "",
  text = "",
  IconComponent = <BookmarkBorderOutlined style={{ color: "white" }} />,
}) => {
  return (
    <div className="d-flex align-items-center mb-2">
      <SubWrap className="mr-2 iconWrap">
        <span className="svg-icon menu-icon">
          {IconComponent ? IconComponent : null}
        </span>
      </SubWrap>
      <div className="overflow-hidden flex-fill">
        <span className="text-truncate overflow-hidden">
          {subText}
        </span>
        <h2 className="font-weight-bold text-truncate overflow-hidden">
          {text}
        </h2>
      </div>
    </div>
  );
};

export default StyledSubheader;
