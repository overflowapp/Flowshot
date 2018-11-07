import * as chrome from 'sinon-chrome';
import * as cuid from 'cuid';
import FileManager from '../FileManager';
import Flow from '../../../Flow/src/typings/Flow';

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

    it('should get a Flow type structure', function() {
        const f1 = FileManager.flowStructure;

        expect(f1.document.type).toBe(Flow.Type.Document);
        expect(f1.document.children[0].type).toBe(Flow.Type.Page);
    });

    it('should retrieve a unique Flow structure each time', function() {
        const f1 = FileManager.flowStructure;
        const f2 = FileManager.flowStructure;

        expect(f1.document.id).not.toEqual(f2.document.id);
        expect(f1.document.children[0].id).not.toEqual(f2.document.children[0].id);
    });
});
