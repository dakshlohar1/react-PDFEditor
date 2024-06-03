import { useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { filter, throttleTime as throttleTimeRxjs } from 'rxjs/operators';

export const allowedKeys = [
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
] as const;

export type UseKeyWithWheelEventOptions = {
  /**
   * The key to listen for in combination with the wheel event.
   * @example 'ctrlKey'
   */
  key?: typeof allowedKeys[number];

  /**
   * The throttle time in milliseconds.
   * @default 500
   * @example 500
   */
  throttleTime?: number;

  /**
   * The event handler to call when the key is pressed in combination with the wheel event.
   */
  onWheelWithKey: (event: WheelEvent) => void;

  /**
   * The ref object that can be attached to the DOM element.
   */
  boxRef: React.MutableRefObject<HTMLDivElement | null>;
};

/**
 * Custom hook that listens for a specific key press combined with a wheel event.
 *
 * @param options - The hook options.
 * @param options.key - The key that needs to be pressed.
 * @param options.throttleTime - The throttle time in milliseconds.
 * @param options.onWheelWithKey - The callback function to be executed when the key is pressed and a wheel event occurs.
 *
 * @returns A ref object that can be attached to the DOM element.
 */
export const useKeyWithWheelEvent = (options: UseKeyWithWheelEventOptions) => {
  const { key, throttleTime = 500, onWheelWithKey, boxRef } = options;

  useEffect(() => {
    if (!boxRef.current) return;
    const box = boxRef.current;
    const filters =
      key && allowedKeys.includes(key)
        ? filter((event: WheelEvent) => event[key])
        : filter((_: WheelEvent) => true);

    const subscription = fromEvent<WheelEvent>(box, 'wheel')
      .pipe(
        // Filter events where the key is not pressed
        filters,
        // Throttle the events to once every 500ms
        throttleTimeRxjs(throttleTime),
      )
      .subscribe((event: WheelEvent) => {
        event.preventDefault(); // Prevent browser zooming
        onWheelWithKey(event);
      });

    return () => {
      // Unsubscribe from the observable when the component is unmounted
      subscription.unsubscribe();
    };
  }, [boxRef, onWheelWithKey, throttleTime, key]);
};
