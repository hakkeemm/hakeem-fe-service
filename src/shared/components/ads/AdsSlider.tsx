import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
  ViewToken,
} from 'react-native';

import { spacing } from '../../theme/spacing';
import { AdsCard, ADS_CARD_HEIGHT } from './AdsCard';
import type { AdsSlide } from './adsTypes';

const DEFAULT_INTERVAL_MS = 4500;

export interface AdsSliderProps {
  slides: AdsSlide[];
  connectLabel: string;
  onConnect?: (slide: AdsSlide) => void;
  /** Auto-advance interval in ms. Set `0` to disable. */
  intervalMs?: number;
  style?: ViewStyle;
}

export function AdsSlider({
  slides,
  connectLabel,
  onConnect,
  intervalMs = DEFAULT_INTERVAL_MS,
  style,
}: AdsSliderProps) {
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<AdsSlide>>(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = windowWidth - spacing.lg * 2;
  const snapInterval = cardWidth + spacing.md;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (first?.index == null) {
      return;
    }
    indexRef.current = first.index;
    setActiveIndex(first.index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const goToIndex = useCallback(
    (nextIndex: number, animated = true) => {
      if (slides.length === 0) {
        return;
      }
      const clamped = ((nextIndex % slides.length) + slides.length) % slides.length;
      listRef.current?.scrollToIndex({ index: clamped, animated });
      indexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1 || intervalMs <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      goToIndex(indexRef.current + 1);
    }, intervalMs);

    return () => clearInterval(timerId);
  }, [goToIndex, intervalMs, slides.length]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const next = Math.round(offset / snapInterval);
    if (next !== indexRef.current && next >= 0 && next < slides.length) {
      indexRef.current = next;
      setActiveIndex(next);
    }
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<AdsSlide>) => (
    <AdsCard
      slide={item}
      width={cardWidth}
      isActive={index === activeIndex}
      connectLabel={connectLabel}
      onConnect={onConnect}
      style={index < slides.length - 1 ? styles.cardSpacing : undefined}
    />
  );

  if (slides.length === 0) {
    return null;
  }

  return (
    <View style={[styles.wrap, style]}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum
        onMomentumScrollEnd={onScrollEnd}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        getItemLayout={(_data, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
        onScrollToIndexFailed={({ index }) => {
          requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({ index, animated: true });
          });
        }}
      />

      {slides.length > 1 ? (
        <View style={styles.dots}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export { ADS_CARD_HEIGHT };

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  cardSpacing: {
    marginEnd: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#C9D1D6',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#148F8A',
  },
});
