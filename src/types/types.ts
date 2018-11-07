export interface ClickData {
    click: boolean;
    payload: {
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

export interface TabShot {
    title: string;
    dataURI: string;
    size: Size;
}

export interface Shot {
    date: number;
    tab: TabShot;
    event: ClickData;
}

export interface Size {
    h: number;
    w: number;
}

export interface Session {
    date: number;
    shots: Shot[];
}

export enum ChromeTabStatus {
    'loading' = 'loading',
    'complete' = 'complete',
}

export enum SessionState {
    'stopped' = 0,
    'started' = 1,
    'discarded' = 2,
}
