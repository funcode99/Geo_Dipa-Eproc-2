// import React from 'react';
import styled from 'styled-components';
import { Icon, Modal } from '@material-ui/core';

export const Container = styled.section`
  position: relative;
  border-radius: 1.25rem;
  padding: 2.15rem 1.5rem 2rem;
  min-width: 70vw;
  text-align: ${(props) => props.align};
  background: #fff;
  // display: flex;
  // justify-content: center;
`;

export const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
`;
export const ColumnRow = styled.div`
  width: 100%;
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
`;
