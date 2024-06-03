import { useCallback, useEffect, useState } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type PDFContainerViewport = {
  width: number;
  height: number;
};

export const usePDFContainerViewport = (
  containerRef?: React.MutableRefObject<HTMLDivElement | null>,
) => {
  // State for container viewport
  const [containerViewport, setContainerViewport] =
    useState<PDFContainerViewport>({ width: 0, height: 0 });

  const setPDFContainerViewport = useCallback(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    const container = containerRef.current;
    if (container) {
      const boundingRect = container.getBoundingClientRect();
      setContainerViewport({
        width: boundingRect.width,
        height: boundingRect.height,
      });
    }
  }, [containerRef, containerRef?.current?.getBoundingClientRect().height]);

  useEffect(() => {
    const resizeSubscription: Subscription = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(setPDFContainerViewport);

    setPDFContainerViewport();

    return () => {
      resizeSubscription.unsubscribe();
    };
  }, [setPDFContainerViewport]);

  return { containerViewport };
};
