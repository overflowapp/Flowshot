import { Shot } from '../types/types';

export const TAB_QUERY_ARGS = {
    active: true,
    currentWindow: true,
};

export const TAB_QUERY_YIELD = [
    {
        active: true,
        audible: false,
        autoDiscardable: true,
        discarded: false,
        favIconUrl: 'https://assets-cdn.github.com/favicon.ico',
        height: 1269,
        highlighted: true,
        id: 218904244,
        incognito: false,
        index: 3,
        mutedInfo: {
            muted: false,
        },
        pinned: false,
        selected: true,
        status: 'complete',
        title: 'Options',
        url: 'https://github.com/overflowapp/Flowshot/settings',
        width: 1621,
        windowId: 218904119,
    } as chrome.tabs.Tab,
];

export const PIXEL_URI =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAA/wEEAQB5fl4xAAAAAElFTkSuQmCC';

export const SHOTS: Shot[] = [
    {
        date: 1541601270607,
        tab: {
            title: 'Topics | somewhere.io',
            size: { h: 2538, w: 3242 },
            dataURI: PIXEL_URI,
        },
        event: {
            click: true,
            payload: {
                pageX: 300,
                pageY: 60,
                screenX: 350,
                screenY: 150,
                clientX: 300,
                clientY: 62,
                boundingRect: { x: 300, y: 50, h: 20, w: 80 },
            },
        },
    },
    {
        date: 1541601277108,
        tab: {
            title: 'Developers | somewhere.io',
            size: { h: 2538, w: 3242 },
            dataURI: PIXEL_URI,
        },
        event: null,
    },
];
