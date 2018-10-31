import 'jsdom-global/register';
import test from 'ava';
import * as React from 'react';
import { shallow, mount, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as render from 'react-test-renderer';
import Content from '../src/components/Content';

configure({ adapter: new Adapter() });

test('Initially not recording', t => {
    const content = shallow(React.createElement(Content));
    t.is(content.state('recording'), false);
});

test('Content component', t => {
    const content = mount(React.createElement(Content));
    const fooInner = content.find('p');
    t.is(fooInner.is('p'), true);
});

test('Content component snapshot', t => {
    const tree = render.create(React.createElement(Content)).toJSON();
    t.snapshot(tree);
});
