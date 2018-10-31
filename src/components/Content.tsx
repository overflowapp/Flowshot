import * as React from 'react';
import { SessionStatus, Screenshot, RequestType } from '../types';

interface AppProps {}

interface AppState {
    status: SessionStatus;
    screenshots: Screenshot[];
}

export default class Content extends React.Component<AppProps, AppState> {
    state = {
        status: SessionStatus.stopped,
        screenshots: [],
    };

    componentWillMount() {
        this.listen();
    }

    componentDidMount() {
        chrome.runtime.sendMessage({ popupMounted: true });
        chrome.storage.local.get(['recordingState'], result => {
            result.recordingState &&
                this.setState({
                    status: result.recordingState as SessionStatus,
                });
        });
    }

    listen() {
        chrome.runtime.onMessage.addListener((request, sender, respond) => {
            switch (true) {
                case request.type === RequestType.NEW_IMAGE:
                    this.setState(prevState => ({
                        screenshots: [
                            ...prevState.screenshots,
                            {
                                title: 'any',
                                date: Date.now(),
                                dataURI: request.payload.dataURI,
                                bounds: { ...request.payload.dimensions },
                            },
                        ],
                    }));
                    break;
            }
        });
    }

    render() {
        return <p>Flowshot popup</p>;
    }
}
