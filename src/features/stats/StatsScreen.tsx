// src/screens/SleepScreen.tsx
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../../shared/theme/theme";

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>StatsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
});

export default StatsScreen;
