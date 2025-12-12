// src/app/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SleepScreen from "../../features/sleep/SleepScreen";
import DevicePlaceScreen from "../../features/sleep/DevicePlaceScreen";
import AlarmScreen from "../../features/sleep/AlarmScreen";

import DiaryScreen from "../../features/diary/DiaryScreen";
import StatsScreen from "../../features/stats/StatsScreen";
import CareScreen from "../../features/care/CareScreen";

import ProfileScreen from "../../features/profile/ProfileScreen";
import SettingScreen from "../../features/profile/setting/SettingScreen";
import ProductSelectScreen from "../../features/profile/setting/ProductSelectScreen";
import AuthScreen from "../../features/profile/AuthScreen";
import SupportScreen from "../../features/profile/support/SupportScreen";
import NoticeDetailScreen from "../../features/profile/support/NoticeDetailScreen";
import QnaScreen from "../../features/profile/qna/QnaScreen";
import QnaWriteScreen from "../../features/profile/qna/QnaWriteScreen";

import SplashScreen from "../../features/auth/SplashScreen";

import LoginScreen from "../../features/auth/LoginScreen";
import SignupScreen from "../../features/auth/signup/SignupScreen";
import SignUpSuccessScreen from "../../features/auth/signup/SignUpSuccessScreen";
import PasswordScreen from "../../features/auth/password/PasswordScreen";
import PasswordAuthScreen from "../../features/auth/password/PasswordAuthScreen";
import PasswordChangeScreen from "../../features/auth/password/PasswordChangeScreen";
import PasswordSuccessScreen from "../../features/auth/password/PasswordSuccessScreen";

import InfoStep1Screen from "../../features/auth/info/InfoStep1Screen";
import InfoStep2Screen from "../../features/auth/info/InfoStep2Screen";
import InfoStep3Screen from "../../features/auth/info/InfoStep3Screen";
import InfoStep4Screen from "../../features/auth/info/InfoStep4Screen";

import SelfTestScreen from "../../features/auth/selftest/SelfTestScreen";
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainTab: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  SignupSuccess: undefined;
  Password: undefined;
  PasswordAuth: { email: string };
  PasswordChange: undefined;
  PasswordSuccess: undefined;
  InfoStep1: undefined;
  InfoStep2: { step1Data: string[] };
  InfoStep3: { step1Data: string[]; step2Data: any };
  InfoStep4: { step1Data: string[]; step2Data: any; step3Data: any };
  SelfTest: undefined;
};

export type SleepStackParamList = {
  Sleep: undefined;
  DevicePlace: undefined;
  Alarm: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Setting: undefined;
  ProductSelect: undefined;
  Auth: undefined;
  Support: undefined;
  NoticeDetail: {
    notice: {
      id: number;
      category: string;
      title: string;
      content: string;
      date?: string;
    };
  };
  Qna: undefined;
  QnaWrite: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const SleepStack = createNativeStackNavigator<SleepStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="SignupSuccess" component={SignUpSuccessScreen} />
      <AuthStack.Screen name="Password" component={PasswordScreen} />
      <AuthStack.Screen name="PasswordAuth" component={PasswordAuthScreen} />
      <AuthStack.Screen
        name="PasswordChange"
        component={PasswordChangeScreen}
      />
      <AuthStack.Screen
        name="PasswordSuccess"
        component={PasswordSuccessScreen}
      />
      <AuthStack.Screen name="InfoStep1" component={InfoStep1Screen} />
      <AuthStack.Screen name="InfoStep2" component={InfoStep2Screen} />
      <AuthStack.Screen name="InfoStep3" component={InfoStep3Screen} />
      <AuthStack.Screen name="InfoStep4" component={InfoStep4Screen} />
      <AuthStack.Screen name="SelfTest" component={SelfTestScreen} />
    </AuthStack.Navigator>
  );
};

const SleepStackNavigator = () => {
  return (
    <SleepStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SleepStack.Screen name="Sleep" component={SleepScreen} />
      <SleepStack.Screen name="DevicePlace" component={DevicePlaceScreen} />
      <SleepStack.Screen name="Alarm" component={AlarmScreen} />
    </SleepStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Setting" component={SettingScreen} />
      <ProfileStack.Screen
        name="ProductSelect"
        component={ProductSelectScreen}
      />
      <ProfileStack.Screen name="Auth" component={AuthScreen} />
      <ProfileStack.Screen name="Support" component={SupportScreen} />
      <ProfileStack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
      <ProfileStack.Screen name="Qna" component={QnaScreen} />
      <ProfileStack.Screen name="QnaWrite" component={QnaWriteScreen} />
    </ProfileStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray400,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: "transparent",
          height: 72 + insets.bottom,
          paddingBottom: Math.max(10, insets.bottom),
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "moon";

          if (route.name === "Sleep")
            iconName = focused ? "moon" : "moon-outline";
          if (route.name === "Diary")
            iconName = focused ? "book" : "book-outline";
          if (route.name === "Stats")
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          if (route.name === "Care")
            iconName = focused ? "heart" : "heart-outline";
          if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Sleep"
        component={SleepStackNavigator}
        options={{ title: "수면" }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{ title: "일지" }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: "통계" }}
      />
      <Tab.Screen
        name="Care"
        component={CareScreen}
        options={{ title: "케어" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: "프로필" }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const theme = useTheme();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        <RootStack.Screen name="MainTab" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
