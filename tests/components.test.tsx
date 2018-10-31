import 'jsdom-global/register';
import test from 'ava';
import * as React from 'react';
import { shallow, mount, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as render from 'react-test-renderer';
import Content from '../src/components/Content';
import { SessionStatus } from '../types';
import '../src/chrome';

configure({ adapter: new Adapter() });

test('State: Is stopped', t => {
    const content = shallow(React.createElement(Content));
    t.is(content.state('status'), SessionStatus.stopped);
});

test('State: No initial screenshots', t => {
    const content = shallow(React.createElement(Content));
    t.is(content.state('screenshots').length, 0);
});

test('Content: Has p', t => {
    const content = mount(React.createElement(Content));
    const fooInner = content.find('p');
    t.is(fooInner.is('p'), true);
});

test('Content: Snapshot', t => {
    const tree = render.create(React.createElement(Content)).toJSON();
    t.snapshot(tree);
});
