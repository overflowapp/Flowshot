import * as React from 'react';
import { shallow } from 'enzyme';
import { SessionStarted, SessionStopped, SessionDiscarded } from '..';
import { SessionStatus } from '../../types';

describe('Session status', function() {
    it('should handle session change on click', function() {
        let status = SessionStatus.stopped;

        const setStatus = (s: SessionStatus) => (status = s);
        const props = { setRecordingState: setStatus };

        const MountedSessionStopped = shallow(<SessionStopped {...props} />);
        MountedSessionStopped.find('a.button').simulate('click');
        expect(status).toBe(SessionStatus.started);

        const MountedSessionStarted = shallow(<SessionStarted {...props} />);
        MountedSessionStarted.find('a.button')
            .first()
            .simulate('click');
        expect(status).toBe(SessionStatus.discarded);
        MountedSessionStarted.find('a.button')
            .last()
            .simulate('click');
        expect(status).toBe(SessionStatus.stopped);

        const MountedSessionDiscarded = shallow(<SessionDiscarded {...props} />);
        MountedSessionDiscarded.find('a.button').simulate('click');
        expect(status).toBe(SessionStatus.stopped);
    });
});
