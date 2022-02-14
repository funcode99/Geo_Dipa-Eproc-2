import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import JoditEditor from "jodit-react";
import "./styles.scss";
const config = {
  readonly: false, // all options from https://xdsoft.net/jodit/doc/
};
const TextEditor = (props) => {
  const { intl, initialData = "", getData } = props;
  const editor = React.useRef(null);
  const [content, setContent] = React.useState(initialData);

  const initial = () => {
    setContent(initialData);
    getData(initialData);
  };

  React.useEffect(initial, [initialData]);

  return (
    <React.Fragment>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => {
          setContent(newContent);
          getData(newContent);
        }} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {}}
      />
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(TextEditor));
