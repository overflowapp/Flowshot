import * as React from 'react';
import { Actions, Description } from '.';
import { SessionState } from '../types/types';

interface Props {
    setRecordingState: (SessionStatus) => void;
}

const SessionDiscarded = ({ setRecordingState }: Props) => (
    <React.Fragment>
        <Description
            title="Session discarded."
            content="The session has been discarded. Click &amp; website tracked has stopped until a new session has been initiated."
        />
        <Actions>
            <a className="button black flex-grow" onClick={() => setRecordingState(SessionState.stopped)}>
                Start Over
            </a>
        </Actions>
    </React.Fragment>
);

export default SessionDiscarded;
