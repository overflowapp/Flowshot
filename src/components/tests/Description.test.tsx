import * as React from 'react';
import { shallow } from 'enzyme';
import Description from '../Description';

describe('Description', function() {
    const props = {
        title: 'Begin session',
        titleClass: 'begin',
        content: 'Start off your session',
    };
    const MountedDescription = shallow(<Description {...props} />);

    it('should render heading', function() {
        expect(MountedDescription.find('h2').exists()).toBe(true);
        expect(MountedDescription.find('h2').hasClass(props.titleClass)).toBe(true);
        expect(MountedDescription.find('h2').text()).toBe(props.title);
    });

    it('should render text', function() {
        expect(MountedDescription.find('p').exists()).toBe(true);
        expect(MountedDescription.find('p').text()).toBe(props.content);
    });

    it('pass snapshot', function() {
        expect(MountedDescription).toMatchSnapshot();
    });
});
