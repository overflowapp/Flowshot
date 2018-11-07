import EventBus from '../EventBus';

export interface Screenshot {
    title: string;
    date: number;
    dataURI: string;
    bounds: {
        h: number;
        w: number;
    };
}

declare global {
    interface Window {
        FlowshotEvents: EventBus;
    }
}
