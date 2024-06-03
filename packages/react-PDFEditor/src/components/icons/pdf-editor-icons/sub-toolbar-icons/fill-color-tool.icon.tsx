import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const FillColorIcon = (props: IconProps) => (
  <Icon viewBox='0 0 25 25' {...props} fill='none'>
    <rect x='0.789062' y='0.374023' width='24' height='24' fill='currenColor' />
  </Icon>
);
