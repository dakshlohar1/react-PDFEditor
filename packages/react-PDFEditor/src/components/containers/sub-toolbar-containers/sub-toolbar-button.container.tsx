import { Flex, FlexProps } from '@chakra-ui/react';
import { FunctionComponent, MouseEventHandler } from 'react';

type SubToolBarButtonContainerProps = FlexProps & {
  isDisabled?: boolean;

  /**
   * Flag for applying hover and active styles to the container.
   */
  shouldApplyStyles?: boolean;
};

export const SubToolBarButtonContainer: FunctionComponent<
  SubToolBarButtonContainerProps
> = ({
  children,
  onClick,
  isDisabled,
  shouldApplyStyles = false,
  ...flexProps
}) => {
  const handleClick: MouseEventHandler<HTMLDivElement> = event => {
    if (onClick && !isDisabled) {
      onClick(event);
    }
  };

  return (
    <Flex
      justify='center'
      align='center'
      p='16px'
      h='100%'
      gap='8px'
      borderRadius='none'
      userSelect='none'
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      onClick={isDisabled ? undefined : handleClick}
      pointerEvents={isDisabled ? 'none' : 'auto'}
      opacity={isDisabled ? 0.5 : 1}
      _hover={
        shouldApplyStyles && !isDisabled
          ? {
              bg: 'gray.100',
            }
          : undefined
      }
      _active={
        shouldApplyStyles && !isDisabled
          ? {
              bg: 'gray.200',
            }
          : undefined
      }
      {...flexProps}
    >
      {children}
    </Flex>
  );
};
