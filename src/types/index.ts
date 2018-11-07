import EventBus from '../EventBus';
import { SessionState } from './types';

export interface Screenshot {
    title: string;
    date: number;
    dataURI: string;
    bounds: {
        h: number;
        w: number;
    };
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
    status: SessionState;
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

declare global {
    interface Window {
        FlowshotEvents: EventBus;
    }
}
