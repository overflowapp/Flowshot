import * as cuid from 'cuid';
import FileManager from '../FileManager';
import Flow from '../../../Flow/src/typings/Flow';
import { SHOTS } from '../../tests/fauxData';

describe('File Manager', function() {
    const shotsLength = SHOTS.length;
    const struct: Flow.File = FileManager.buildFile(SHOTS);

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

    it('should build a flow file from shots', function() {
        expect(struct.document.type).toBe(Flow.Type.Document);
        expect(struct.document.children[0].children.length).toEqual(shotsLength);
    });

    it('should have screen ids that are cuids', function() {
        expect(struct.document.children[0].children.every(e => cuid.isCuid(e.id))).toBeTruthy();
    });

    it('should have no layers if its the last shot', function() {
        const screens = struct.document.children[0].children as Flow.Screen[];
        expect(SHOTS[SHOTS.length - 1].event).toEqual(null);
        expect(screens[screens.length - 1].children.length).toEqual(0);
    });

    it('should have a connection to the next screen from previous layer', function() {
        const screens = struct.document.children[0].children as Flow.Screen[];
        expect(SHOTS[0].event).not.toEqual(null);
        expect(screens[0].children[0].connections[0].nodeID).toEqual(screens[1].id);
    });

    it('should have screens with layers that are of type hotspot', function() {
        const screens = struct.document.children[0].children as Flow.Screen[];
        expect(screens[0].children[0].type).toEqual(Flow.Type.Hotspot);
    });
});
