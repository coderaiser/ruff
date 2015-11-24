'use strict';

let test    = require('tape');
let currify = require('currify');
let ruff    = require('..');

let add     = (a, b, fn) =>
    setTimeout(() => fn(null, a + b), 0);

let addy = currify(add);

test('call series of async functions', t => {
    ruff(function*() {
        let c = yield addy(1, 2);
        t.equal(c, 3, 'should return result in variable');
        t.end();
    });
});

test('call error listener', t => {
    let fn = cb => setTimeout(() => cb('hello'), 0);

    ruff(function*() {
        yield fn;
    }).on('error', error => {
        t.equal(error, 'hello', 'should emit error event');
        t.end();
    });
});

test('call end listener', t => {
    let fn = cb => setTimeout(() => cb(), 0);

    ruff(function*() {
        yield fn;
    }).on('end', () => {
        t.end();
    });
});
test('when no generetor', t => {
    t.throws(ruff, /generator could not be empty!/, 'should throw when generator empty');
    t.end();
});

test('when no generetor', t => {
    let fn = () => ruff(function*() {}, 'hi');
    t.throws(fn, /args should be array!/, 'should throw when arguments present and not array');
    t.end();
});
