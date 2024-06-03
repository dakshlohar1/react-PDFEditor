import { FabricObjectTypes } from '../constants';
import { Actions } from '../constants/primary-tool.constant';

// Event Format: <action>:<tool>:<sub-action>
export type SubToolbarItemEvents =
  // SHAPE
  | 'toggle:shape:stroke'
  | 'rotate:shape:clockwise'
  | 'rotate:shape:anticlockwise'
  | 'add:shape:rectangle'
  | 'add:shape:triangle'
  | 'add:shape:square'
  | 'add:shape:circle'
  | 'add:shape:line'
  | 'add:shape:cloud'
  | 'add:shape:arrow'
  | 'update:shape:strokeColor'
  | 'update:shape:fill'
  | 'update:shape:opacity'
  | 'update:shape:strokeWidth'
  // TEXT BOX
  | 'rotate:text:clockwise'
  | 'rotate:text:anticlockwise'
  | 'toggle:text:bold'
  | 'toggle:text:italic'
  | 'toggle:text:underline'
  | 'update:text:fontFamily'
  | 'update:text:fontSize'
  | 'update:text:fontColor'
  | 'update:text:backgroundColor'
  | 'update:text:textAlign'
  | 'update:text:rectStrokeColor'
  | 'update:text:rectBackgroundColor'
  | 'update:text:opacity'
  // CALL OUT
  | 'rotate:callout:clockwise'
  | 'rotate:callout:anticlockwise'
  | 'toggle:callout:bold'
  | 'toggle:callout:italic'
  | 'toggle:callout:underline'
  | 'update:callout:fontFamily'
  | 'update:callout:fontSize'
  | 'update:callout:fontColor'
  | 'update:callout:backgroundColor'
  | 'update:callout:textAlign'
  | 'update:callout:rectStrokeColor'
  | 'update:callout:rectBackgroundColor'
  | 'update:callout:opacity'
  | 'update:callout:rectStrokeWidth'

  // IMAGE
  | 'rotate:image:clockwise'
  | 'rotate:image:anticlockwise'
  | 'toggle:image:stroke'
  | 'update:image:strokeWidth'
  | 'update:image:strokeColor'
  | 'update:image:opacity';

export type SubToolbarItemDefaultValue = {
  value?: number | string | boolean | undefined;
  clockwise?: boolean;
  anticlockwise?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  underline?: boolean;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  backgroundColor?: string;
  fill?: string;
  textAlign?: string;
  rectStrokeColor?: string;
  rectBackgroundColor?: string;
  rectStrokeWidth?: number;
  border?: boolean;
  shape?: FabricObjectTypes;
};

export type SubToolbarItemValueAccessor = keyof SubToolbarItemDefaultValue;

export type SubToolbarItem = {
  onChangeEvent: SubToolbarItemEvents;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UIComponent: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: SubToolbarItemDefaultValue;
  isDisabled?: boolean | (() => boolean);
  tooltip: string;
  valueClipper?: Record<string | number, string | number | boolean | undefined>;
} & SubToolbarItemValueAccessorProps;

export type ActionableActions = Exclude<
  Actions,
  'Hand' | 'Select Markup' | 'Select Text'
>;

export type ActionAndSubToolbarItemMappingType = Partial<
  Record<ActionableActions, Array<SubToolbarItem>>
>;

export type SubToolBarButtonProps = {
  icon?: React.ElementType<
    SubToolbarItemDefaultValue & {
      componentProps?: Record<string, unknown>;
    }
  >;
  defaultValues?: SubToolbarItemDefaultValue;
  tooltip: string;
  isDisabled?: (() => boolean) | boolean;
  valueClipper?: Record<string | number, string | number | boolean | undefined>;
} & SubToolbarItemValueAccessorProps;

export type onChangeEventNameProps = {
  onChangeEvent: string;
};

export type SubToolbarItemValueAccessorProps = {
  valueAccessor?: SubToolbarItemValueAccessor;
};
