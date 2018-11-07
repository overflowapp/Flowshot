import * as React from 'react';
import { shallow } from 'enzyme';
import { SessionStarted, SessionStopped, SessionDiscarded } from '..';
import { SessionState } from '../../types/types';

describe('Session status', function() {
    it('should handle session change on click', function() {
        let status = SessionState.stopped;

        const setStatus = (s: SessionState) => (status = s);
        const props = { setRecordingState: setStatus };

        const MountedSessionStopped = shallow(<SessionStopped {...props} />);
        MountedSessionStopped.find('a.button').simulate('click');
        expect(status).toBe(SessionState.started);

        const MountedSessionStarted = shallow(<SessionStarted {...props} />);
        MountedSessionStarted.find('a.button')
            .first()
            .simulate('click');
        expect(status).toBe(SessionState.discarded);
        MountedSessionStarted.find('a.button')
            .last()
            .simulate('click');
        expect(status).toBe(SessionState.stopped);

        const MountedSessionDiscarded = shallow(<SessionDiscarded {...props} />);
        MountedSessionDiscarded.find('a.button').simulate('click');
        expect(status).toBe(SessionState.stopped);
    });
});
