import Helpers from '../utils/Helpers';

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
    it('should output only unique ids', function() {
        const totalArrayLength = 200;
        const ids = Array.from({ length: totalArrayLength }, _ => Helpers.genId());
        const filteredIds = ids.filter((id, i) => ids.indexOf(id) == i);
        expect(filteredIds.length).toBe(totalArrayLength);
    });

    it('should convert png data to blob', function() {
        const pixelUri =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAA/wEEAQB5fl4xAAAAAElFTkSuQmCC';
        const blob = Helpers.uriToBlob(pixelUri);
        expect(blob instanceof Blob).toBe(true);
    });
});
