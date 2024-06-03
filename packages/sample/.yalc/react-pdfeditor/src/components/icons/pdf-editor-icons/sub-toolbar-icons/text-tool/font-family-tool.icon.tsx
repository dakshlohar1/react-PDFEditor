import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export const FontFamilyIcon = (props: IconProps) => (
  <Icon viewBox='0 0 25 24' {...props} fill='none'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12.5485 22.0322C13.1423 21.833 12.7871 22.043 13.1836 21.7125C13.5801 21.3821 13.6258 20.8882 13.6258 20.3447V5.01886H20.9097C22.2691 5.01886 22.9488 4.52049 22.9488 3.52555C22.9488 2.5306 22.2647 2.03223 20.9075 2.03223H4.15239C2.79298 2.03223 2.11328 2.5306 2.11328 3.52555C2.11328 4.52049 2.79298 5.01886 4.15239 5.01886H10.3394V20.2301C10.3394 20.7755 10.5355 21.2106 10.9342 21.5393C11.3328 21.8679 11.8731 22.0322 12.5485 22.0322Z'
      fill='currentColor'
    />
  </Icon>
);
