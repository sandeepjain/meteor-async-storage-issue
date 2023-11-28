/* eslint-disable */
import { Module } from 'module';

const moduleLoadOriginal = Module._load;

const mockedAsyncLocalStorage = {
    AsyncLocalStorage: class AsyncLocalStorage {
        run(
            _store,
            callback,
            ...args
        ) {
            console.log('Calling mocked AsyncLocalStorage.run()');
            return callback(...args);
        }

        getStore() {
            console.log('Calling mocked AsyncLocalStorage.getStore()');
            return {};
        }

        // Other methods below should not be called by the Temporal client package

        disable() {
            /* noop */
        }

        exit(
            callback,
            ...args
        ) {
            return callback(...args);
        }

        enterWith(_store) {
            /* noop */
        }
    },
};

Module._load = function (uri, parent) {
    if (uri === 'node:async_hooks' || uri === 'async_hooks') {
        console.log(`async_hooks requested from ${uri}`);
        console.log('parent filename', parent.filename);
        if (
            parent?.filename?.endsWith('@temporalio/client/lib/connection.js')
        ) {
            return mockedAsyncLocalStorage;
        }
    }

    return moduleLoadOriginal(uri, parent);
};

export * from './test.js';

// (Module as any)._load = moduleLoadOriginal;
/* eslint-enable */

