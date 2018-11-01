import { configure } from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';
import * as chrome from 'sinon-chrome/extensions';

declare global {
    namespace NodeJS {
        interface Global {
            chrome: chrome;
        }
    }
}

configure({ adapter: new EnzymeAdapter() });

global.chrome = chrome;
