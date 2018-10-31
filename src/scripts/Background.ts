import FileManager from './FileManager';
import { SessionData, ChromeTabStatus, SessionStatus, Session } from '../../types';
import TabHelper from '../utils/TabHelper';

class Background {
    public static currentSession: Session;

    private static get baseSession(): Session {
        return {
            date: Date.now(),
            data: [],
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
        FileManager.zipFiles(Background.currentSession.data);
    }

    public static handleSessionChange(state: SessionStatus) {
        console.log('Handling session change');
        switch (true) {
            case state === SessionStatus.started:
                Background.newSession();
                break;
            case state === SessionStatus.stopped:
                Background.endSession();
                break;
        }
    }

    static saveEvent(clickEvent: SessionData['click']) {
        Background.captureCurrentTab().then(payload => {
            const sessionData: SessionData = {
                date: Date.now(),
                screen: payload,
                click: clickEvent,
            };

            Background.currentSession.data.push(sessionData);
            Background.sendToPopup('newImage', payload);
        });
    }

    static sendToPopup(type: string, payload: any) {
        chrome.runtime.sendMessage({ type, payload });
    }

    private static captureCurrentTab(): Promise<SessionData['screen']> {
        return new Promise(resolve => {
            chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, dataURI => {
                if (!dataURI) return;

                const fauxImage = new Image();
                fauxImage.src = dataURI;
                fauxImage.onload = () => {
                    TabHelper.getCurrentTab().then(tab => {
                        resolve({
                            tab: tab.title,
                            dataURI,
                            dimensions: {
                                h: fauxImage.height,
                                w: fauxImage.width,
                            },
                        });
                    });
                };
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
            Background.saveEvent(request.payload);
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
        TabHelper.executeScript(tabId, { file: 'js/ .js' });
    }
});
