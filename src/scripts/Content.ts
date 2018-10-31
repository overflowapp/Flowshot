import { SessionStatus } from '../types';

class Content {
    static runStatus() {
        chrome.storage.local.get(['recordingState'], result => {
            const state = result.recordingState as SessionStatus;

            if (state === SessionStatus.started) {
                this.startRecording();
            }
        });
    }

    static listenToRequest() {
        console.log('Listening to runtime');

        chrome.runtime.onMessage.removeListener(Content.handleRequest);
        chrome.runtime.onMessage.addListener(Content.handleRequest);

        this.runStatus();
    }

    static handleRequest(request: any, sender: chrome.runtime.MessageSender, respond: any) {
        console.log('Handling request', request);

        switch (true) {
            case request.changeRecordingState && request.recordingState === SessionStatus.started:
                Content.startRecording();
                break;
            case request.changeRecordingState && request.recordingState === SessionStatus.stopped:
                Content.stopRecording();
                break;
        }
    }

    static startRecording() {
        console.log('Starting recording');

        document.dispatchEvent(
            new CustomEvent('fs-request', {
                detail: { startRecording: true },
            })
        );

        document.removeEventListener('fs-request', Content.handleMessage);
        document.addEventListener('fs-request', Content.handleMessage);
    }

    static stopRecording() {
        console.log('Stopping recording');
        document.dispatchEvent(
            new CustomEvent('fs-request', {
                detail: { stopRecording: true },
            })
        );
    }

    static handleMessage(event: CustomEvent) {
        console.log('Handling message', event);

        switch (true) {
            case event.detail.click:
                Content.sendToBackground(event.detail);
                break;
        }
    }

    static sendToBackground(payload: any) {
        chrome.runtime.sendMessage(payload);
    }
}