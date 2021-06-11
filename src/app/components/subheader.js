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
  text = "",
  IconComponent = <BookmarkBorderOutlined style={{ color: "white" }} />,
}) => {
  return (
    <div className="d-flex align-items-center flex-wrap mr-1">
      <SubWrap className="mr-2 iconWrap">
        <span className="svg-icon menu-icon">
          {IconComponent ? IconComponent : null}
        </span>
      </SubWrap>
      <div className="d-flex align-items-baseline mr-5">
        <h2 className="text-dark font-weight-bold my-2 mr-5">{text}</h2>
      </div>
    </div>
  );
};

export default StyledSubheader;
