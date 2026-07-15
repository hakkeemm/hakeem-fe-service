# Prompt: Initialize React Native frontend — حكيم (Hakeem)

Copy everything below into your AI coding assistant (Claude Code, Cursor, etc.) to scaffold the project.

---

## Project brief

Build the frontend for **حكيم (Hakeem)**, a mobile-first medical appointment booking app. **One React Native app serves three roles** — Patient, Doctor, and Assistant — with the UI dynamically rendered based on the role returned by the backend after login. There is no role selector at login; the role comes from the JWT.

**App name**: حكيم (Hakeem) — use this as the Expo app name, bundle display name, and package identifier base (e.g. `com.hakeem.app`). The app must fully support **both Arabic and English**, with Arabic treated as a first-class language, not an afterthought — expect a large share of users to run the app in Arabic/RTL by default.

**Scope note**: This repository is for the **mobile app only** (Patient, Doctor, Assistant). The internal Admin/Dev Team web dashboard is a **completely separate project** with its own repo, its own stack (React web), and its own timeline — do not scaffold it, reference it, or leave placeholder screens for it here. Nothing in this codebase should assume a web dashboard exists alongside it.

A separate internal admin web dashboard exists but is **out of scope for this app** — do not scaffold it here.

## App identity

- **App name**: حكيم (Hakeem)
- **Expo `app.json`**: set `"name": "Hakeem"`, `"slug": "hakeem"`, and localized display names — `"حكيم"` for the Arabic locale, `"Hakeem"` for the English locale (use `expo-localization` plus per-locale native config: iOS `CFBundleDisplayName` localization, Android `values-ar/strings.xml` and `values-en/strings.xml`)
- **Bundle identifier / package**: `com.hakeem.app` (iOS `bundleIdentifier`, Android `package`)
- **Default language**: ship with **Arabic as the default locale** and English as the secondary, matching the primary Egyptian user base — but make language fully user-switchable from first launch, not locked

## Tech stack

- **React Native** with **Expo** (managed workflow)
- **TypeScript** (strict mode)
- **React Navigation** (native stack + bottom tabs)
- **TanStack Query** for server state / data fetching
- **Zustand** for local/UI state (auth session, language preference)
- **React Hook Form + Zod** for forms and validation
- **i18next + react-i18next + react-native-localize** for EN/AR localization with full RTL support
- **@microsoft/signalr** client for real-time updates (slot availability, live queue)
- **react-native-keychain** for secure JWT storage (not AsyncStorage)
- **react-native-maps** for doctor location display
- **@react-native-firebase/messaging** for push notifications
- ESLint + Prettier, configured for TypeScript and React Native

## Folder structure

Scaffold the project with this structure. Keep each role's screens fully isolated under `features/`, and put anything reused across roles under `shared/`.

```
/src
  /app
    App.tsx                  // root component, providers, RTL setup
    RootNavigator.tsx         // auth gate → role-based navigator switch
  /features
    /auth
      screens/                // Login, ForgotPassword, ResetPassword, LanguageSelect
      hooks/                  // useLogin, useAuthSession
      api/                    // auth API calls
    /patient
      navigation/              // PatientTabNavigator, PatientStackNavigator
      screens/
        HomeScreen.tsx
        SearchResultsListScreen.tsx
        SearchResultsMapScreen.tsx
        FilterScreen.tsx
        DoctorProfileScreen.tsx
        SlotPickerScreen.tsx
        BookingConfirmScreen.tsx
        PaymentScreen.tsx
        BookingSuccessScreen.tsx
        MyAppointmentsScreen.tsx
        AppointmentDetailScreen.tsx
        RateReviewScreen.tsx
        ProfileScreen.tsx
      components/
      hooks/
      api/
    /doctor
      navigation/
      screens/
        DoctorHomeScreen.tsx
        ScheduleBuilderScreen.tsx
        AppointmentTimelineScreen.tsx
        AppointmentDetailScreen.tsx
        DoctorProfileEditScreen.tsx
        FeedbackInboxScreen.tsx
      components/
      hooks/
      api/
    /assistant
      navigation/
      screens/
        LiveQueueScreen.tsx
        ManualEntryScreen.tsx
        QueueHistoryScreen.tsx
      components/
      hooks/
      api/
  /shared
    /components               // Button, Input, Card, Badge, Modal, EmptyState, ErrorState, LoadingSpinner
    /theme                     // colors, typography, spacing tokens
    /i18n
      en.json
      ar.json
      index.ts
    /api
      client.ts                // axios/fetch instance, interceptors, token refresh
      signalr.ts                // SignalR connection setup
    /store
      authStore.ts              // Zustand: token, role, user
      languageStore.ts
    /hooks
      useRole.ts
      useRTL.ts
    /types
      user.ts
      appointment.ts
      doctor.ts
  /assets
    /icons
    /images
/app.json
/tsconfig.json
/.eslintrc.js
/.env.example
```

## Key implementation requirements

1. **Role-based navigation**: `RootNavigator.tsx` checks auth state, decodes the role from the stored JWT, and renders exactly one of `PatientTabNavigator`, `DoctorTabNavigator`, or `AssistantTabNavigator`. Never render UI for a role the user doesn't have.
2. **RTL support**: On app launch, read the stored language preference (default to **Arabic** on first install if the device locale is Arabic, otherwise fall back to English) and call `I18nManager.forceRTL(true/false)` before render. Note this requires a reload on native — handle the "restart required" UX for language switching. Test every screen in Arabic first, not as a retrofit — icons, form alignment, navigation gestures, and the app name "حكيم" itself should all read naturally RTL.
3. **Auth**: Store JWT + refresh token in `react-native-keychain`. Build an API client interceptor that auto-refreshes on 401 and retries the original request once.
4. **Every screen needs three states**: loading (skeleton or spinner), empty (friendly empty-state illustration/message), and error (retry action) — build shared components for all three now so screens use them consistently.
5. **SignalR**: Set up a single shared connection in `shared/api/signalr.ts`, established after login, torn down on logout. Patient screens subscribe to slot-availability events; Assistant screens subscribe to queue-update events.
6. **Design tokens first**: Before building screens, set up `shared/theme` with a color palette, spacing scale, and typography scale so every screen pulls from the same source — don't hardcode values in components.

## What to do first

1. Scaffold the Expo + TypeScript project with the folder structure above
2. Set up navigation shell with placeholder screens for all three roles (just a title text per screen is fine initially)
3. Wire up the auth flow end-to-end with a mocked API response (role: patient/doctor/assistant) to prove the role-based navigator switch works
4. Set up i18n with a placeholder EN/AR string and confirm RTL layout flips correctly
5. Then move on to building out real screens one feature at a time, starting with the Patient flow (Search → Doctor Profile → Book)

Do not implement the Admin web dashboard in this project — it lives in a separate repository entirely. Payment provider integration and push notification handling can be stubbed out with TODOs for now.
