import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import { COLOR_TOOLS_DEFAULT_COLOR } from '../../constants';
import { SubToolBarButtonProps } from '../../types';
import { SubToolBarButtonContainer } from '../containers';
import { SubToolbarItemTooltip } from '../tooltips';

export type ColorPickerToolComponentProps = {
  isOpen: boolean;
  color: string;
};
export type CommonColorPickerProps = SubToolBarButtonProps & {
  defaultValue?: string;
  onChange?: (color: string) => void;
};

/**
 * CommonColorPicker component is a color picker component that can be used in the toolbar.
 * @example
 * <CommonColorPicker
 *  defaultValues={{ color: '#000088' }}
 * onChangeEvent='color-change'
 * isDisabled={false}
 * TriggerComponent={
 * <Flex
 *  w='56px'
 *  h='100%'
 *  _hover={{ bg: 'gray.100' }}
 *  align='center'
 *  justify='center'
 *  gap='6px'
 *  cursor={isDisabled ? 'not-allowed' : 'pointer'}
 * >
 *  <Box
 *    w='25px'
 *    h='25px'
 *    bg={color}
 *    border='1px solid'
 *    borderColor='gray.200'
 *  />
 *  <Icon
 *    as={FilledUpArrow}
 *    transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
 *  />
 * </Flex> }
 * />
 * @param props
 * @returns
 */
export const CommonColorPicker: FC<CommonColorPickerProps> = ({
  defaultValue,
  onChange,
  isDisabled,
  icon: TriggerComponent,
  tooltip,
}) => {
  const [color, setColor] = useState<string>(
    defaultValue || COLOR_TOOLS_DEFAULT_COLOR,
  );

  const handleColorChange = (color: string) => {
    setColor(color);

    if (onChange) {
      onChange(color);
    }
  };
  const disabled = typeof isDisabled === 'function' ? isDisabled() : isDisabled;

  useEffect(() => {
    setColor(defaultValue || COLOR_TOOLS_DEFAULT_COLOR);
  }, [defaultValue]);

  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <SubToolbarItemTooltip tooltip={tooltip} disabled={disabled}>
            <PopoverTrigger>
              <Box>
                <SubToolBarButtonContainer
                  isDisabled={disabled}
                  shouldApplyStyles
                >
                  {TriggerComponent && (
                    <TriggerComponent componentProps={{ isOpen, color }} />
                  )}
                </SubToolBarButtonContainer>
              </Box>
            </PopoverTrigger>
          </SubToolbarItemTooltip>
          <Portal>
            <PopoverContent
              w='min-content'
              border='none'
              bg='transparent'
              pos='relative'
            >
              <PopoverBody
                p='0'
                m='0'
                position='absolute'
                top='calc(100% + 2px)'
                left='0'
              >
                <HexAlphaColorPicker
                  color={color}
                  onChange={handleColorChange}
                />
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
};
