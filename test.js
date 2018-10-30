import test from 'ava';

test('Has Manifest props', t => {
    const manifest = require('./plugin/manifest.json');
    const hasProps = ['manifest_version', 'name', 'description', 'version', 'icons', 'permissions'].reduce((canPass, prop) => {
        if (!manifest.hasOwnProperty(prop)) {
            return false;
        } else {
            return canPass;
        }
    }, true);

    hasProps ? t.pass() : t.fail();
});
