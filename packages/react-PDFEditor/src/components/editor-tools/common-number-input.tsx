import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

import { SubToolBarButtonProps } from '../../types';
import { SubToolBarButtonContainer } from '../containers';
import { SubToolbarItemTooltip } from '../tooltips';

export type CommonNumberInputProps = SubToolBarButtonProps & {
  min?: number;
  max?: number;
  suffix?: string; // New prop for suffix
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export const CommonNumberInput: FC<CommonNumberInputProps> = ({
  min = 0,
  max = 100,
  defaultValue = max,
  onChange,
  tooltip,
  icon: IconComponent,
  suffix = '', // New prop for suffix
  isDisabled,
}) => {
  const [valueWithSuffix, setValueWithSuffix] = useState(
    `${defaultValue}${suffix}`,
  );
  const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;

  const handleChange = (valueAsString: string, valueAsNumber: number) => {
    if (isNaN(valueAsNumber)) return;
    if (valueAsString !== removeSuffix(valueWithSuffix)) {
      setValueWithSuffix(`${valueAsString}${suffix}`);
      if (typeof onChange === 'function') {
        onChange(valueAsNumber);
      }
    }
  };

  const removeSuffix = (value: string) => {
    return suffix ? value.replace(suffix, '') : value;
  };

  useEffect(() => {
    if (defaultValue === undefined) return;
    setValueWithSuffix(`${defaultValue}${suffix}`);
  }, [defaultValue, suffix]);

  return (
    <SubToolbarItemTooltip tooltip={tooltip} disabled={disabled}>
      <SubToolBarButtonContainer isDisabled={disabled}>
        {IconComponent && (
          <IconComponent
            componentProps={{
              value: +removeSuffix(valueWithSuffix),
              min,
              max,
            }}
          />
        )}
        <NumberInput
          size='xs'
          maxW={20}
          minW={20}
          defaultValue={defaultValue}
          min={min}
          max={max}
          onChange={handleChange}
          allowMouseWheel
          value={valueWithSuffix}
          parse={removeSuffix}
          pattern={`[0-9]+${suffix}`}
          isDisabled={disabled}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper border='none' />
            <NumberDecrementStepper border='none' />
          </NumberInputStepper>
        </NumberInput>
      </SubToolBarButtonContainer>
    </SubToolbarItemTooltip>
  );
};
