import {
  BorderStrokeColorTool,
  BorderStrokeTool,
  DrawShapeTool,
  FillColorTool,
  FontBackgroundColorTool,
  FontColorTool,
  FontFamilySelectionTool,
  FontSizeTool,
  OpacityTool,
  SubToolBarButton,
  TextAlignmentTool,
} from '../components/editor-tools';
import {
  BoldIcon,
  ImageBorderModelIcon,
  ItalicIcon,
  RotateLeftIcon,
  RotateRightIcon,
  UnderlineIcon,
} from '../components/icons/';
import { ActionAndSubToolbarItemMappingType } from '../types';
import {
  COLOR_TOOLS_DEFAULT_COLOR,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_STROKE_WIDTH,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  TOOL_VALUE_CLIPPER,
} from './editor.constant';

export const subToolBarItemsDefaultMapping: ActionAndSubToolbarItemMappingType =
  {
    Shapes: [
      {
        UIComponent: DrawShapeTool,
        onChangeEvent: 'update:text:textAlign',
        tooltip: 'Draw',
        valueAccessor: 'shape',
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateLeftIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:shape:anticlockwise',
        tooltip: 'Rotate Anticlockwise',
        valueAccessor: 'anticlockwise',
        valueClipper: TOOL_VALUE_CLIPPER.ROTATE,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateRightIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:shape:clockwise',
        tooltip: 'Rotate Clockwise',
        valueAccessor: 'clockwise',
        valueClipper: TOOL_VALUE_CLIPPER.ROTATE,
      },
      {
        UIComponent: props => (
          // TODO: Create constant for default value of max border stroke
          <BorderStrokeTool {...props} suffix='pt' max={20} />
        ),
        onChangeEvent: 'update:shape:strokeWidth',
        tooltip: 'Border Stroke',
        defaultValues: {
          strokeWidth: DEFAULT_STROKE_WIDTH,
        },
        valueAccessor: 'strokeWidth',
      },
      {
        UIComponent: BorderStrokeColorTool,
        onChangeEvent: 'update:shape:strokeColor',
        tooltip: 'Border Color',
        valueAccessor: 'strokeColor',
      },
      {
        UIComponent: FillColorTool,
        onChangeEvent: 'update:shape:fill',
        tooltip: 'Fill Color',
        valueAccessor: 'fill',
      },
      {
        UIComponent: OpacityTool,
        onChangeEvent: 'update:shape:opacity',
        tooltip: 'Opacity',
        valueAccessor: 'opacity',
      },
    ],
    Textbox: [
      {
        UIComponent: props => (
          <FontFamilySelectionTool {...props} options={FONT_FAMILY_OPTIONS} />
        ),
        onChangeEvent: 'update:text:fontFamily',
        tooltip: 'Font Family',
        defaultValues: {
          fontFamily: DEFAULT_FONT_FAMILY,
        },
        valueAccessor: 'fontFamily',
      },
      {
        UIComponent: props => (
          <FontSizeTool {...props} options={FONT_SIZE_OPTIONS} />
        ),
        onChangeEvent: 'update:text:fontSize',
        tooltip: 'Font Size',
        defaultValues: {
          fontSize: DEFAULT_FONT_SIZE,
        },
        valueAccessor: 'fontSize',
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <BoldIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:text:bold',
        tooltip: 'Bold',
        defaultValues: {
          fontWeight: 'normal',
        },
        valueAccessor: 'fontWeight',
        valueClipper: TOOL_VALUE_CLIPPER.BOLD,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <ItalicIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:text:italic',
        tooltip: 'Italic',
        defaultValues: {
          fontStyle: 'normal',
        },
        valueAccessor: 'fontStyle',
        valueClipper: TOOL_VALUE_CLIPPER.ITALIC,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <UnderlineIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:text:underline',
        tooltip: 'Underline',
        defaultValues: {
          underline: false,
        },
        valueAccessor: 'underline',
      },
      {
        UIComponent: FontColorTool,
        onChangeEvent: 'update:text:fontColor',
        tooltip: 'Font Color',
        valueAccessor: 'fontColor',
      },
      {
        UIComponent: FontBackgroundColorTool,
        onChangeEvent: 'update:text:backgroundColor',
        tooltip: 'Background Color',
        valueAccessor: 'backgroundColor',
      },
      {
        UIComponent: TextAlignmentTool,
        onChangeEvent: 'update:text:textAlign',
        tooltip: 'Align',
        defaultValues: {
          textAlign: 'left',
        },
        valueAccessor: 'textAlign',
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateLeftIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:text:anticlockwise',
        tooltip: 'Rotate Anticlockwise',
        valueAccessor: 'anticlockwise',
        valueClipper: TOOL_VALUE_CLIPPER.ROTATE,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateRightIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:text:clockwise',
        tooltip: 'Rotate Clockwise',
        valueAccessor: 'clockwise',
        valueClipper: TOOL_VALUE_CLIPPER.ROTATE,
      },
      {
        UIComponent: BorderStrokeColorTool,
        onChangeEvent: 'update:text:rectStrokeColor',
        tooltip: 'Border Color',
        valueAccessor: 'rectStrokeColor',
      },
      {
        UIComponent: FillColorTool,
        onChangeEvent: 'update:text:rectBackgroundColor',
        tooltip: 'Rectangle Background Color',
        valueAccessor: 'rectBackgroundColor',
      },
      {
        UIComponent: OpacityTool,
        onChangeEvent: 'update:text:opacity',
        tooltip: 'Opacity',
        valueAccessor: 'opacity',
      },
    ],
    'Callout Textbox': [
      {
        UIComponent: props => (
          <FontFamilySelectionTool {...props} options={FONT_FAMILY_OPTIONS} />
        ),
        onChangeEvent: 'update:callout:fontFamily',
        tooltip: 'Font Family',
        defaultValues: {
          fontFamily: DEFAULT_FONT_FAMILY,
        },
      },
      {
        UIComponent: props => (
          <FontSizeTool {...props} options={FONT_SIZE_OPTIONS} />
        ),
        onChangeEvent: 'update:callout:fontSize',
        tooltip: 'Font Size',
        defaultValues: {
          fontSize: DEFAULT_FONT_SIZE,
        },
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <BoldIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:callout:bold',
        tooltip: 'Bold',
        defaultValues: {
          fontWeight: 'normal',
        },
        valueAccessor: 'fontWeight',
        valueClipper: TOOL_VALUE_CLIPPER.BOLD,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <ItalicIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:callout:italic',
        tooltip: 'Italic',
        defaultValues: {
          fontStyle: 'normal',
        },
        valueAccessor: 'fontStyle',
        valueClipper: TOOL_VALUE_CLIPPER.ITALIC,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <UnderlineIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:callout:underline',
        tooltip: 'Underline',
        defaultValues: {
          underline: false,
        },
        valueAccessor: 'underline',
      },
      {
        UIComponent: FontColorTool,
        onChangeEvent: 'update:callout:fontColor',
        tooltip: 'Font Color',
        valueAccessor: 'fontColor',
      },
      {
        UIComponent: FontBackgroundColorTool,
        onChangeEvent: 'update:callout:backgroundColor',
        tooltip: 'Background Color',
        valueAccessor: 'backgroundColor',
      },
      {
        UIComponent: TextAlignmentTool,
        onChangeEvent: 'update:callout:textAlign',
        tooltip: 'Align',
        defaultValues: {
          textAlign: 'left',
        },
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateLeftIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:callout:anticlockwise',
        tooltip: 'Rotate Anticlockwise',
        valueAccessor: 'anticlockwise',
        valueClipper: TOOL_VALUE_CLIPPER.ROTATE,
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateRightIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:callout:clockwise',
        tooltip: 'Rotate Clockwise',
        valueAccessor: 'clockwise',
        valueClipper: TOOL_VALUE_CLIPPER.ROTATE,
      },
      {
        UIComponent: props => (
          // TODO: Create constant for default value of max border stroke
          <BorderStrokeTool {...props} suffix='pt' max={20} />
        ),
        onChangeEvent: 'update:callout:rectStrokeWidth',
        tooltip: 'Border Stroke',
        defaultValues: {
          rectStrokeWidth: DEFAULT_STROKE_WIDTH,
        },
        valueAccessor: 'rectStrokeWidth',
      },
      {
        UIComponent: BorderStrokeColorTool,
        onChangeEvent: 'update:callout:rectStrokeColor',
        tooltip: 'Border Color',
        valueAccessor: 'rectStrokeColor',
      },
      {
        UIComponent: FillColorTool,
        onChangeEvent: 'update:callout:rectBackgroundColor',
        tooltip: 'Rectangle Background Color',
        valueAccessor: 'rectBackgroundColor',
      },
      {
        UIComponent: OpacityTool,
        onChangeEvent: 'update:callout:opacity',
        tooltip: 'Opacity',
      },
    ],
    'Add Image': [
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <ImageBorderModelIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'toggle:image:stroke',
        tooltip: 'Border',
        defaultValues: {
          border: false,
        },
        valueAccessor: 'border',
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateLeftIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:image:clockwise',
        tooltip: 'Rotate Clockwise',
        valueAccessor: 'clockwise',
      },
      {
        UIComponent: props => (
          <SubToolBarButton
            {...props}
            icon={({ componentProps }) => (
              <RotateRightIcon
                boxSize='20px'
                fillOpacity={componentProps?.fillOpacity as number}
              />
            )}
          />
        ),
        onChangeEvent: 'rotate:image:anticlockwise',
        tooltip: 'Rotate Anticlockwise',
        valueAccessor: 'anticlockwise',
      },
      {
        UIComponent: props => (
          <BorderStrokeTool {...props} suffix='pt' max={20} />
        ),
        onChangeEvent: 'update:image:strokeWidth',
        tooltip: 'Border Size',
        defaultValues: {
          strokeWidth: 1,
        },
        valueAccessor: 'strokeWidth',
      },
      {
        UIComponent: BorderStrokeColorTool,
        onChangeEvent: 'update:image:strokeColor',
        tooltip: 'Border Color',
        valueAccessor: 'strokeColor',
        defaultValues: {
          strokeColor: COLOR_TOOLS_DEFAULT_COLOR,
        },
      },
      {
        UIComponent: OpacityTool,
        onChangeEvent: 'update:image:opacity',
        tooltip: 'Opacity',
        valueAccessor: 'opacity',
      },
    ],
  };
