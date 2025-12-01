import { StyleSheet, View } from 'react-native';
import ContactList from '../src/components/ContactList';
import { COLORS, FONT_SIZES, SPACING } from '../src/constants/theme';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ContactList />
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
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
