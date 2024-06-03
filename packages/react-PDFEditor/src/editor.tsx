import { Flex, ChakraProvider } from "@chakra-ui/react";
import { fabric } from "fabric";
import { round } from "lodash";
import { FC, memo, useEffect, useMemo, useRef, useState } from "react";

import { EditorToolbar, PDFViewer, PDFViewerFile } from "./components";
import {
  EDITOR_EMPTY_AREA_COLOR,
  SUB_TOOLBAR_HEIGHT,
  TOOLBAR_HEIGHT,
  Z_INDEX,
} from "./constants";
import { usePDFEditorContext } from "./editor-provider";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

export type PDFEditorProps = {
  file?: PDFViewerFile;
  height?: string;
  children?: never;
  initialMarkups?: Record<number, Array<fabric.Object>>; // INFO: mapping of page number to markups
};

export const PDFEditor: FC<PDFEditorProps> = memo(
  ({ file, height = "100vh", children }) => {
    if (children) {
      throw new Error("PDFEditor component does not accept children");
    }
    const {
      fabricCanvas,
      viewer,
      canvasRef,
      setViewerRef,
      toolbarStates: { watchGroup },
      scale,
      initializeFabricCanvas,
    } = usePDFEditorContext();

    if (!fabricCanvas || !canvasRef || !setViewerRef) {
      throw new Error(
        "PDFEditor component must be wrapped in PDFEditorProvider"
      );
    }

    // Value for the primary toolbar selection mode
    const primaryToolbarSelection = watchGroup("select-tool");
    // Check if the text selection mode is active, to set the z-index of the canvas
    // if the text selection mode is active, the canvas should be behind the pdf viewer
    const isTextSelectionMode =
      primaryToolbarSelection?.action === "Select Text";

    // Ref for the container element
    const containerRef = useRef<HTMLDivElement | null>(null);
    // State for checking if the PDF page viewport is overflowing the container or not
    const [isOverflowing, setIsOverflowing] = useState(false);

    // Memoized values for the page and container view-ports(width and height)
    const memoizedPageViewport = useMemo(
      () => viewer?.pageViewport,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [viewer?.pageViewport.width, viewer?.pageViewport.height] // This value can be change when a page is changed and any page have different width and height
    );
    const memoizedContainerViewport = useMemo(
      () => viewer?.containerViewport,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [viewer?.containerViewport.width, viewer?.containerViewport.height]
    );
    // Effect for checking if the PDF page is overflowing the container or not
    useEffect(() => {
      if (memoizedContainerViewport?.width && memoizedPageViewport?.width) {
        const { width: containerWidth } = memoizedContainerViewport;
        const { width: viewerWidth } = memoizedPageViewport;
        const scaledViewerWidth = viewerWidth * scale;
        const scaledContainerWidth = containerWidth;

        // Set the state based on the comparison of the scaled viewer width and container width
        setIsOverflowing(scaledViewerWidth > scaledContainerWidth);
      }
    }, [scale, memoizedContainerViewport, memoizedPageViewport]);

    // Effect for initializing the fabric canvas and setting the dimensions and zoom
    useEffect(() => {
      if (memoizedPageViewport?.width && memoizedPageViewport?.height) {
        const editorViewport = {
          // TODO: Create constants for the scale precision
          width: round(scale * memoizedPageViewport?.width, 5),
          height: round(scale * memoizedPageViewport?.height, 5),
        };
        initializeFabricCanvas(editorViewport);
        // Set the dimensions and zoom of the fabric canvas based on the scale and page viewport
        if (memoizedPageViewport?.width) {
          fabricCanvas?.setDimensions(editorViewport);
          fabricCanvas?.setZoom(scale);
        }
      }
    }, [
      memoizedPageViewport,
      scale,
      initializeFabricCanvas,
      fabricCanvas,
      canvasRef,
    ]);

    /* INFO: Main container for toolbar and Editor */
    return (
      <ChakraProvider>
        <Flex flexDir="column" h={height} pos="relative" overflow="hidden">
          <EditorToolbar />
          {/* INFO: Container for Viewer and Canvas */}
          <Flex
            pos="absolute"
            // INFO: Inset for the toolbar and secondary toolbar height
            inset={`calc(${TOOLBAR_HEIGHT}px + ${SUB_TOOLBAR_HEIGHT}px) 0 0`}
            overflow="auto"
            ref={containerRef}
            justifyContent={isOverflowing ? "flex-start" : "center"}
            bg={EDITOR_EMPTY_AREA_COLOR}
          >
            {setViewerRef && (
              <PDFViewer
                file={file}
                setViewerRef={setViewerRef}
                containerRef={containerRef}
                pageProps={{
                  scale,
                }}
                canSelectText={isTextSelectionMode}
              />
            )}
            <Flex
              inset="0 0 0"
              zIndex={
                isTextSelectionMode
                  ? Z_INDEX.FABRIC_CANVAS_TEXT_SELECTION
                  : Z_INDEX.FABRIC_CANVAS
              }
              pos="absolute"
              h="min-content"
              justifyContent={isOverflowing ? "flex-start" : "center"}
            >
              <canvas ref={canvasRef}></canvas>
            </Flex>
          </Flex>
        </Flex>
      </ChakraProvider>
    );
  }
);
