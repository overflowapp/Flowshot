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

describe('Cuid', function() {
    it('should output only unique ids', function() {
        const totalArrayLength = 200;
        const ids = Array.from({ length: totalArrayLength }, _ => Helpers.genId());
        const filteredIds = ids.filter((id, i) => ids.indexOf(id) == i);
        expect(filteredIds.length).toBe(totalArrayLength);
    });
});
