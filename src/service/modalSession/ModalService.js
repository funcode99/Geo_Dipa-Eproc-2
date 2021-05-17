import React from 'react';
import ReactDOM from 'react-dom';
import ModalSession from './ModalSession';
import ModalCreate from './ModalCreate';

export const MODAL = {
    showSession(title, message, button) {
        const data = {title:title, message:message, button:button}
        ReactDOM.render(<ModalSession data={data} />, document.getElementById('modal-react'));
    },
    hide() {
        ReactDOM.unmountComponentAtNode(document.getElementById('modal-react'));
    },
    showCreate(title, body, button){
        const data = {title:title, body:body, button:button}
        ReactDOM.render(<ModalCreate data={data} />, document.getElementById('modal-react'));
    }
};