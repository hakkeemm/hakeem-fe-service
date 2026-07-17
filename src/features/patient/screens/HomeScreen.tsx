import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { AdsSlider } from '../../../shared/components/ads';
import {
  ExpandableSearchPanel,
  NotificationButton,
  UserGreeting,
  getGreetingKey,
  homeHeaderColors,
} from '../../../shared/components/homeHeader';
import { useRTL } from '../../../shared/hooks/useRTL';
import { useAuthStore } from '../../../shared/store/authStore';
import { spacing } from '../../../shared/theme/spacing';
import { getMockHomeAdsSlides } from '../data/mockDoctors';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';
import type { PatientTabParamList } from '../navigation/PatientTabNavigator';

type HomeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<PatientTabParamList, 'Home'>,
  NativeStackNavigationProp<PatientStackParamList>
>;

const ACTION_GAP = spacing.sm;
const ANIMATION_MS = 300;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function configureHeaderAnimation() {
  LayoutAnimation.configureNext({
    duration: ANIMATION_MS,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  });
}

export function HomeScreen() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const navigation = useNavigation<HomeNavigation>();
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const greetingOpacity = useRef(new Animated.Value(1)).current;

  const greeting = useMemo(() => t(getGreetingKey()), [t]);
  const displayName = user?.name?.split(' ')[0] || user?.name || t('common.appName');

  const adSlides = useMemo(
    () =>
      getMockHomeAdsSlides({
        lookingForDoctor: t('patient.lookingForDoctor'),
        specialists: t('patient.adSpecialists'),
        healthTips: t('patient.adHealthTips'),
        connect: t('patient.connect'),
      }),
    [t],
  );

  useEffect(() => {
    Animated.timing(greetingOpacity, {
      toValue: isSearchExpanded ? 0 : 1,
      duration: ANIMATION_MS * 0.7,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [greetingOpacity, isSearchExpanded]);

  const setSearchExpanded = (expanded: boolean) => {
    configureHeaderAnimation();
    setIsSearchExpanded(expanded);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topRow, isRTL && styles.topRowRtl]}>
          {!isSearchExpanded ? (
            <Animated.View style={[styles.greetingWrap, { opacity: greetingOpacity }]}>
              <UserGreeting
                name={displayName}
                greeting={greeting}
                onPress={() => navigation.navigate('Profile')}
              />
            </Animated.View>
          ) : null}

          <View
            style={[
              styles.actions,
              isRTL && styles.actionsRtl,
              isSearchExpanded && styles.actionsExpanded,
            ]}
          >
            <ExpandableSearchPanel
              expanded={isSearchExpanded}
              onExpandedChange={setSearchExpanded}
              accessibilityLabel={t('patient.search')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('patient.searchDoctors')}
              returnKeyType="search"
              onSubmitEditing={() => navigation.navigate('Search')}
              filter={{
                accessibilityLabel: t('common.filter'),
                onPress: () => navigation.navigate('Filter'),
              }}
            />
            <NotificationButton
              hasUnread
              accessibilityLabel={t('common.notifications')}
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>
        </View>

        <AdsSlider
          slides={adSlides}
          connectLabel={t('patient.connect')}
          onConnect={() => navigation.navigate('Search')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeHeaderColors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 44,
  },
  topRowRtl: {
    flexDirection: 'row-reverse',
  },
  greetingWrap: {
    flex: 1,
    minWidth: 0,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ACTION_GAP,
    flexShrink: 0,
  },
  actionsExpanded: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  actionsRtl: {
    flexDirection: 'row-reverse',
  },
});
