import test from 'ava';
import Helpers from '../src/utils/Helpers';

test('Has Manifest props', t => {
    const manifest = require('../plugin/manifest.json');
    const hasProps = ['manifest_version', 'name', 'description', 'version', 'icons', 'permissions'].reduce((canPass, prop) => {
        if (!manifest.hasOwnProperty(prop)) {
            return false;
        } else {
            return canPass;
        }
    }, true);

    hasProps ? t.pass() : t.fail();
});

test('Unique ids', t => {
    const totalArrayLength = 200;
    const ids = Array.from({ length: totalArrayLength }, _ => Helpers.genId());
    const filteredIds = ids.filter((id, i) => ids.indexOf(id) == i);
    filteredIds.length === totalArrayLength ? t.pass() : t.fail();
});
