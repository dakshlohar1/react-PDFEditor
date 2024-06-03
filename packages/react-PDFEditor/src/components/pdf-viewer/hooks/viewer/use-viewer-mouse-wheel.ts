import { useCallback } from 'react';
import { useKeyWithWheelEvent } from '..';

export type UseViewerMouseWheelOptions = {
  /**
   * The ref object that can be attached to the DOM element.
   */
  boxRef: React.MutableRefObject<HTMLDivElement | null>;

  /**
   * The ref object of the container of the PDF viewer.
   */
  containerRef: React.MutableRefObject<HTMLDivElement | null>;

  /**
   * The function to go to the next page.
   */
  goToNextPage: () => void;

  /**
   * The function to go to the previous page.
   */
  goToPreviousPage: () => void;

  /**
   * The function to set the zoom level.
   */
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

export const useViewerMouseWheel = (options: UseViewerMouseWheelOptions) => {
  const { boxRef, containerRef, goToNextPage, goToPreviousPage, setZoom } =
    options;

  /**
   * Handles the `Wheel` event to navigate between pages in the PDF viewer.
   * @param event - The wheel event.
   */
  const handleCtrlWheelPageChange = useCallback(
    (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        const container = containerRef.current;
        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          if (
            scrollTop === 0 ||
            scrollTop + clientHeight === scrollHeight ||
            clientHeight >= scrollHeight
          ) {
            if (event.deltaY < 0) {
              goToPreviousPage();
            } else {
              goToNextPage();
            }
          } else {
            container.scrollBy(0, event.deltaY);
          }
        }
      }
    },
    [containerRef, goToNextPage, goToPreviousPage],
  );

  /**
   * Handles the `Wheel` event to zoom in and out of the PDF viewer (without ctrl key).
   * @param event - The wheel event.
   * @param zoomStep - The step to zoom in or out.
   */
  const handleWheelPageZoom = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      if (!event.ctrlKey) {
        if (event.deltaY < 0) {
          setZoom(prevZoom => prevZoom + 0.1);
        } else {
          setZoom(prevZoom => prevZoom - 0.1);
        }
      }
    },
    [setZoom],
  );

  useKeyWithWheelEvent({
    key: 'ctrlKey',
    onWheelWithKey: handleCtrlWheelPageChange,
    boxRef,
  });
};
