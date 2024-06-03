import { FunctionComponent } from 'react';
import { ColorPickerToolComponentProps } from '..';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { FontBackgroundColorIcon } from '../icons/pdf-editor-icons';
import {
  CommonColorPicker,
  CommonColorPickerProps,
} from './common-color-picker';

export type FontBackgroundColorToolProps = CommonColorPickerProps &
  onChangeEventNameProps;

export const FontBackgroundColorTool: FunctionComponent<
  FontBackgroundColorToolProps
> = props => {
  const { onChangeEvent, defaultValues, valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'backgroundColor';

  const handleChange = (value: string) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: value });
  };
  return (
    <CommonColorPicker
      {...props}
      defaultValue={defaultValues?.[accessor] as string}
      icon={({ componentProps }) => {
        const { color } = componentProps as ColorPickerToolComponentProps;
        return <FontBackgroundColorIcon boxSize='20px' color={color} />;
      }}
      onChange={handleChange}
    />
  );
};
