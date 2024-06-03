import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const SquareIcon = (props: IconProps) => (
  <Icon viewBox='0 0 25 25' strokeOpacity={0.5} {...props} fill='none'>
    <g clipPath='url(#clip0_11138_44287)'>
      <path
        d='M0.796875 20.374V0.374023H20.7969V20.374H0.796875ZM2.79688 17.874H18.7969V2.87402H2.79688V17.874Z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='clip0_11138_44287'>
        <rect
          width='20'
          height='20'
          fill='white'
          transform='translate(0.789062 0.374023)'
        />
      </clipPath>
    </defs>
  </Icon>
);
