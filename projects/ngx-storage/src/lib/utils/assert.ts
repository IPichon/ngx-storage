import { Inject } from '@angular/core';

class EnvConfig {
  constructor(@Inject('env') private env) {
    if (env.assert) {
      EnvConfig.assertEnable = env.assert;
    } else {
      EnvConfig.assertEnable = env.prod ? env.prod : false;
    }
  }
  static assertEnable;
}

const assertEnable = EnvConfig.assertEnable;

// tslint:disable-next-line only-arrow-functions
let _assertFn: IAssertFn = function() {
  initAssert(assertEnable);
  _assertFn.call({}, arguments);
};

export function assert(condition: any, message?: string) {
  _assertFn(condition, message);
}

export function initAssert(enable: boolean) {
  _assertFn = _makeAssertFn(enable);
}

type IAssertFn = (condition: any, message?: string) => void;

function _makeAssertFn(enableAsserts: boolean): IAssertFn {
  if (enableAsserts) {
    return (condition: any, message?: string) => {
      if (!condition) {
        // Create a new `Error`, which automatically gets `stack`
        const err = new Error(message || 'Assertion failed');
        err.stack = (err.stack || {}).toString();
        err.stack = err.stack.split('\n').splice(4).join('\n');
        /* tslint:disable no-debugger */
        // jshint -W087
        debugger;
        /* tslint:enable no-debugger */
        throw err;
      }
    };
  } else {
    return () => {
      // noop
    };
  }
}
