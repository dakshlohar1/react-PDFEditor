import { Box, Tooltip, TooltipProps } from '@chakra-ui/react';
import { FunctionComponent } from 'react';

type SubToolbarItemTooltipProps = TooltipProps & {
  tooltip: string;
  disabled?: boolean;
};

export const SubToolbarItemTooltip: FunctionComponent<
  SubToolbarItemTooltipProps
> = ({ tooltip, disabled = false, children, ...tooltipProps }) => {
  return (
    <Tooltip
      {...tooltipProps}
      label={tooltip}
      aria-label={tooltip}
      isDisabled={disabled}
      hasArrow
      placement='top'
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <Box h='100%'>{children}</Box>
    </Tooltip>
  );
};
