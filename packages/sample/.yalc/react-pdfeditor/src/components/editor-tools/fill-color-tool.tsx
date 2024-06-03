import { Box, Icon } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { FilledUpArrow } from '../icons';
import {
  CommonColorPicker,
  CommonColorPickerProps,
  ColorPickerToolComponentProps,
} from './common-color-picker';

export type FillColorToolProps = CommonColorPickerProps &
  onChangeEventNameProps;

export const FillColorTool: FunctionComponent<FillColorToolProps> = props => {
  const { onChangeEvent, defaultValues, valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'value';

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
            <Box
              w='20px'
              h='20px'
              bg={color}
              border='1px solid'
              borderColor='gray.200'
            />
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
