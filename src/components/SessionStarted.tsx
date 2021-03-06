import * as React from 'react';
import { Actions, Description } from '.';
import { SessionState } from '../types/types';

interface Props {
    setRecordingState: (SessionStatus) => void;
}

const SessionStarted = ({ setRecordingState }: Props) => (
    <React.Fragment>
        <Description
            title="Recording..."
            titleClass="red@text"
            content="Your session is now being recorded. Clicks and websites visited are now tracked until the end of the session."
        />
        <Actions>
            <a className="button red flex-grow" onClick={() => setRecordingState(SessionState.discarded)}>
                Discard
            </a>
            <a className="ml4 button black flex-grow" onClick={() => setRecordingState(SessionState.stopped)}>
                Build your flow...
            </a>
        </Actions>
    </React.Fragment>
);

export default SessionStarted;
