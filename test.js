import test from 'ava';
import React from 'react';
import render from 'react-test-renderer';
import Content from './src/components/Content.tsx';

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

test('Content component', t => {
    const tree = render.create(<Content />).toJSON();
    t.snapshot(tree);
});
