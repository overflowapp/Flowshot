import * as React from 'react';
import { Actions, Description } from '.';
import { SessionStatus } from '../types';

interface Props {
    setRecordingState: (SessionStatus) => void;
}

const SessionStopped = ({ setRecordingState }: Props) => (
    <React.Fragment>
        <Description
            title="Let's get started."
            content="Start off your session and continue browsing the web. When done, end your session and download your Overflow file."
        />
        <Actions>
            <a className="button green flex-grow" onClick={() => setRecordingState(SessionStatus.started)}>
                Begin new session
            </a>
        </Actions>
    </React.Fragment>
);

export default SessionStopped;
