// src/app/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import SleepScreen from "../../features/sleep/SleepScreen";
import DiaryScreen from "../../features/diary/DiaryScreen";
import StatsScreen from "../../features/stats/StatsScreen";
import CareScreen from "../../features/care/CareScreen";
import ProfileScreen from "../../features/profile/ProfileScreen";

import SplashScreen from "../../features/auth/SplashScreen";
import LoginScreen from "../../features/auth/LoginScreen";
import SignupScreen from "../../features/auth/signup/SignupScreen";
import SignUpSuccessScreen from "../../features/auth/signup/SignUpSuccessScreen";
import PasswordSuccessScreen from "../../features/auth/password/PasswordSuccessScreen";

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainTab: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  SignupSuccess: undefined;
  PasswordSuccess: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
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
      <AuthStack.Screen
        name="PasswordSuccess"
        component={PasswordSuccessScreen}
      />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray400,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: "transparent",
          height: 72,
          paddingBottom: 10,
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
        component={SleepScreen}
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
        component={ProfileScreen}
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
