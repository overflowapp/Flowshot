import * as React from 'react';
import { shallow } from 'enzyme';
import Actions from '../Actions';

describe('Actions', function() {
    const props = {
        children: <a className="button">Begin new session</a>,
    };
    const MountedActions = shallow(<Actions {...props} />);

    it('should render button correctly', function() {
        expect(MountedActions.find('a').exists()).toBe(true);
        expect(MountedActions.find('a').hasClass('button')).toBe(true);
        expect(MountedActions.text()).toBe('Begin new session');
    });

    it('pass snapshot', function() {
        expect(MountedActions).toMatchSnapshot();
    });
});
