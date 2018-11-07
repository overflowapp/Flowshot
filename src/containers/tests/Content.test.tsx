import * as React from 'react';
import { shallow, mount } from 'enzyme';
import * as chrome from 'sinon-chrome';
import Content from '../Content';
import { RequestType } from '../../types';
import { SessionStarted, SessionStopped, SessionDiscarded } from '../../components';
import Background from '../../scripts/Background';
import { SessionState } from '../../types/types';

describe('Content', function() {
    const MountedContent = mount(<Content />);

    it('should have a stopped session status', function() {
        expect(MountedContent.state('status')).toBe(SessionState.stopped);
        expect(MountedContent.find(SessionStopped).length).toBe(1);
    });

    it('should render single component dependent on status', function() {
        MountedContent.setState({ status: SessionState.started });
        expect(MountedContent.find(SessionStarted).length).toBe(1);

        MountedContent.setState({ status: SessionState.stopped });
        expect(MountedContent.find(SessionStopped).length).toBe(1);

        MountedContent.setState({ status: SessionState.discarded });
        expect(MountedContent.find(SessionDiscarded).length).toBe(1);
    });

    it('should have no screenshots', function() {
        expect((MountedContent.state('screenshots') as []).length).toBe(0);
    });

    it.skip('should update recording state', function() {
        (MountedContent.instance() as Content).setRecordingState(SessionState.started);
        expect(MountedContent.state('status')).toBe(SessionState.started);
    });

    it('pass snapshot', function() {
        expect(MountedContent).toMatchSnapshot();
    });
});

describe('Content Chrome', function() {
    const MountedContent = mount(<Content />);
    const type = RequestType.NEW_IMAGE;
    const payload = {
        dataURI: 'some-data-uri',
        dimensions: {
            w: 100,
            h: 100,
        },
    };

    beforeEach(function() {
        chrome.runtime.sendMessage.flush();
        chrome.flush();
    });

    it('should retrieve message from Background', function() {
        expect(chrome.runtime.sendMessage.notCalled).toBe(true);
        expect(chrome.runtime.onMessage.addListener.notCalled).toBe(true);

        Background.sendToPopup(type, payload);

        expect(chrome.runtime.sendMessage.calledOnceWithExactly({ type, payload })).toBe(true);

        (MountedContent.instance() as Content).listen();

        expect(chrome.runtime.onMessage.addListener.calledOnce).toBe(true);

        chrome.runtime.onMessage.dispatch({ type, payload });

        expect((MountedContent.state('screenshots') as []).length).toBe(1);
        expect(((MountedContent.state('screenshots') as []).pop() as any).bounds).toEqual(payload.dimensions);
    });

    it('should pull state from local storage', function() {
        chrome.storage.local.get.withArgs(['recordingState']).yields({ recordingState: SessionState.started });

        (MountedContent.instance() as Content).setFromLocalState();
        expect(MountedContent.state('status')).toBe(SessionState.started);
    });

    it('should not set state if local storage empty', function() {
        const initialStatus = MountedContent.state('status');

        chrome.storage.local.get.withArgs(['recordingState']).yields({ recordingState: undefined });

        (MountedContent.instance() as Content).setFromLocalState();
        expect(MountedContent.state('status')).toBe(initialStatus);
    });
});
