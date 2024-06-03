export enum WaitOnType {
  EVENT = 'event',
  TIMEOUT = 'timeout',
}

/**
 * @typedef {Object} WaitOnEventOrTimeoutParameters
 * @property {Object} target - The event target, can for example be:
 *   `window`, `document`, a DOM element, or an {EventBus} instance.
 * @property {string} name - The name of the event.
 * @property {number} delay - The delay, in milliseconds, after which the
 *   timeout occurs (if the event wasn't already dispatched).
 */
export type WaitOnEventOrTimeoutParameters<T = unknown> = {
  target: Window | Document | HTMLElement | EventBus<T>;
  name: string;
  delay?: number;
};

export type EventBusCallback<T> = (data: T) => void;

export type EventBusOptions = {
  external: boolean;
  once: boolean | undefined;
} | null;

export type ExtendedPromiseConstructor = PromiseConstructor & {
  withResolvers: () => {
    promise: Promise<WaitOnType>;
    resolve: (value: WaitOnType) => void;
    reject: (reason: unknown) => void;
  };
};

export type EventBusListener<T> = {
  listener: EventBusCallback<T>;
  external: boolean;
  once: boolean;
};

/**
 * Allows waiting for an event or a timeout, whichever occurs first.
 * Can be used to ensure that an action always occurs, even when an event
 * arrives late or not at all.
 *
 * @param {WaitOnEventOrTimeoutParameters}
 * @returns {Promise} A promise that is resolved with a {WaitOnType} value.
 */
export async function waitOnEventOrTimeout({
  target,
  name,
  delay = 0,
}: WaitOnEventOrTimeoutParameters) {
  if (
    typeof target !== 'object' ||
    !(name && typeof name === 'string') ||
    !(Number.isInteger(delay) && delay >= 0)
  ) {
    throw new Error('waitOnEventOrTimeout - invalid parameters.');
  }
  const { promise, resolve } = (
    Promise as ExtendedPromiseConstructor
  ).withResolvers();

  function handler(type: WaitOnType) {
    if (target instanceof EventBus) {
      target._off(name, eventHandler);
    } else {
      target.removeEventListener(name, eventHandler);
    }

    if (timeout) {
      clearTimeout(timeout);
    }
    resolve(type);
  }

  const eventHandler = handler.bind(null, WaitOnType.EVENT);
  if (target instanceof EventBus) {
    target._on(name, eventHandler);
  } else {
    target.addEventListener(name, eventHandler);
  }

  const timeoutHandler = handler.bind(null, WaitOnType.TIMEOUT);
  const timeout = setTimeout(timeoutHandler, delay);

  return promise;
}

/**
 * Simple event bus for an application. Listeners are attached using the `on`
 * and `off` methods. To raise an event, the `dispatch` method shall be used.
 */
export class EventBus<T> {
  private listeners = Object.create(null);

  /**
   * @param {string} eventName
   * @param {function} listener
   * @param {Object} [options]
   */
  on(
    eventName: string,
    listener: EventBusCallback<T>,
    options: EventBusOptions = null,
  ) {
    this._on(eventName, listener, {
      external: true,
      once: options?.once,
    });
  }

  /**
   * @param {string} eventName
   * @param {function} listener
   * @param {Object} [options]
   */
  off(
    eventName: string,
    listener: EventBusCallback<T>,
    options: EventBusOptions = null,
  ) {
    this._off(eventName, listener, {
      external: true,
      once: options?.once,
    });
  }

  /**
   * @param {string} eventName
   * @param {Object} data
   */
  dispatch(eventName: string, data: T) {
    const eventListeners = this.getMatchingListeners(eventName);

    if (!eventListeners || eventListeners.length === 0) {
      return;
    }
    let externalListeners;
    // Making copy of the listeners array in case if it will be modified
    // during dispatch.
    for (const { listener, external, once } of eventListeners.slice(0)) {
      if (once) {
        this._off(eventName, listener);
      }
      if (external) {
        (externalListeners ||= []).push(listener);
        continue;
      }
      listener(data);
    }
    // Dispatch any "external" listeners *after* the internal ones, to give the
    // viewer components time to handle events and update their state first.
    if (externalListeners) {
      for (const listener of externalListeners) {
        listener(data);
      }
      externalListeners = null;
    }
  }

  /**
   * @ignore
   */
  _on(
    eventName: string,
    listener: EventBusCallback<T>,
    options: EventBusOptions = null,
  ) {
    const eventListeners = (this.listeners[eventName] ||= []);
    eventListeners.push({
      listener,
      external: options?.external === true,
      once: options?.once === true,
    });
  }

  /**
   * @ignore
   */
  _off(
    eventName: string,
    listener: EventBusCallback<T>,
    options: EventBusOptions = null,
  ) {
    const eventListeners = this.listeners[eventName];
    if (!eventListeners) {
      return;
    }
    for (let i = 0, ii = eventListeners.length; i < ii; i++) {
      if (eventListeners[i].listener === listener) {
        eventListeners.splice(i, 1);
        return;
      }
    }
  }

  /**
   * @param {string} pattern
   * @returns {boolean}
   * @ignore
   */
  private matchPattern(eventName: string, pattern: string): boolean {
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return regex.test(eventName);
  }

  /**
   * @param {string} eventName
   * @param {string} pattern
   * @returns {boolean}
   * @ignore
   */
  private matchEvent(eventName: string, pattern: string): boolean {
    if (pattern.includes('*')) {
      return this.matchPattern(eventName, pattern);
    }
    return eventName === pattern;
  }

  /**
   * @param {string} eventName
   * @returns {Array}
   * @ignore
   */
  private getMatchingListeners(eventName: string): Array<EventBusListener<T>> {
    const matchingListeners: Array<EventBusListener<T>> = [];
    for (const event in this.listeners) {
      if (this.matchEvent(eventName, event)) {
        matchingListeners.push(
          ...this.listeners[event].map(
            (listener: EventBusListener<T>) => listener,
          ),
        );
      }
    }
    return matchingListeners;
  }
}
