import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Content from '../Content';
import { SessionStatus } from '../../types';

describe('Content', function() {
    const MountedContent = mount(<Content />);

    it('should have a stopped session status', function() {
        expect(MountedContent.state('status')).toBe(SessionStatus.stopped);
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
