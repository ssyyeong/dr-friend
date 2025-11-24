import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/shared/theme/theme";
import RootNavigator from "./src/app/navigation/RootNavigator";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <RootNavigator />
    </ThemeProvider>
  );
}
