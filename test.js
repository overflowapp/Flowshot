import test from 'ava';

test('Async pass', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});
