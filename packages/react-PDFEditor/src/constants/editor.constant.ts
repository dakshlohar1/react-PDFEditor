import { ActionableActions } from '../types';

export const TOOLBAR_HEIGHT = 55 as const;

export const SUB_TOOLBAR_HEIGHT = 56 as const;

export const EDITOR_EMPTY_AREA_COLOR = '#00000060' as const;

export const COLOR_TOOLS_DEFAULT_COLOR = '#000000' as const;

export const EDITOR_DEFAULT_SCALE = 1 as const;

// All default browser provided fonts are listed here.
export const FONT_FAMILY_OPTIONS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Arial Black', label: 'Arial Black' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Lucida Console', label: 'Lucida Console' },
  { value: 'Lucida Sans Unicode', label: 'Lucida Sans Unicode' },
  { value: 'Palatino Linotype', label: 'Palatino Linotype' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Symbol', label: 'Symbol' },
  { value: 'Webdings', label: 'Webdings' },
  { value: 'Wingdings', label: 'Wingdings' },
  { value: 'MS Sans Serif', label: 'MS Sans Serif' },
  { value: 'MS Serif', label: 'MS Serif' },
  { value: 'MS UI Gothic', label: 'MS UI Gothic' },
  { value: 'MS PGothic', label: 'MS PGothic' },
  { value: 'MS Mincho', label: 'MS Mincho' },
  { value: 'MS PMincho', label: 'MS PMincho' },
  { value: 'MS Gothic', label: 'MS Gothic' },
  { value: 'MS Pゴシック', label: 'MS Pゴシック' },
  { value: 'MS 明朝', label: 'MS 明朝' },
  { value: 'MS P明朝', label: 'MS P明朝' },
  { value: 'Meiryo', label: 'Meiryo' },
  { value: 'Meiryo UI', label: 'Meiryo UI' },
  { value: 'MS UI Gothic', label: 'MS UI Gothic' },
  { value: 'MS PGothic', label: 'MS PGothic' },
  { value: 'MS Mincho', label: 'MS Mincho' },
  { value: 'Helvetica', label: 'Helvetica' },
] as const;

export const DEFAULT_FONT_FAMILY: typeof FONT_FAMILY_OPTIONS[number]['value'] =
  'Arial';

export const DEFAULT_STROKE_WIDTH = 1 as const;

export const FONT_SIZE_OPTIONS = Array.from({ length: 130 }, (_, i) => {
  const value = i + 1;
  const label = value.toString();
  return { value, label };
});

export const DEFAULT_FONT_SIZE = 12 as const;

export const DEFAULT_OPACITY = 1 as const;

/**
 * The Z_INDEX object contains the z-index values for different components in the PDF editor.
 *
 * Layers:
 * - 5: TOOLBAR (top most layer)
 * - 4: SUB_TOOLBAR (below toolbar)
 * - 3: FABRIC_CANVAS (on top of pdf viewer)
 * - 1: FABRIC_CANVAS_TEXT_SELECTION (below PDF_VIEWER)
 * - 2: PDF_VIEWER (below fabric canvas)
 *
 */
export const Z_INDEX = {
  TOOLBAR: 5,
  SUB_TOOLBAR: 4,
  FABRIC_CANVAS: 3,
  FABRIC_CANVAS_TEXT_SELECTION: 1,
  PDF_VIEWER: 2,
} as const;

export const DEFAULT_FUNCTION = () => {
  console.error('PDFEditor Context not initialized!');
  return undefined;
};

export const VIEWER_REF_CONSTANT = {
  pageViewport: {
    width: 0,
    height: 0,
  },
  containerViewport: {
    width: 0,
    height: 0,
  },
  currentPage: 1,
  goToNextPage: DEFAULT_FUNCTION,
  goToPreviousPage: DEFAULT_FUNCTION,
  isPdfLoaded: false,
  gotoPage: DEFAULT_FUNCTION,
} as const;

export enum FabricObjectTypes {
  RECT = 'Rectangle',
  LINE = 'EditorLine',
  ARROW = 'Arrow',
  CLOUD = 'Cloud',
  SQUARE = 'Square',
  CIRCLE = 'EditorCircle',
  TRIANGLE = 'EditorTriangle',
  IMAGE = 'EditorImage',
  RECT_TEXT = 'RectTextBox',
  CALLOUT = 'Callout',
}

export const PRIMARY_TOOL_FABRIC_OBJECT_MAPPING: Record<
  FabricObjectTypes,
  ActionableActions
> = {
  [FabricObjectTypes.RECT]: 'Shapes',
  [FabricObjectTypes.LINE]: 'Shapes',
  [FabricObjectTypes.ARROW]: 'Shapes',
  [FabricObjectTypes.CLOUD]: 'Shapes',
  [FabricObjectTypes.SQUARE]: 'Shapes',
  [FabricObjectTypes.CIRCLE]: 'Shapes',
  [FabricObjectTypes.TRIANGLE]: 'Shapes',
  [FabricObjectTypes.IMAGE]: 'Add Image',
  [FabricObjectTypes.RECT_TEXT]: 'Textbox',
  [FabricObjectTypes.CALLOUT]: 'Callout Textbox',
};

export const TOOL_VALUE_CLIPPER = {
  BOLD: {
    false: 'bold',
    true: 'normal',
    normal: false,
    bold: true,
  },
  ITALIC: {
    false: 'italic',
    true: 'normal',
    normal: false,
    italic: true,
  },
  ROTATE: {
    false: true,
    true: true,
  },
};
