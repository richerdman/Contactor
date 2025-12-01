import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";


export default function HomeScreen() {
	  {/* Router instance to navigate between screens: const router = useRouter(); */}
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contacts</Text>
            <Text style={styles.bottomText}>Add Contact</Text>
            {/* button router.push to add contact details*/}
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.lg,
        },
        title: {
            fontSize: FONT_SIZES.xlarge,
            fontWeight: "bold",
            color: COLORS.textPrimary,
            marginBottom: SPACING.sm,
        },
        bottomText: {
            fontSize: FONT_SIZES.medium,
            color: COLORS.primary,
            marginTop: SPACING.md,
        },
});
