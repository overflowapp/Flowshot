import * as React from 'react';
import { SessionStatus, Screenshot, RequestType } from '../types';
import TabHelper from '../utils/TabHelper';
import { Actions, Description } from '../components';

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

    PopupContent = ({ sessionStatus }: { sessionStatus: SessionStatus }) => {
        switch (true) {
            case sessionStatus === SessionStatus.started:
                return (
                    <React.Fragment>
                        <Description
                            title="Recording..."
                            titleClass="red@text"
                            content="Your session is now being recorded. Clicks and websites visited are now tracked until the end of the session."
                        />
                        <Actions>
                            <a className="button red flex-grow" onClick={() => this.setRecordingState(SessionStatus.discarded)}>
                                Discard
                            </a>
                            <a className="ml4 button black flex-grow" onClick={() => this.setRecordingState(SessionStatus.stopped)}>
                                Build your flow...
                            </a>
                        </Actions>
                    </React.Fragment>
                );
                break;
            case sessionStatus === SessionStatus.stopped:
                return (
                    <React.Fragment>
                        <Description
                            title="Let's get started."
                            content="Start off your session and continue browsing the web. When done, end your session and download your Overflow file."
                        />
                        <Actions>
                            <a className="button green flex-grow" onClick={() => this.setRecordingState(SessionStatus.started)}>
                                Begin new session
                            </a>
                        </Actions>
                    </React.Fragment>
                );
                break;
            case sessionStatus === SessionStatus.discarded:
                return (
                    <React.Fragment>
                        <Description
                            title="Session discarded."
                            content="The session has been discarded. Click &amp; website tracked has stopped until a new session has been initiated."
                        />
                        <Actions>
                            <a className="button black flex-grow" onClick={() => this.setRecordingState(SessionStatus.stopped)}>
                                Start Over
                            </a>
                        </Actions>
                    </React.Fragment>
                );
                break;
        }
    };

    render() {
        const { screenshots, status } = this.state;

        return (
            <React.Fragment>
                <this.PopupContent sessionStatus={status} />
                {screenshots.map(s => (
                    <img key={s.date} height={140} src={s.dataURI} />
                ))}
            </React.Fragment>
        );
    }
}
