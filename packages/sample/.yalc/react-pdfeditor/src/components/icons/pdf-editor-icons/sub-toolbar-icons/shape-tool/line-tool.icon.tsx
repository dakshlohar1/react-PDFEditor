import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const LineIcon = (props: IconProps) => (
  <Icon viewBox='0 0 25 25' fillOpacity={0.5} {...props}>
    <path
      d='M21.7891 12.374L3.78906 12.374'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </Icon>
);
