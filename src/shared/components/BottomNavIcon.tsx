import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '../theme/colors';

export type BottomNavIconName = 'home' | 'doctor' | 'calendar' | 'profile' | 'plus';

interface BottomNavIconProps {
  name: BottomNavIconName;
  color?: string;
  size?: number;
  filled?: boolean;
}

export function BottomNavIcon({
  name,
  color = colors.navInactive,
  size = 24,
  filled = false,
}: BottomNavIconProps) {
  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          {filled ? (
            <Path
              fill={color}
              d="M12 3.2 3.8 10.2c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0l.6-.5V19c0 1.1.9 2 2 2h2.5c.6 0 1-.4 1-1v-3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V20c0 .6.4 1 1 1H17c1.1 0 2-.9 2-2v-8.2l.6.5c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L12 3.2Z"
            />
          ) : (
            <Path
              fill="none"
              stroke={color}
              strokeWidth={1.8}
              strokeLinejoin="round"
              d="M4.5 10.5 12 4.5l7.5 6V19a1.5 1.5 0 0 1-1.5 1.5h-3.2V15a2.3 2.3 0 0 0-2.3-2.3h0A2.3 2.3 0 0 0 8.2 15v5.5H5A1.5 1.5 0 0 1 3.5 19v-8.5Z"
            />
          )}
        </Svg>
      );
    case 'doctor':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          />
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"
          />
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            d="M17.2 8.2v3.2M15.6 9.8h3.2"
          />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.5 5.5h11A2 2 0 0 1 19.5 7.5v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"
          />
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            d="M8 3.8v3.2M16 3.8v3.2M4.5 9.5h15"
          />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          />
          <Path
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"
          />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={9} fill="none" stroke={color} strokeWidth={1.6} />
          <Path
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            d="M12 8v8M8 12h8"
          />
        </Svg>
      );
    default:
      return null;
  }
}
