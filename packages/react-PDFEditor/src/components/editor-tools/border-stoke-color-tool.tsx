import { Icon } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { FilledUpArrow } from '../icons';
import { BorderColorIcon } from '../icons/pdf-editor-icons';
import {
  ColorPickerToolComponentProps,
  CommonColorPicker,
  CommonColorPickerProps,
} from './common-color-picker';

export type BorderStrokeColorToolProps = CommonColorPickerProps &
  onChangeEventNameProps;
export const BorderStrokeColorTool: FunctionComponent<
  BorderStrokeColorToolProps
> = props => {
  const { onChangeEvent, defaultValues, valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'strokeColor';

  const handleChange = (value: string) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: value });
  };

  return (
    <CommonColorPicker
      {...props}
      defaultValue={defaultValues?.[accessor] as string}
      icon={({ componentProps }) => {
        const { isOpen, color } =
          componentProps as ColorPickerToolComponentProps;
        return (
          <>
            <BorderColorIcon boxSize='20px' color={color} />
            <Icon
              as={FilledUpArrow}
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              w='7px'
              h='4.67px'
            />
          </>
        );
      }}
      onChange={handleChange}
    />
  );
};
