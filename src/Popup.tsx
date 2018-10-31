import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Content from './containers/Content';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
    ReactDOM.render(<Content />, document.getElementById('popup'));
});
