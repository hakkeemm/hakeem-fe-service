import React from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const CURVE_DEPTH = 28;

export interface CurvedHeaderBackgroundProps {
  children: React.ReactNode;
  color?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Full-bleed header with a soft downward curve at the bottom (primary brand by default).
 */
export function CurvedHeaderBackground({
  children,
  color = colors.primary,
  style,
  contentStyle,
}: CurvedHeaderBackgroundProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = React.useState(0);

  const totalHeight = insets.top + contentHeight + CURVE_DEPTH;
  const curveStartY = Math.max(totalHeight - CURVE_DEPTH, 0);
  const midX = width / 2;

  const path = [
    `M0,0`,
    `H${width}`,
    `V${curveStartY}`,
    `Q${midX},${totalHeight} 0,${curveStartY}`,
    `Z`,
  ].join(' ');

  return (
    <View style={[styles.wrapper, totalHeight > 0 ? { height: totalHeight } : null, style]}>
      {totalHeight > 0 ? (
        <Svg width={width} height={totalHeight} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Path d={path} fill={color} />
        </Svg>
      ) : null}

      <View style={{ paddingTop: insets.top }}>
        <View
          style={[styles.content, contentStyle]}
          onLayout={(event) => {
            const next = event.nativeEvent.layout.height;
            if (next > 0 && Math.abs(next - contentHeight) > 1) {
              setContentHeight(next);
            }
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
