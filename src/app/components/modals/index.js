import React from 'react';
// import { Icon } from '@material-ui/core';
import { Container, CustomModal, StyledIcon } from './style';

export const StyledModal = ({
  visible,
  onClose,
  hideCloseIcon = false,
  disableBackdrop = false,
  align = '',
  children,
  minWidth,
}) => {
  return (
    <CustomModal
      open={visible}
      onClose={onClose}
      disableBackdropClick={disableBackdrop}
    >
      <Container align={align} minWidth={minWidth}>
        {hideCloseIcon ? null : (
          <StyledIcon className="fas fa-times" onClick={onClose} />
        )}
        {children}
      </Container>
    </CustomModal>
  );
};
