import React, { useEffect } from 'react';
import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import type { AdsMediaSource } from './adsTypes';

interface AdsCardMediaProps {
  media: AdsMediaSource;
  isActive: boolean;
}

function AdsVideoMedia({
  source,
  poster,
  isActive,
}: {
  source: number | string;
  poster?: ImageSourcePropType;
  isActive: boolean;
}) {
  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
      return;
    }
    player.pause();
  }, [isActive, player]);

  return (
    <View style={styles.mediaFill}>
      {poster ? <Image source={poster} style={styles.mediaFill} resizeMode="cover" /> : null}
      <VideoView
        player={player}
        style={styles.mediaFill}
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />
    </View>
  );
}

export function AdsCardMedia({ media, isActive }: AdsCardMediaProps) {
  if (media.type === 'image') {
    return <Image source={media.source} style={styles.mediaFill} resizeMode="cover" />;
  }

  if (!isActive && media.poster) {
    return <Image source={media.poster} style={styles.mediaFill} resizeMode="cover" />;
  }

  return <AdsVideoMedia source={media.source} poster={media.poster} isActive={isActive} />;
}

const styles = StyleSheet.create({
  mediaFill: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
