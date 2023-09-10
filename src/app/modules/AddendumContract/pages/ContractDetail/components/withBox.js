import React from "react";
import { Container, Form } from "react-bootstrap";

const withBox = (WrapperComponent) => {
  return class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      return (
        <Form className="my-3">
          <Container>
            <WrapperComponent {...this.props} />
          </Container>
        </Form>
      );
    }
  };
};

export default withBox;
