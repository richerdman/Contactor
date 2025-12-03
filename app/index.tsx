import { Text, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";
import { useContacts } from "../src/hooks/useContacts";
import { Contact } from "../src/types/types";

export default function HomeScreen() {
    const router = useRouter();
    const { contacts, loading } = useContacts();
    
    const renderContact = ({ item }: { item: Contact }) => (
        <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contacts</Text>
            
            <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={renderContact}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No contacts available. Add one to get started!</Text>
                }
            />
            
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/addContact')}
            >
                <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZES.xlarge,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        textAlign: "center",
    },
    listContent: {
        flexGrow: 1,
    },
    contactItem: {
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        marginBottom: SPACING.sm,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    contactName: {
        fontSize: FONT_SIZES.medium,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    contactPhone: {
        fontSize: FONT_SIZES.small,
        color: COLORS.textSecondary,
    },
    loadingText: {
        marginTop: SPACING.md,
        color: COLORS.textSecondary,
    },
    addButton: {
        marginTop: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.medium,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        color: COLORS.border,
        fontSize: FONT_SIZES.medium,
        marginTop: SPACING.xl,
    },
});