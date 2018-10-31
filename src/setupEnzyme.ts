import { configure } from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';
import * as chrome from 'sinon-chrome/extensions';

configure({ adapter: new EnzymeAdapter() });

(global as any).chrome = chrome;
