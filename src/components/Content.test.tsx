import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Content from './Content';
import { SessionStatus } from '../../types';

describe('Content', function() {
    it('should have a stopped session status', function() {
        expect(shallow(<Content />).state('status')).toBe(SessionStatus.stopped);
    });

    it('should have no screenshots', function() {
        expect((shallow(<Content />).state('screenshots') as []).length).toBe(0);
    });

    it('should have a paragraph', function() {
        expect(mount(<Content />).find('p').length).toBe(1);
    });

    it('pass snapshot', function() {
        const tree = shallow(<Content />);
        expect(tree).toMatchSnapshot();
    });
});
