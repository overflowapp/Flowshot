import * as cuid from 'cuid';
import FileManager from '../FileManager';
import Flow from '../../../Flow/src/typings/Flow';

describe('File Manager', function() {
    it('should have a cuid title', function() {
        const f1 = FileManager.flowStructure;

        expect(cuid.isCuid(f1.document.id)).toEqual(true);
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
