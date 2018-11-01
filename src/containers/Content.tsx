import * as React from 'react';
import { SessionStatus, Screenshot, RequestType } from '../types';
import TabHelper from '../utils/TabHelper';
import { SessionStarted, SessionDiscarded, SessionStopped } from '../components';

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
        this.setFromLocalState();
    }

    setFromLocalState = () => {
        chrome.storage.local.get(['recordingState'], result => {
            result.recordingState &&
                this.setState({
                    status: result.recordingState as SessionStatus,
                });
        });
    };

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

    setRecordingState = (status: SessionStatus) => {
        TabHelper.getCurrentTab().then(tab => {
            chrome.tabs.sendMessage(tab.id, {
                changeRecordingState: true,
                recordingState: status === SessionStatus.started ? SessionStatus.started : SessionStatus.stopped,
            });

            chrome.storage.local.set({ recordingState: status });
            chrome.runtime.sendMessage({ recordingState: status });

            this.setState({
                status,
            });
        });
    };

    PopupContent = () => {
        switch (this.state.status) {
            case SessionStatus.started:
                return <SessionStarted setRecordingState={this.setRecordingState} />;
            case SessionStatus.stopped:
                return <SessionStopped setRecordingState={this.setRecordingState} />;
            case SessionStatus.discarded:
                return <SessionDiscarded setRecordingState={this.setRecordingState} />;
        }
    };

    render() {
        const { screenshots } = this.state;
        const SessionState = this.PopupContent;

        return (
            <React.Fragment>
                <SessionState />
                {screenshots.map(s => (
                    <img key={s.date} height={140} src={s.dataURI} />
                ))}
            </React.Fragment>
        );
    }
}
