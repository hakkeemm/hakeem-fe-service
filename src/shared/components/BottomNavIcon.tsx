import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '../theme/colors';

export type BottomNavIconName = 'home' | 'doctor' | 'calendar' | 'profile' | 'plus';

interface BottomNavIconProps {
  name: BottomNavIconName;
  color?: string;
  size?: number;
  /** @deprecated Use `active` instead */
  filled?: boolean;
  active?: boolean;
}

const STROKE = 1.75;

function strokeProps(color: string, active: boolean) {
  return {
    fill: 'none' as const,
    stroke: color,
    strokeWidth: active ? 2.1 : STROKE,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

export function BottomNavIcon({
  name,
  color = colors.navInactive,
  size = 24,
  filled,
  active: activeProp,
}: BottomNavIconProps) {
  const active = activeProp ?? filled ?? false;

  switch (name) {
    case 'home':
      return <Ionicons name={active ? 'home' : 'home-outline'} size={size} color={color} />;

    case 'doctor':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path {...strokeProps(color, active)} d="M6.75 3.5v2M17.25 3.5v2" />
          <Path
            {...strokeProps(color, active)}
            d="M6.75 5.5h-1.5a1.75 1.75 0 0 0-1.75 1.75v3.75a5.25 5.25 0 0 0 10.5 0V7.25a1.75 1.75 0 0 0-1.75-1.75h-1.5"
          />
          <Path {...strokeProps(color, active)} d="M9.25 14.75a5.25 5.25 0 0 0 9.5 0v-2" />
          <Circle
            cx={18.75}
            cy={10.25}
            r={2}
            fill={active ? color : 'none'}
            stroke={color}
            strokeWidth={active ? 0 : STROKE}
          />
        </Svg>
      );

    case 'calendar':
      return (
        <Ionicons name={active ? 'calendar' : 'calendar-outline'} size={size} color={color} />
      );

    case 'profile':
      return <Ionicons name={active ? 'person' : 'person-outline'} size={size} color={color} />;

    case 'plus':
      return <Ionicons name="add" size={size} color={color} />;

    default:
      return null;
  }
}
