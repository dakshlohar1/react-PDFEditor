import { FunctionComponent } from 'react';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { FontFamilyIcon } from '../icons/pdf-editor-icons';
import {
  CommonDropdownInput,
  CommonDropdownInputProps,
} from './common-drop-down';

export type FontFamilySelectionToolProps = CommonDropdownInputProps &
  onChangeEventNameProps;

export const FontFamilySelectionTool: FunctionComponent<
  FontFamilySelectionToolProps
> = props => {
  const { onChangeEvent, defaultValues, valueAccessor } = props;
  const accessor = valueAccessor || 'fontFamily';
  const { eventBus } = usePDFEditorContext();

  const handleChange = (value: string) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: value });
  };
  return (
    <CommonDropdownInput
      {...props}
      defaultValue={defaultValues?.[accessor] as string}
      icon={() => <FontFamilyIcon />}
      inputWidth={171}
      onChange={handleChange}
    />
  );
};
