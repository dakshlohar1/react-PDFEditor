import { FunctionComponent } from 'react';
import { ColorPickerToolComponentProps } from '..';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { FontColorIcon } from '../icons';
import {
  CommonColorPicker,
  CommonColorPickerProps,
} from './common-color-picker';

export type FontColorToolProps = CommonColorPickerProps &
  onChangeEventNameProps;

export const FontColorTool: FunctionComponent<FontColorToolProps> = props => {
  const { onChangeEvent, defaultValues, valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'fontColor';

  const handleChange = (value: string) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: value });
  };
  return (
    <CommonColorPicker
      {...props}
      defaultValue={defaultValues?.[accessor] as string}
      icon={({ componentProps }) => {
        const { color } = componentProps as ColorPickerToolComponentProps;
        return <FontColorIcon boxSize='20px' color={color} />;
      }}
      onChange={handleChange}
    />
  );
};
