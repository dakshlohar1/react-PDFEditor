import { FunctionComponent } from 'react';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { FontSizeIcon } from '../icons/pdf-editor-icons';
import {
  CommonDropdownInput,
  CommonDropdownInputProps,
} from './common-drop-down';

export type FontSizeToolProps = CommonDropdownInputProps &
  onChangeEventNameProps;

export const FontSizeTool: FunctionComponent<FontSizeToolProps> = props => {
  const { onChangeEvent, defaultValues,valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'fontSize';

  const handleChange = (value: string) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: parseInt(value, 10) });
  };
  return (
    <CommonDropdownInput
      {...props}
      defaultValue={defaultValues?.[accessor] as string}
      icon={() => <FontSizeIcon />}
      inputWidth={68}
      onChange={handleChange}
    />
  );
};
