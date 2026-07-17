import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export function HeaderSearchIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx={11} cy={11} r={6.5} fill="none" stroke={color} strokeWidth={1.8} />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        d="M16.5 16.5 20 20"
      />
    </Svg>
  );
}
