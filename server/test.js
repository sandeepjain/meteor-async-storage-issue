import { AsyncLocalStorage } from 'node:async_hooks';

export function hereItStarts() {
    const asyncLocalStorage = new AsyncLocalStorage();

    function logWithId(msg) {
      const id = asyncLocalStorage.getStore();
      console.log(`${id !== undefined ? id : '-'}:`, msg);
    }

    asyncLocalStorage.run(1, () => {
      logWithId('start');
      // Imagine any chain of async operations here
      setImmediate(() => {
        logWithId('finish');
      });
    });
}
