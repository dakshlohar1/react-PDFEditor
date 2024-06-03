import { ComponentWithAs, IconProps } from '@chakra-ui/react';
import {
  AddImageIcon,
  CalloutTextBoxIcon,
  HandIcon,
  NavigationArrowIcon,
  SampleTextIcon,
  ShapesIcon,
  TextBoxIcon,
  TextSelectionTool,
} from '../components/icons';

export type ActionGroup = 'select-tool' | 'annotations';

export type Actions =
  | 'Hand'
  | 'Select Markup'
  | 'Select Text'
  | 'Textbox'
  | 'Shapes'
  | 'Dimension'
  | 'Callout Textbox'
  | 'Add Image'
  | 'Outline Pen'
  | 'Sample Markups'
  | 'Select';

// Define the type for an action
export type Action = {
  group: string;
  action: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  icon: ComponentWithAs<'svg', IconProps>;
  label?: string;
};

export const primaryToolbarItems: Action[] = [
  {
    action: 'Hand',
    group: 'select-tool',
    icon: HandIcon,
    isSelected: true,
  },
  {
    action: 'Select Markup',
    group: 'select-tool',
    icon: NavigationArrowIcon,
  },
  {
    action: 'Select Text',
    group: 'select-tool',
    icon: TextSelectionTool,
  },
  {
    action: 'Textbox',
    group: 'annotations',
    icon: TextBoxIcon,
  },
  {
    action: 'Shapes',
    group: 'annotations',
    icon: ShapesIcon,
  },
  {
    action: 'Callout Textbox',
    group: 'annotations',
    icon: CalloutTextBoxIcon,
  },
  {
    action: 'Add Image',
    group: 'annotations',
    icon: AddImageIcon,
  },
  {
    action: 'Sample Markups',
    group: 'annotations',
    icon: SampleTextIcon,
  },
];
