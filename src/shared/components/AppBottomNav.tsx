import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useRTL } from '../hooks/useRTL';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { BottomNavIcon, type BottomNavIconName } from './BottomNavIcon';

const BAR_HEIGHT = 64;
const FAB_SIZE = 64;
const NOTCH_WIDTH = 88;
const NOTCH_DEPTH = 34;
const FAB_OVERHANG = FAB_SIZE / 2;

export type AppBottomNavItemConfig = {
  /** Route name in the tab navigator */
  routeName: string;
  label: string;
  icon: BottomNavIconName;
};

export type AppBottomNavProps = BottomTabBarProps & {
  items: AppBottomNavItemConfig[];
  /** Optional center FAB action (shown between left and right item pairs). */
  centerAction?: {
    accessibilityLabel: string;
    onPress: () => void;
  };
};

function buildNotchPath(width: number, height: number): string {
  const mid = width / 2;
  const notchHalf = NOTCH_WIDTH / 2;
  const left = mid - notchHalf;
  const right = mid + notchHalf;
  const radius = 18;

  return [
    `M0,${radius}`,
    `Q0,0 ${radius},0`,
    `H${left}`,
    `C${left + 14},0 ${mid - 28},${NOTCH_DEPTH} ${mid},${NOTCH_DEPTH}`,
    `C${mid + 28},${NOTCH_DEPTH} ${right - 14},0 ${right},0`,
    `H${width - radius}`,
    `Q${width},0 ${width},${radius}`,
    `V${height}`,
    `H0`,
    `Z`,
  ].join(' ');
}

export function AppBottomNav({ state, descriptors, navigation, items, centerAction }: AppBottomNavProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isRTL } = useRTL();
  const bottomPad = Math.max(insets.bottom, spacing.sm);
  const totalHeight = BAR_HEIGHT + bottomPad;

  const routeConfigByName = useMemo(() => {
    return new Map(items.map((item) => [item.routeName, item]));
  }, [items]);

  const orderedRoutes = useMemo(() => {
    const byName = new Map(state.routes.map((route) => [route.name, route]));
    return items
      .map((item) => byName.get(item.routeName))
      .filter((route): route is (typeof state.routes)[number] => Boolean(route));
  }, [items, state.routes]);

  const midpoint = Math.ceil(orderedRoutes.length / 2);
  const leftRoutes = orderedRoutes.slice(0, midpoint);
  const rightRoutes = orderedRoutes.slice(midpoint);
  const visualLeft = isRTL ? rightRoutes : leftRoutes;
  const visualRight = isRTL ? leftRoutes : rightRoutes;

  const renderTab = (route: (typeof state.routes)[number]) => {
    const routeIndex = state.routes.findIndex((item) => item.key === route.key);
    const isFocused = state.index === routeIndex;
    const config = routeConfigByName.get(route.name);
    const label = config?.label ?? descriptors[route.key]?.options.title ?? route.name;
    const icon = config?.icon ?? 'profile';
    const color = isFocused ? colors.navActive : colors.navInactive;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={label}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tab}
      >
        <BottomNavIcon name={icon} color={color} filled={isFocused && icon === 'home'} />
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrapper, { height: totalHeight }]} pointerEvents="box-none">
      <View style={[styles.barHost, { height: totalHeight }]}>
        <Svg width={width} height={totalHeight} style={StyleSheet.absoluteFill}>
          <Path d={buildNotchPath(width, totalHeight)} fill={colors.surface} />
        </Svg>

        <View style={[styles.row, { paddingBottom: bottomPad, height: totalHeight }]}>
          <View style={styles.side}>{visualLeft.map(renderTab)}</View>
          <View style={styles.fabSpacer} />
          <View style={styles.side}>{visualRight.map(renderTab)}</View>
        </View>
      </View>

      {centerAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={centerAction.accessibilityLabel}
          onPress={centerAction.onPress}
          style={[styles.fab, { top: -FAB_OVERHANG }]}
        >
          <BottomNavIcon name="plus" color={colors.surface} size={28} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  barHost: {
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -2 },
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  fabSpacer: {
    width: NOTCH_WIDTH,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.navFab,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.navFab,
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
});
