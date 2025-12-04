import { Stack } from "expo-router";
import { COLORS } from "../src/constants/theme";

export default function Layout() {
  return (
      <Stack
          screenOptions={{
              headerStyle: {
                  backgroundColor: COLORS.primary,
              },
              headerTintColor: COLORS.white,
              headerTitleStyle: {
                  fontWeight: "bold",
              },
          }}
      >
          <Stack.Screen name="index" options={{ title: "Contacts" }} />
          <Stack.Screen name="addContact" options={{ title: 'Add Contact' }} />
          <Stack.Screen name="details" options={{ title: "Contact Details" }} />
      </Stack>
  );
}