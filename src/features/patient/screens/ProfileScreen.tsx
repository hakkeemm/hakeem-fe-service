import React, { useCallback, useEffect, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { useAuthStore } from '../../../shared/store/authStore';
import { useLogout } from '../../auth/hooks/useAuthMutations';
import {
  PatientProfileActions,
  PatientProfileBookingHistory,
  PatientProfileHero,
  PatientProfileIdentity,
} from '../components/patientProfile';
import { getBookingHistory } from '../data/mockBookings';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';
import type { PatientTabParamList } from '../navigation/PatientTabNavigator';
import { usePatientProfileStore } from '../store/patientProfileStore';

type ProfileNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<PatientTabParamList, 'Profile'>,
  NativeStackNavigationProp<PatientStackParamList>
>;

const PAGE_BACKGROUND = '#F4F6F8';

export function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<ProfileNavigation>();
  const authUser = useAuthStore((state) => state.user);
  const logout = useLogout();

  const displayName = usePatientProfileStore((state) => state.displayName);
  const avatarUri = usePatientProfileStore((state) => state.avatarUri);
  const hydrateFromAuthUser = usePatientProfileStore((state) => state.hydrateFromAuthUser);
  const setDisplayName = usePatientProfileStore((state) => state.setDisplayName);
  const setAvatarUri = usePatientProfileStore((state) => state.setAvatarUri);
  const clearProfile = usePatientProfileStore((state) => state.clear);

  const bookings = useMemo(() => getBookingHistory(), []);

  useEffect(() => {
    void hydrateFromAuthUser(
      authUser ? { id: authUser.id, name: authUser.name } : null,
    );
  }, [authUser, hydrateFromAuthUser]);

  const handleChangePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.error'), t('patient.changePhoto'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await setAvatarUri(result.assets[0].uri);
    }
  }, [setAvatarUri, t]);

  const handleLogout = useCallback(() => {
    Alert.alert(t('common.logout'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.logout'),
        style: 'destructive',
        onPress: () => {
          clearProfile();
          logout.mutate();
        },
      },
    ]);
  }, [clearProfile, logout, t]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero title={t('patient.profile')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PatientProfileIdentity
          displayName={displayName || authUser?.name || ''}
          email={authUser?.email}
          avatarUri={avatarUri}
          onChangePhoto={() => void handleChangePhoto()}
          onSaveName={(name) => {
            void setDisplayName(name);
          }}
        />

        <PatientProfileBookingHistory
          bookings={bookings}
          onDoctorPress={(doctorId) => navigation.navigate('DoctorProfile', { doctorId })}
          onSeeAllPress={() => navigation.navigate('BookingHistory')}
        />

        <PatientProfileActions
          onChangePassword={() => navigation.navigate('ChangePassword')}
          onChangeLanguage={() => navigation.navigate('ProfileLanguage')}
          onLogout={handleLogout}
          logoutLoading={logout.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl + 48,
    gap: spacing.md,
  },
});
