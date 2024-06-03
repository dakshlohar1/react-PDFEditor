import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Document, Page } from "react-pdf";
import { File } from "react-pdf/dist/cjs/shared/types";

import { PDFViewerToolbar } from "./components";
import { usePDFContainerViewport, usePdfPage } from "./hooks";

export type PDFViewerRef = {
  gotoPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  containerViewport: { width: number; height: number };
  pageViewport: { width: number; height: number };
  currentPage: number;
  isPdfLoaded: boolean;
};
export type PDFViewerFile = string | File | null;

export type PDFViewerProps = {
  file?: PDFViewerFile;
  documentProps?: ComponentProps<typeof Document>;
  pageProps?: ComponentProps<typeof Page>;
  onPageChange?: (pageNumber: number) => void;
  defaultPage?: number;
  showPageNavigation?: boolean;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
  setViewerRef?: React.Dispatch<React.SetStateAction<PDFViewerRef | null>>;
  canSelectText?: boolean;
};

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  onPageChange,
  documentProps,
  pageProps,
  defaultPage = 1,
  setViewerRef,
  showPageNavigation = false,
  containerRef,
  canSelectText = false,
}) => {
  // State for pdf viewer that is pdf loaded or not
  const [isPdfLoaded, setIsPdfLoaded] = useState<boolean>(false);

  // Ref to the container of pdf viewer
  const pdfDocumentDivRef = useRef<HTMLDivElement | null>(null);

  const { containerViewport } = usePDFContainerViewport(containerRef);

  // State for page viewport
  const [pageViewport, setPageViewport] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  // State for total pages in pdf
  const [totalPages, setTotalPages] = useState<number>(0);

  // Callback for when document is loaded, used for setting page viewport and total pages
  const onDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      setIsPdfLoaded(true);
      documentProps?.onLoadSuccess?.(pdf);
      setTotalPages(pdf.numPages);
    },
    [documentProps]
  );
  // Callback called when (new)page is loaded, used for setting page viewport
  const onPageLoadSuccess = useCallback(
    (page: any) => {
      if (containerViewport.width) {
        const viewport = page.getViewport({ scale: 1 });
        setPageViewport({
          width: viewport.width,
          height: viewport.height,
        });
      }
      pageProps?.onLoadSuccess?.(page);
    },
    [containerViewport.width, pageProps]
  );

  // Custom hook for handling page navigation
  const pageControls = usePdfPage({
    totalPages,
    onPageChange,
    defaultPageOpened: defaultPage,
  });
  const { currentPage, gotoPage, goToNextPage, goToPreviousPage } =
    pageControls;

  // INFO: To access function and states of viewer in parent component use viewerRef
  // Developer can export state and functions of viewer as per requirement, remember to update the type of viewerRef
  useEffect(() => {
    if (setViewerRef) {
      setViewerRef({
        gotoPage,
        goToNextPage,
        goToPreviousPage,
        containerViewport,
        pageViewport,
        currentPage,
        isPdfLoaded,
      });
    }
  }, [
    setViewerRef,
    gotoPage,
    goToNextPage,
    goToPreviousPage,
    containerViewport,
    pageViewport,
    currentPage,
    isPdfLoaded,
  ]);

  // State for managing the pdf viewer zoom
  // const [zoom, setZoom] = useState<number>(1);

  //   TODO: Implement the useKeyWithWheelEvent hook for zooming in and out of the PDF viewer
  //   and use the useViewerMouseWheel hook to navigate between pages using the mouse wheel + ctrl key
  //   page navigation if page is fully visible or fully scrolled to top/bottom of the page
  //   then change to next/previous page otherwise normal scroll
  // useViewerMouseWheel({
  //     containerRef,
  //     boxRef: pdfDocumentDivRef,
  //     goToNextPage,
  //     goToPreviousPage,
  //     setZoom,
  // });

  // State for managing the visible pages in the pdf viewer only for optimization purposes
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  /**
   * The function inside useEffect is creating a range of page numbers for a PDF viewer.
   * The range is centered around the current page (currentPage), extending two pages before and two pages after.
   * However, the range is also constrained to be within 1 and total number pages in pdf, which are the minimum and maximum page numbers.
   * Here's a breakdown of the code inside the useEffect:
   *
   * - rangeStart is calculated as the larger number between 1 and currentPage - 2. This ensures that the range starts at least at page 1.
   * - rangeEnd is calculated as the smaller number between total number pages in pdf and currentPage + 2. This ensures that the range ends at most at page 14.
   * - pages is an array that represents the range of pages. It's created using Array.from,
   * which creates a new array instance from a length object or an iterable object. The length of the array is rangeEnd - rangeStart + 1,
   * and the second argument is a map function that generates the page numbers.
   * - setVisiblePages(pages) is likely a function that updates the state of the component with the new range of visible pages.
   */
  useEffect(() => {
    const rangeStart = Math.max(1, currentPage - 2);
    const rangeEnd = Math.min(totalPages, currentPage + 2);
    const pages = Array.from(
      { length: rangeEnd - rangeStart + 1 },
      (_, i) => i + rangeStart
    );
    setVisiblePages(pages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (file) {
      setIsPdfLoaded(false);
      setTotalPages(0);
      setPageViewport({ width: 0, height: 0 });
    }
  }, [file]);

  /* Page navigation controllers, positionally absolute to the bottom of pdf viewer */
  return (
    <PDFViewerToolbar
      isPdfLoaded={isPdfLoaded}
      showPageNavigation={showPageNavigation}
      currentPage={currentPage}
      totalPages={totalPages}
      gotoPage={gotoPage}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
    >
      <Document
        {...documentProps}
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        inputRef={pdfDocumentDivRef}
      >
        {visiblePages.map((pageNumber) => (
          <Page
            {...pageProps}
            key={pageNumber}
            pageNumber={pageNumber}
            renderTextLayer
            renderAnnotationLayer
            renderForms
            onLoadSuccess={onPageLoadSuccess}
            className={`${
              pageNumber === currentPage ? "display-block" : "display-none"
            } ${pageProps?.className || ""} ${
              canSelectText ? "" : "deselect-text"
            }`}
          />
        ))}
      </Document>
    </PDFViewerToolbar>
  );
};
