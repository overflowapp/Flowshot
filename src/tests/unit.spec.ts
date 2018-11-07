import * as chrome from 'sinon-chrome';
import Helpers from '../utils/Helpers';
import TabHelper from '../utils/TabHelper';
import { TAB_QUERY_ARGS, TAB_QUERY_YIELD, PIXEL_URI } from './fauxData';
import { equal } from 'assert';

describe('Manifest', function() {
    it('should have required properties', function() {
        const manifest = require('../../plugin/manifest.json');
        const hasProps = ['manifest_version', 'name', 'description', 'version', 'icons', 'permissions'].reduce((canPass, prop) => {
            if (!manifest.hasOwnProperty(prop)) {
                return false;
            } else {
                return canPass;
            }
        }, true);

        expect(hasProps).toBe(true);
    });
});

describe('Helpers', function() {
    it('should convert png data to blob', function() {
        const blob = Helpers.uriToBlob(PIXEL_URI);
        expect(blob instanceof Blob).toBe(true);
    });
});

describe('Tab Helpers', function() {
    beforeEach(function() {
        chrome.tabs.sendMessage.flush();
        chrome.flush();
    });

    it('should return first current tab', async function() {
        chrome.tabs.query.withArgs(TAB_QUERY_ARGS).yields(TAB_QUERY_YIELD);

        expect(TabHelper.getCurrentTab()).resolves.toEqual(TAB_QUERY_YIELD[0]);

        const tab = await TabHelper.getCurrentTab();

        expect(tab.active).toBeTruthy();
        expect(tab.selected).toBeTruthy();
    });

    it('should send message to tabs', function() {
        expect(chrome.tabs.sendMessage.notCalled).toBe(true);
        TabHelper.sendMessage(TAB_QUERY_YIELD[0].id, 'Message', () => null);
        expect(chrome.tabs.sendMessage.calledOnce).toBe(true);
    });

    it('should send message to execute script', function() {
        expect(chrome.tabs.sendMessage.notCalled).toBe(true);

        TabHelper.executeOnCurrentTab('Message', () => null);

        expect(chrome.tabs.query.calledOnce).toBe(true);
        expect(TabHelper.sendMessage).not.toThrowError();
    });
});
