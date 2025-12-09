import { ThemeProvider } from "styled-components/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "./src/shared/theme/theme";
import RootNavigator from "./src/app/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
