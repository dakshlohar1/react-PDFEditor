import { FunctionComponent } from 'react';
import { DEFAULT_OPACITY } from '../../constants';

import { usePDFEditorContext } from '../../editor-provider';
import { onChangeEventNameProps } from '../../types';
import { OpacityToolIcon } from '../icons/pdf-editor-icons';
import {
  CommonSliderInput,
  CommonSliderInputProps,
} from './common-slider-input';

export type OpacityToolProps = CommonSliderInputProps & onChangeEventNameProps;

export const OpacityTool: FunctionComponent<OpacityToolProps> = props => {
  const { onChangeEvent, defaultValues, valueAccessor } = props;
  const { eventBus } = usePDFEditorContext();
  const accessor = valueAccessor || 'opacity';

  const handleChange = (value: number) => {
    eventBus.dispatch(onChangeEvent, { [accessor]: value });
  };

  return (
    <CommonSliderInput
      {...props}
      defaultValue={defaultValues?.[accessor] as number}
      min={0}
      max={DEFAULT_OPACITY}
      step={0.05}
      icon={({ opacity }) => (
        <OpacityToolIcon
          boxSize='20px'
          fillOpacity={
            (((opacity as number) + 0.2) * DEFAULT_OPACITY * 100) / 100
          }
          alignSelf='center'
          m='16px'
        />
      )}
      onChange={handleChange}
    />
  );
};
