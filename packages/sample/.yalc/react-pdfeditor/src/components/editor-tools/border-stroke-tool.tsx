import { FunctionComponent } from 'react';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { BorderSizeIcon } from '../icons/pdf-editor-icons';
import {
  CommonNumberInput,
  CommonNumberInputProps,
} from './common-number-input';

export type BorderStrokeToolProps = CommonNumberInputProps &
  onChangeEventNameProps ;

export const BorderStrokeTool: FunctionComponent<
  BorderStrokeToolProps
> = props => {
  const { onChangeEvent,defaultValues, valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'strokeWidth';

  const handleChange = (value: number) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: value });
  };

  return (
    <CommonNumberInput
      {...props}
      defaultValue={defaultValues?.[accessor] as number}
      icon={() => <BorderSizeIcon />}
      onChange={handleChange}
    />
  );
};
