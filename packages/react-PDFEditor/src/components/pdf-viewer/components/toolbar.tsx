import {
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import { FC, Fragment } from "react";

export type PDFViewerToolbarProps = {
  isPdfLoaded: boolean;
  showPageNavigation: boolean;
  currentPage: number;
  totalPages: number;
  gotoPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  children: React.ReactNode;
};

export const PDFViewerToolbar: FC<PDFViewerToolbarProps> = ({
  isPdfLoaded,
  showPageNavigation,
  currentPage,
  totalPages,
  gotoPage,
  goToNextPage,
  goToPreviousPage,
  children,
}) => {
  // If pdf is loaded and showPageNavigation is true then render the page navigation toolbar
  return (
    // Page navigation toolbar with previous, next and page number input the ui is same as the chrome pdf viewer toolbar
    isPdfLoaded && showPageNavigation ? (
      <Flex flexDir="column">
        <Flex
          height={10}
          w="100%"
          bg="gray.800"
          color="white"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          zIndex={4} // TODO: Add z-index to the theme
          transition="top 0.3s ease-in-out"
        >
          <Flex alignItems="center">
            <Flex alignItems="center" gap="2">
              <Button
                size="sm"
                colorScheme="blackAlpha"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Flex alignItems="center">
                <NumberInput
                  maxW={16}
                  size="sm"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(value) => {
                    if (value) {
                      gotoPage(parseInt(value));
                    }
                  }}
                >
                  <NumberInputField />
                </NumberInput>
                <Text ml={2}>of {totalPages}</Text>
              </Flex>
              <Button
                size="sm"
                colorScheme="blackAlpha"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        </Flex>
        {children}
      </Flex>
    ) : (
      <Fragment>{children}</Fragment>
    )
  );
};
