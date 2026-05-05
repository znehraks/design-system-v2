import "../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "@designc/ui-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <Stack screenOptions={{ headerLargeTitle: true }}>
          <Stack.Screen name="index" options={{ title: "DesignC Native" }} />
        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
