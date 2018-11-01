import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Content from '../Content';
import { SessionStatus } from '../../types';
import { SessionStarted, SessionStopped, SessionDiscarded } from '../../components';

describe('Content', function() {
    const MountedContent = mount(<Content />);

    it('should have a stopped session status', function() {
        const sessionStateProps = {
            setRecordingState: (MountedContent.instance() as Content).setRecordingState,
        };
        expect(MountedContent.state('status')).toBe(SessionStatus.stopped);
        expect(MountedContent.find(SessionStopped).length).toBe(1);
    });

    it('should render single component dependent on status', function() {
        MountedContent.setState({ status: SessionStatus.started });
        expect(MountedContent.find(SessionStarted).length).toBe(1);

        MountedContent.setState({ status: SessionStatus.stopped });
        expect(MountedContent.find(SessionStopped).length).toBe(1);

        MountedContent.setState({ status: SessionStatus.discarded });
        expect(MountedContent.find(SessionDiscarded).length).toBe(1);
    });

    it('should have no screenshots', function() {
        expect((MountedContent.state('screenshots') as []).length).toBe(0);
    });

    it.skip('should update recording state', function() {
        (MountedContent.instance() as Content).setRecordingState(SessionStatus.started);

        expect(MountedContent.state('status')).toBe(SessionStatus.started);
    });

    it('pass snapshot', function() {
        expect(MountedContent).toMatchSnapshot();
    });
});
