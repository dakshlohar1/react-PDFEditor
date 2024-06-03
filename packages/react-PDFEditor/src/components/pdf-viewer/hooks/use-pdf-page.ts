import { useCallback, useEffect, useState } from 'react';

export type UsePdfPageOptions = {
  /**
   * The default page to be opened when the pdf is loaded
   */
  defaultPageOpened?: number;
  /**
   * Total number of pages in the pdf
   * This is used to determine if the next page exists
   * and if the previous page exists
   */
  totalPages: number;

  /**
   * Callback to be called when the page changes
   * @param pageNumber - The new page number
   * @returns void
   * @default undefined
   * */
  onPageChange?: (pageNumber: number) => void;
};

export type UsePdfPageResponse = {
  /**
   * The current page number
   */
  currentPage: number;
  /**
   * The next page number
   */
  nextPage: number;
  /**
   * The previous page number
   */
  previousPage: number;
  /**
   * Function to go to the next page
   */
  goToNextPage: () => void;
  /**
   * Function to go to the previous page
   */
  goToPreviousPage: () => void;

  /**
   * Function to go to a specific page
   * @param pageNumber - The page number to go to
   */
  gotoPage: (pageNumber: number) => void;
};

/**
 * Hook to manage the current page of the pdf
 * @param options - The options for the hook
 * @returns The response of the hook
 */
export const usePdfPage = ({
  defaultPageOpened = 1,
  totalPages,
  onPageChange,
}: UsePdfPageOptions): UsePdfPageResponse => {
  const [currentPage, setCurrentPage] = useState<number>(defaultPageOpened);

  // On initial render the totalPages prop will undefined so we need to check if it is defined
  // and if the currentPage is greater than the totalPages

  useEffect(() => {
    if (totalPages && currentPage > totalPages) {
      setCurrentPage(totalPages);
      onPageChange?.(totalPages);
    }
  }, [totalPages, currentPage, onPageChange]);

  /**
   * Function to go to the next page
   * If the current page is less than the total pages
   * then increment the current page by 1
   *
   * @returns void
   */
  const goToNextPage = useCallback(() => {
    if (totalPages && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange?.(currentPage + 1);
    }
  }, [currentPage, onPageChange, totalPages]);

  /**
   * Function to go to the previous page
   * If the current page is greater than 1
   * then decrement the current page by 1
   *
   * @returns void
   */
  const goToPreviousPage = useCallback(() => {
    if (totalPages && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange?.(currentPage - 1);
    }
  }, [currentPage, onPageChange, totalPages]);

  /**
   * Function to go to a specific page
   * If the pageNumber is less than or equal to the total pages
   * then set the current page to the pageNumber
   *
   * @param pageNumber - The page number to go to
   * @returns void
   */
  const gotoPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        onPageChange?.(pageNumber);
      }
    },
    [onPageChange, totalPages],
  );

  return {
    currentPage,
    nextPage: currentPage + 1,
    previousPage: currentPage - 1,
    goToNextPage,
    goToPreviousPage,
    gotoPage,
  };
};
