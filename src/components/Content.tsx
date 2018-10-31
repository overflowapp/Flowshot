import * as React from 'react';

interface AppProps {}

interface AppState {
    recording: boolean;
}

export default class Content extends React.Component<AppProps, AppState> {
    state = {
        recording: false,
    };

    render() {
        return <p>Flowshot popup</p>;
    }
}
