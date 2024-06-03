import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const OpacityToolIcon = (props: IconProps) => (
  <Icon viewBox='0 0 24 24' {...props} fill='none'>
    <g clipPath='url(#a)'>
      <path stroke='black' strokeWidth='0.5' d='M1.75 1.751h20.5v20.5H1.75z' />
      <path
        d='M6 2.001H2v4h4v-4ZM14 2.001h-4v4h4v-4ZM18 6.001h-4v4h4v-4ZM10 6.001H6v4h4v-4ZM22 2.001h-4v4h4v-4ZM6 10.001H2v4h4v-4ZM14 10.001h-4v4h4v-4ZM18 14.001h-4v4h4v-4ZM10 14.001H6v4h4v-4ZM22 10.001h-4v4h4v-4ZM6 18.001H2v4h4v-4ZM14 18.001h-4v4h4v-4ZM22 18.001h-4v4h4v-4Z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' transform='translate(0 .001)' d='M0 0h24v24H0z' />
      </clipPath>
    </defs>
  </Icon>
);
