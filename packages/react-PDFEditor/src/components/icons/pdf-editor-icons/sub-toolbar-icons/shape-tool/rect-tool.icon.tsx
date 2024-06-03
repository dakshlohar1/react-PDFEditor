import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const RectangleIcon = (props: IconProps) => (
  <Icon viewBox='0 0 25 25' strokeOpacity={0.5} {...props} fill='none'>
    <g clipPath='url(#clip0_11138_44289)'>
      <path
        d='M0.792969 16.374V0.374023H20.793V16.374H0.792969ZM2.79297 14.374H18.793V2.37402H2.79297V14.374Z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='clip0_11138_44289'>
        <rect
          width='20'
          height='16'
          fill='white'
          transform='translate(0.789062 0.374023)'
        />
      </clipPath>
    </defs>
  </Icon>
);
