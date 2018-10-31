import EventBus from '../src/EventBus';

export interface Session {
    date: number;
    data: SessionData[];
}

export interface SessionData {
    date: number;
    screen: {
        tab: string;
        dataURI: string;
        dimensions: {
            w: number;
            h: number;
        };
    };
    click: {
        pageX: number;
        pageY: number;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number;
        boundingRect: {
            x: number;
            y: number;
            h: number;
            w: number;
        };
    };
}

export interface Recording {
    status: RecordingStatus;
    events: RecordingEvent[];
}

export interface RecordingEvent {
    tab: string;
    image: string;
    bounds: {
        pageX: number;
        pageY: number;
        clientX: number;
        clientY: number;
    };
}

export enum RecordingStatus {
    'stopped' = 0,
    'started' = 1,
    'discarded' = 2,
}

export enum ChromeTabStatus {
    'loading' = 'loading',
    'complete' = 'complete',
}

declare global {
    interface Window {
        FlowshotEvents: EventBus;
    }
}
