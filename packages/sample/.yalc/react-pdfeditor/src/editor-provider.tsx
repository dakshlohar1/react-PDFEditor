import { fabric } from "fabric";
import {
  createContext,
  Dispatch,
  FC,
  memo,
  ProviderProps,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PDFViewerRef } from "./components";
import {
  Action,
  DEFAULT_FUNCTION,
  EDITOR_DEFAULT_SCALE,
  FabricObjectTypes,
  primaryToolbarItems,
  PRIMARY_TOOL_FABRIC_OBJECT_MAPPING,
  subToolBarItemsDefaultMapping,
  VIEWER_REF_CONSTANT,
} from "./constants";
import {
  useFabricCanvasObjectSelection,
  useGroupRadioActions,
  UseGroupRadioActionsOutput,
  useHandleObjectDelete,
} from "./hooks";
import {
  ActionableActions,
  SubToolbarItem,
  SubToolbarItemDefaultValue,
} from "./types";
import { EventBus, getSubToolbarItemByPrimaryTool } from "./utils";

export type PDFEditorContextType = {
  fabricCanvas: fabric.Canvas | null;
  viewer: PDFViewerRef | null;
  canvasRef?: RefObject<HTMLCanvasElement>;
  setViewerRef: Dispatch<SetStateAction<PDFViewerRef | null>> | null;
  toolbarStates: UseGroupRadioActionsOutput<Action>;
  subToolbarItems: Array<SubToolbarItem>;
  setSubToolbarItems: Dispatch<SetStateAction<Array<SubToolbarItem>>>;
  eventBus: EventBus<SubToolbarItemDefaultValue>;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  isFabricInitialized: boolean;
  initializeFabricCanvas: (editorViewport: {
    width: number;
    height: number;
  }) => void;
  currentShape: string | undefined;
  setCurrentShape: Dispatch<SetStateAction<string | undefined>>;
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
};

export const PDFEditorContext = createContext<PDFEditorContextType>({
  fabricCanvas: null,
  viewer: null,
  setViewerRef: null,
  toolbarStates: {
    actions: [],
    watchGroup: DEFAULT_FUNCTION,
    select: DEFAULT_FUNCTION,
    disableGroup: DEFAULT_FUNCTION,
    deselect: DEFAULT_FUNCTION,
    enableGroup: DEFAULT_FUNCTION,
  },
  subToolbarItems: [],
  setSubToolbarItems: DEFAULT_FUNCTION,
  eventBus: new EventBus<SubToolbarItemDefaultValue>(),
  scale: EDITOR_DEFAULT_SCALE,
  setScale: DEFAULT_FUNCTION,
  isFabricInitialized: false,
  initializeFabricCanvas: DEFAULT_FUNCTION,
  currentShape: undefined,
  setCurrentShape: DEFAULT_FUNCTION,
  isDrawing: false,
  setIsDrawing: DEFAULT_FUNCTION,
});

export const usePDFEditorContext = () => useContext(PDFEditorContext);

export type PDFEditorProviderProps = Record<string, unknown> &
  ProviderProps<PDFEditorContextType>;

export const PDFEditorProvider: FC<PDFEditorProviderProps> = memo(
  ({ children }) => {
    // Ref for the html canvas element
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Ref for the fabric canvas instance (will be initialized in useEffect)
    const fabricCanvasRef = useRef<fabric.Canvas>(new fabric.Canvas(null));
    // State for the PDF viewer ref (will be set in the PDFViewer component) for pdf viewer methods
    const [viewerRef, setViewerRef] = useState<PDFViewerRef | null>(
      VIEWER_REF_CONSTANT
    );
    // Custom hook for handling the toolbar actions or primary toolbar selection state
    // GROUPS: 1. select-tool: Hand Tool, Select Text, Select Annotation, 2. annotations: Shape, Callout, Textbox, etc.
    const toolbarStates = useGroupRadioActions(primaryToolbarItems);
    const { watchGroup, select, deselect } = toolbarStates;
    const primaryToolbarMarkupTool = watchGroup("annotations");
    const primaryToolbarSelectionTool = watchGroup("select-tool");
    // State for the sub toolbar items based on the primary toolbar selection
    const [subToolbarItems, setSubToolbarItems] = useState<
      Array<SubToolbarItem>
    >(
      () =>
        getSubToolbarItemByPrimaryTool(
          subToolBarItemsDefaultMapping,
          primaryToolbarMarkupTool?.action as ActionableActions
        ) as Array<SubToolbarItem>
    );

    // State for checking if the fabric canvas is initialized or not
    const [isFabricInitialized, setIsFabricInitialized] = useState(false);

    // State for the scale of the canvas and the PDF page both
    const [scale, setScale] = useState<number>(EDITOR_DEFAULT_SCALE);
    const eventBus = useMemo(
      () => new EventBus<SubToolbarItemDefaultValue>(),
      []
    );
    // State for current selected object
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
      null
    );
    // State for current selected shape
    const [currentShape, setCurrentShape] = useState<string | undefined>(
      undefined
    );
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingObject, setDrawingObject] = useState<
      fabric.Object | null | undefined
    >(null);

    const isHandMode = primaryToolbarSelectionTool?.action === "Hand";
    const isTextSelectionMode =
      primaryToolbarSelectionTool?.action === "Select Text";
    const isMarkupSelectionMode =
      primaryToolbarSelectionTool?.action === "Select Markup";

    const initializeFabricCanvas = useMemo(
      () => (editorViewport: { width: number; height: number }) => {
        if (!isFabricInitialized) {
          // Initialize the fabric canvas with the canvas element
          canvasRef?.current &&
            fabricCanvasRef.current?.initialize(canvasRef?.current, {
              backgroundColor: "transparent",
              ...editorViewport,
            });
          // Set the state for fabric initialization
          setIsFabricInitialized(true);
        }
      },
      [canvasRef, isFabricInitialized]
    );

    // NOTE: - Hook for handling object deletion using delete key
    useHandleObjectDelete();
    // NOTE: - hook for handling object selection and setting the selected object state
    useFabricCanvasObjectSelection();
    //NOTE: - Effect for selecting the annotation tool based on the selected object
    useEffect(() => {
      const handler = (e: SubToolbarItemDefaultValue) => {
        selectedObject?.set(e as Partial<fabric.Object>);
        fabricCanvasRef.current.requestRenderAll();
      };
      // Add event listeners
      eventBus.on("*", handler);
      return () => {
        eventBus.off("*", handler);
      };
    }, [eventBus, selectedObject]);

    // Effect for updating the sub toolbar items based on the primary toolbar selection
    useEffect(() => {
      setCurrentShape(undefined);
      const currentSubToolbarItems = getSubToolbarItemByPrimaryTool(
        subToolBarItemsDefaultMapping,
        primaryToolbarMarkupTool?.action as ActionableActions
      );
      if (selectedObject) {
        const selectionProperties = selectedObject?.toObject();
        const newSubToolbarItems = currentSubToolbarItems.map((item) => {
          if (item.valueAccessor) {
            return {
              ...item,
              defaultValues: {
                ...item.defaultValues,
                [item.valueAccessor]: selectionProperties[item.valueAccessor],
              },
            };
          }
          return item;
        });
        return setSubToolbarItems(newSubToolbarItems);
      }
      setSubToolbarItems(currentSubToolbarItems);
    }, [primaryToolbarMarkupTool, selectedObject]);

    // Effect for handling the selection mode based on the primary toolbar selection
    useEffect(() => {
      // Check if fabricCanvas is initialized
      if (fabricCanvasRef.current && isFabricInitialized) {
        // If Text selection mode
        if (isTextSelectionMode) {
          // Disable the object selection and deselect the active object
          fabricCanvasRef.current.selection = false;
          fabricCanvasRef.current?.forEachObject(
            (object) => (object.selectable = false)
          ); // Disable the current active object
          fabricCanvasRef.current?.discardActiveObject();
          // Deselect primary tool markup action if selected
          deselect("annotations");
        }
        if (isMarkupSelectionMode || isHandMode) {
          // In Markup selection or Hand mode
          // for hand mode disable the canvas selection, but enable the object selection
          // also in drawing mode disable the canvas selection
          fabricCanvasRef.current.selection = !isHandMode && !isDrawing;
          // Enable the object selection
          fabricCanvasRef.current?.forEachObject(
            (object) => (object.selectable = true)
          );
        }
      }
    }, [
      isHandMode,
      isTextSelectionMode,
      isFabricInitialized,
      isMarkupSelectionMode,
      fabricCanvasRef,
      isDrawing,
      deselect,
    ]);

    // Effect for selecting markup selection tool
    // if any annotations tool is selected and fabric is initialized
    useEffect(() => {
      if (isFabricInitialized && subToolbarItems.length) {
        select("select-tool", "Select Markup");
      }
    }, [isFabricInitialized, subToolbarItems, select]);

    const getFabricObjectByPrimaryTool = (
      currentPrimaryTool: string,
      shapeForShapeTool: string | undefined
    ) => {
      if (currentPrimaryTool === "Shapes") {
        return shapeForShapeTool
          ? new fabric[shapeForShapeTool as FabricObjectTypes]({})
          : null;
      } else if (currentPrimaryTool === "Textbox") {
        return new fabric.RectTextBox({});
      } else if (currentPrimaryTool === "Callout Textbox") {
        return new fabric.Callout({});
      } else if (currentPrimaryTool === "Add Image") {
        return new fabric.EditorImage({
          url: "http://freegifmaker.me/img/gifim300x226/1447420240.gif",
        });
      } else {
        return new fabric[currentPrimaryTool as FabricObjectTypes]({
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          text: "Sample",
        });
        //TODO: - Add else if condition for Sample Markups just like shapes
      }
    };

    // It will draw the currently selected object type on the canvas
    const handleDraw = useCallback(
      (e: fabric.IEvent<Event>) => {
        const currentPrimaryTool = primaryToolbarMarkupTool?.action;
        if (currentPrimaryTool) {
          const pointer = fabricCanvasRef.current.getPointer(e.e);
          const { x, y } = pointer;
          const xKey = [
            FabricObjectTypes.ARROW,
            FabricObjectTypes.LINE,
          ].includes(currentShape as FabricObjectTypes)
            ? "x1"
            : "left";
          const yKey = [
            FabricObjectTypes.ARROW,
            FabricObjectTypes.LINE,
          ].includes(currentShape as FabricObjectTypes)
            ? "y1"
            : "top";
          const shape = getFabricObjectByPrimaryTool(
            currentPrimaryTool,
            currentShape
          );
          (shape as fabric.Object)?.set({
            left: x,
            top: y,
            [xKey]: x,
            [yKey]: y,
          });

          return shape;
        }
        return undefined;
      },
      [primaryToolbarMarkupTool, currentShape]
    );

    useEffect(() => {
      if (isDrawing) {
        fabricCanvasRef.current.on("mouse:down", function (o) {
          if (o.target && o.target.type === "controlPoint") {
            return; // Prevent drawing a new arrow if control point is selected
          }
          fabricCanvasRef.current.selection = false;
          fabricCanvasRef.current.discardActiveObject();
          fabricCanvasRef.current.requestRenderAll();

          const object = handleDraw(o);
          console.log("🚀 ~ object:", object);
          setDrawingObject(object);

          object && fabricCanvasRef.current.add(object);
          // fabricCanvasRef.current.add(myArrow.controlPoint);
        });

        fabricCanvasRef.current.on("mouse:move", function (o) {
          if (!isDrawing || !drawingObject) return;
          const pointer = fabricCanvasRef.current.getPointer(o.e);
          const xKey = [
            FabricObjectTypes.ARROW,
            FabricObjectTypes.LINE,
          ].includes(currentShape as FabricObjectTypes)
            ? "x2"
            : "width";
          const yKey = [
            FabricObjectTypes.ARROW,
            FabricObjectTypes.LINE,
          ].includes(currentShape as FabricObjectTypes)
            ? "y2"
            : "height";
          drawingObject.set({
            [xKey]: pointer.x,
            [yKey]: pointer.y,

            dirty: true,
          });
          // arrow._updateControlPointPosition();
          fabricCanvasRef.current.renderAll();
        });

        fabricCanvasRef.current.on("mouse:up", function (o) {
          if (!isDrawing || !drawingObject) return;
          setIsDrawing(false);
          drawingObject.setCoords(); // Update the coordinates
          //  arrow.controlPoint.setCoords();
          fabricCanvasRef.current.selection = true; // Re-enable selection
          fabricCanvasRef.current.setActiveObject(drawingObject);
          fabricCanvasRef.current.renderAll();
          setDrawingObject(null);
        });
        return () => {
          fabricCanvasRef.current.off("mouse:down");
          fabricCanvasRef.current.off("mouse:move");
          fabricCanvasRef.current.off("mouse:up");
        };
      }
      return;
    }, [
      isDrawing,
      drawingObject,
      handleDraw,
      currentShape,
      primaryToolbarMarkupTool,
    ]);

    return (
      <PDFEditorContext.Provider
        value={{
          fabricCanvas: fabricCanvasRef.current,
          viewer: viewerRef,
          canvasRef,
          setViewerRef,
          toolbarStates,
          subToolbarItems,
          setSubToolbarItems,
          eventBus,
          scale,
          setScale,
          isFabricInitialized,
          initializeFabricCanvas,
          currentShape,
          setCurrentShape,
          isDrawing,
          setIsDrawing,
        }}
      >
        {children}
      </PDFEditorContext.Provider>
    );
  }
);
