import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Content from './components/Content';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
    ReactDOM.render(<Content />, document.getElementById('popup'));
});
