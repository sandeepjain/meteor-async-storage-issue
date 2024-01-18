/* eslint-disable */
const { Module } = require("module");

const moduleLoadOriginal = Module._load;

const mockedAsyncLocalStorage = {
  AsyncLocalStorage: class AsyncLocalStorage {
    run(_store, callback, ...args) {
      return callback(...args);
    }
    getStore() {
      return {};
    }
    // Other methods below should not be called by the Temporal client package
    disable() {
      /* noop */
    }
    exit(callback, ...args) {
      return callback(...args);
    }
    enterWith(_store) {
      /* noop */
    }
  },
};

Module._load = function (uri, parent) {
  if (uri === "node:async_hooks" || uri === "async_hooks") {
    if (parent?.filename?.endsWith("@temporalio/client/lib/connection.js")) {
      return mockedAsyncLocalStorage;
    }
  }

  return moduleLoadOriginal(uri, parent);
};

module.exports = require("./test.js");
