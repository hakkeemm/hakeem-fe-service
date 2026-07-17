import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { AdsSlider } from '../../../shared/components/ads';
import {
  CurvedHeaderBackground,
  NotificationButton,
  UserGreeting,
  getGreetingKey,
  homeHeaderColors,
} from '../../../shared/components/homeHeader';
import { useRTL } from '../../../shared/hooks/useRTL';
import { useAuthStore } from '../../../shared/store/authStore';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { DoctorCategoriesSection } from '../components/DoctorCategoriesSection';
import { PopularDoctorsSection } from '../components/PopularDoctorsSection';
import { getMockHomeAdsSlides } from '../data/mockDoctors';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';
import type { PatientTabParamList } from '../navigation/PatientTabNavigator';
import { usePatientProfileStore } from '../store/patientProfileStore';

type HomeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<PatientTabParamList, 'Home'>,
  NativeStackNavigationProp<PatientStackParamList>
>;

export function HomeScreen() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const navigation = useNavigation<HomeNavigation>();
  const user = useAuthStore((state) => state.user);
  const profileDisplayName = usePatientProfileStore((state) => state.displayName);
  const avatarUri = usePatientProfileStore((state) => state.avatarUri);
  const hydrateFromAuthUser = usePatientProfileStore((state) => state.hydrateFromAuthUser);

  const greeting = useMemo(() => t(getGreetingKey()), [t]);
  const fullName = (profileDisplayName || user?.name || '').trim() || t('common.appName');
  const displayName = fullName.split(' ')[0] || fullName;

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
    void hydrateFromAuthUser(user ? { id: user.id, name: user.name } : null);
  }, [hydrateFromAuthUser, user]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CurvedHeaderBackground color={colors.primary}>
          <View style={[styles.topRow, isRTL && styles.topRowRtl]}>
            <View style={styles.greetingWrap}>
              <UserGreeting
                name={displayName}
                greeting={greeting}
                avatarUri={avatarUri || null}
                tone="onPrimary"
                onPress={() => navigation.navigate('Profile')}
              />
            </View>

            <NotificationButton
              hasUnread
              tone="onPrimary"
              accessibilityLabel={t('common.notifications')}
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>
        </CurvedHeaderBackground>

        <View style={styles.body}>
          <AdsSlider
            slides={adSlides}
            connectLabel={t('patient.connect')}
            onConnect={() => navigation.navigate('Search')}
          />

          <DoctorCategoriesSection
            onSeeAllPress={() => navigation.navigate('FindYourDoctor')}
            onCategoryPress={() => navigation.navigate('Search')}
          />

          <PopularDoctorsSection
            onSeeAllPress={() => navigation.navigate('Search')}
            onDoctorPress={(doctor) => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
            onBookPress={(doctor) => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeHeaderColors.background,
  },
  scrollContent: {
    // Extra space so the last cards clear the floating center FAB
    paddingBottom: spacing.xxl + 32,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
});
