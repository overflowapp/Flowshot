import * as chrome from 'sinon-chrome';
import * as cuid from 'cuid';
import { SessionStatus, RequestType } from '../../types';
import { SessionStarted, SessionStopped, SessionDiscarded } from '../../components';
import FileManager from '../FileManager';

describe('File Manager', function() {
    it('should have a slug cuid title', function() {
        const s1 = FileManager.structure;

        expect(cuid.isSlug(s1.title.split('-').pop())).toEqual(true);
    });

    it('should retrieve a unique structure each time', function() {
        const s1 = FileManager.structure;
        const s2 = FileManager.structure;

        expect(s1.title).not.toEqual(s2.title);
        expect(s1.date).toEqual(s2.date);
    });
});
