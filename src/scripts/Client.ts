import EventBus from '../EventBus';
import { SessionState, ClickData } from '../types/types';

class Client {
    constructor() {
        if (!window.FlowshotEvents) {
            console.debug = console.debug.bind(null, '%c Flowshot Client:', 'font-weight: bold; color: #ffcc00');
            window.FlowshotEvents = new EventBus();
            console.debug('Set EventBus');
        }

        console.debug('Script injected');

        this.attachMessageListeners();
        this.runStatus();
    }

    runStatus() {
        chrome.storage.local.get(['recordingState'], result => {
            const state = result.recordingState as SessionState;

            if (state === SessionState.started) {
                this.handleMessage({ startRecording: true });
            }
        });
    }

    attachMessageListeners() {
        window.FlowshotEvents.remove('fs-request.flowshot');
        window.FlowshotEvents.add('fs-request.flowshot', (event: CustomEvent) => this.handleMessage(event.detail));
    }

    handleMessage(payload: any) {
        console.log('Got payload', payload);
        switch (true) {
            case payload.startRecording:
                console.debug('Started recording');
                this.attachClickListener();
                break;
            case payload.stopRecording:
                console.debug('Stopped recording');
                this.detachClickListener();
                break;
        }
    }

    detachClickListener() {
        window.FlowshotEvents.remove('click.flowshot');
    }

    attachClickListener() {
        this.detachClickListener();
        window.FlowshotEvents.add('click.flowshot', this.onClick);
    }

    onClick(e: MouseEvent) {
        const path = (e as any).path;
        const srcElement = path ? path.find(e => ['button', 'a'].includes(e.type)) : e.srcElement;
        const style = srcElement.getBoundingClientRect();

        document.dispatchEvent(
            new CustomEvent('fs-request', {
                detail: {
                    click: true,
                    payload: {
                        pageX: e.pageX,
                        pageY: e.pageY,
                        screenX: e.screenX,
                        screenY: e.screenY,
                        clientX: e.clientX,
                        clientY: e.clientY,
                        boundingRect: {
                            x: style.left,
                            y: style.top,
                            h: style.height,
                            w: style.width,
                        },
                    },
                } as ClickData,
            })
        );
    }
}

new Client();
