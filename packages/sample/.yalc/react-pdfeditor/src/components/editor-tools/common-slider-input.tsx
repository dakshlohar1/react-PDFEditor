import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

import { SubToolBarButtonProps } from '../../types';
import { SubToolBarButtonContainer } from '../containers';
import { SubToolbarItemTooltip } from '../tooltips';

export type CommonSliderInputProps = SubToolBarButtonProps & {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
};

export const CommonSliderInput: FC<CommonSliderInputProps> = ({
  min = 0,
  max = 100,
  defaultValue = max,
  onChange,
  tooltip,
  icon: SideComponent,
  isDisabled,
  step,
}) => {
  const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;
  const [value, setValue] = useState(defaultValue);

  const handleChange = (value: number | string) => {
    // allow float values
    const parsedValue = parseFloat(value as string);
    if (typeof value === 'string') {
      setValue(parsedValue);
    } else {
      setValue(value);
    }
    if (typeof onChange === 'function') {
      onChange(parsedValue);
    }
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(+defaultValue || max);
    }
  }, [defaultValue, max]);

  return (
    <SubToolbarItemTooltip tooltip={tooltip} disabled={disabled}>
      <SubToolBarButtonContainer isDisabled={disabled}>
        {SideComponent && <SideComponent opacity={value} />}
        <Flex flex='1' align='center'>
          <NumberInput
            size='xs'
            maxW={10}
            minW={10}
            defaultValue={defaultValue}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            mr='2'
          >
            <NumberInputStepper maxW='0px' />
            <NumberInputField p='0' pl='1' />
          </NumberInput>
          <Slider
            aria-label='slider-ex-2'
            min={min}
            max={max}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            minW='80px'
            step={step}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack bg='blackAlpha.700' />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Flex>
      </SubToolBarButtonContainer>
    </SubToolbarItemTooltip>
  );
};
