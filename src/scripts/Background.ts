import FileManager from './FileManager';
import TabHelper from '../utils/TabHelper';
import { Session, SessionState, TabShot, Shot, ClickData, ChromeTabStatus, RequestType } from '../types/types';

class Background {
    public static currentSession: Session;

    private static get baseSession(): Session {
        return {
            date: Date.now(),
            shots: [],
        };
    }

    private static newSession() {
        console.log('Session created');
        Background.currentSession = Background.baseSession;
    }

    private static endSession() {
        console.log('Session ended');
        console.log(Background.currentSession);
        Background.saveEvent(null);
        Background.saveSession();
    }

    private static saveSession() {
        FileManager.zipFiles(Background.currentSession.shots);
    }

    public static handleSessionChange(state: SessionState) {
        console.log('Handling session change');
        switch (true) {
            case state === SessionState.started:
                Background.newSession();
                break;
            case state === SessionState.stopped:
                Background.endSession();
                break;
        }
    }

    static saveEvent(clickEvent: ClickData) {
        console.log('saving event');

        Background.captureCurrentTab().then(payload => {
            const shot = {
                date: Date.now(),
                tab: payload,
                event: clickEvent,
            } as Shot;

            Background.currentSession.shots.push(shot);
            Background.sendToPopup(RequestType.NEW_IMAGE, payload);
        });
    }

    static sendToPopup(type: RequestType, payload: any) {
        chrome.runtime.sendMessage({ type, payload });
    }

    private static captureCurrentTab(): Promise<TabShot> {
        return new Promise(resolve => {
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, dataURI => {
                if (!dataURI) return;

                const fauxImage = new Image();
                fauxImage.src = dataURI;
                fauxImage.onload = () =>
                    TabHelper.getCurrentTab().then(tab => {
                        resolve({
                            title: tab.title,
                            dataURI,
                            size: {
                                h: fauxImage.height,
                                w: fauxImage.width,
                            },
                        });
                    });
            });
        });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Handling request - ', request);

    switch (true) {
        case request.popupMounted:
            console.log('Extension mounted');
            break;
        case request.capture:
            console.log('Capturing page');
            break;
        case request.click:
            Background.saveEvent(request as ClickData);
            break;
        case request.recordingState !== undefined:
            Background.handleSessionChange(request.recordingState);
            break;
    }

    return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tabs updating', tabId, changeInfo);

    if (changeInfo.status === ChromeTabStatus.complete) {
        console.log('Injecting script into', tab.title);
        TabHelper.executeScript(tabId, { file: 'js/client.js' });
    }
});

export default Background;
